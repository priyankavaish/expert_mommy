import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import { INITIAL_PRODUCTS, INITIAL_DELIVERY } from '../data/initialData'

const StoreContext = createContext()
const CART_KEY = 'expertMommy_cart'
const ADMIN_ACTIONS = new Set([
  'ADD_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT', 'SET_SITE_IMAGES',
  'UPDATE_ORDER', 'DELETE_USER', 'ADD_COUPON', 'UPDATE_COUPON', 'DELETE_COUPON', 'UPDATE_DELIVERY',
])

const defaultState = {
  products: INITIAL_PRODUCTS, siteImages: {}, handmadeGallery: null,
  cart: [], isAdminLoggedIn: false, checkingAdmin: true, catalogueError: false,
  orders: [], users: [], coupons: [], delivery: INITIAL_DELIVERY, toasts: [],
}

function loadState() {
  try {
    const saved = localStorage.getItem(CART_KEY)
    const legacy = JSON.parse(localStorage.getItem('expertMommy_v1'))
    const cart = saved ? JSON.parse(saved) : legacy?.cart
    return { ...defaultState, cart: Array.isArray(cart) ? cart.filter(item => typeof item?.productId === 'string').map(({ productId }) => ({ productId, qty: 1 })) : [] }
  } catch {
    return defaultState
  }
}

async function api(path, method = 'GET', payload, signal) {
  const response = await fetch('/api/' + path, {
    method, signal, credentials: 'same-origin', cache: 'no-store',
    ...(payload === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || !response.headers.get('Content-Type')?.includes('application/json')) {
    throw Object.assign(new Error(data?.error || 'Store service is unavailable.'), { status: response.status })
  }
  return data
}

function getStoreData(state) {
  const { products, siteImages, handmadeGallery, orders, users, coupons, delivery } = state
  return { products, siteImages, handmadeGallery, orders, users, coupons, delivery }
}

function reducer(state, action) {
  switch (action.type) {
    case 'CATALOGUE_LOADED':
      return { ...state, ...action.payload, catalogueError: false }
    case 'CATALOGUE_ERROR':
      return { ...state, catalogueError: true }
    case 'ADMIN_LOADED':
      return { ...state, ...action.payload, isAdminLoggedIn: true, checkingAdmin: false }
    case 'LOGOUT_ADMIN':
      return { ...state, checkingAdmin: false, isAdminLoggedIn: false, orders: [], users: [], coupons: [], delivery: INITIAL_DELIVERY }
    case 'ADD_TO_CART': {
      const { productId } = action.payload
      if (!state.products.some(p => p.id === productId && p.stock > 0) || state.cart.some(i => i.productId === productId)) return state
      return { ...state, cart: [...state.cart, { productId, qty: 1 }] }
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.productId !== action.payload) }
    case 'CLEAR_CART':
      return { ...state, cart: [] }
    case 'SET_SITE_IMAGES':
      return { ...state, ...action.payload }
    case 'ADD_PRODUCT':
      return { ...state, products: [action.payload, ...state.products] }
    case 'UPDATE_PRODUCT':
      return { ...state, products: state.products.map(p => p.id === action.payload.id ? action.payload : p) }
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) }
    case 'UPDATE_ORDER':
      return { ...state, orders: state.orders.map(o => o.id === action.payload.id ? action.payload : o) }
    case 'DELETE_USER':
      return { ...state, users: state.users.filter(u => u.id !== action.payload) }
    case 'ADD_COUPON':
      return { ...state, coupons: [action.payload, ...state.coupons] }
    case 'UPDATE_COUPON':
      return { ...state, coupons: state.coupons.map(c => c.id === action.payload.id ? action.payload : c) }
    case 'DELETE_COUPON':
      return { ...state, coupons: state.coupons.filter(c => c.id !== action.payload) }
    case 'UPDATE_DELIVERY':
      return { ...state, delivery: { ...state.delivery, ...action.payload } }
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, { id: crypto.randomUUID(), ...action.payload }] }
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) }
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, apply] = useReducer(reducer, null, loadState)
  const revision = useRef(null)
  const saving = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    async function load() {
      try {
        const data = await api('catalogue', 'GET', undefined, signal)
        apply({ type: 'CATALOGUE_LOADED', payload: data })
      } catch {
        if (!signal.aborted) apply({ type: 'CATALOGUE_ERROR' })
      }
      try {
        const snapshot = await api('admin/store', 'GET', undefined, signal)
        revision.current = snapshot.revision
        apply({ type: 'ADMIN_LOADED', payload: snapshot.data })
      } catch {
        if (!signal.aborted) apply({ type: 'LOGOUT_ADMIN' })
      }
    }
    load()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    try {
      const legacy = JSON.parse(localStorage.getItem('expertMommy_v1'))
      if (legacy) {
        const { products, siteImages, handmadeGallery } = legacy
        localStorage.setItem('expertMommy_v1', JSON.stringify({ products, siteImages, handmadeGallery }))
        localStorage.setItem('expertMommy_legacyCatalogue', JSON.stringify({ products, siteImages, handmadeGallery }))
        localStorage.removeItem('expertMommy_v1')
      }
    } catch { /* The sanitized legacy backup can remain under its original key. */ }
    try { localStorage.setItem(CART_KEY, JSON.stringify(state.cart)) } catch { /* Continue with an in-memory cart. */ }
  }, [state.cart])

  useEffect(() => {
    if (!state.toasts.length) return
    const timer = setTimeout(() => apply({ type: 'REMOVE_TOAST', payload: state.toasts[0].id }), 3500)
    return () => clearTimeout(timer)
  }, [state.toasts])

  const toast = (msg, type = 'success') => apply({ type: 'ADD_TOAST', payload: { msg, type } })

  const loginAdmin = async credentials => {
    await api('admin/login', 'POST', credentials)
    const snapshot = await api('admin/store')
    revision.current = snapshot.revision
    apply({ type: 'ADMIN_LOADED', payload: snapshot.data })
  }

  const logoutAdmin = async () => {
    if (saving.current) return false
    try {
      await api('admin/logout', 'POST')
      revision.current = null
      apply({ type: 'LOGOUT_ADMIN' })
      return true
    } catch (error) {
      toast(error.message, 'error')
      return false
    }
  }

  const saveAction = async action => {
    if (saving.current) {
      toast('A save is already in progress.', 'error')
      return false
    }
    saving.current = true
    try {
      const data = getStoreData(reducer(state, action))
      const saved = await api('admin/store', 'PUT', { revision: revision.current, data })
      revision.current = saved.revision
      apply({ type: 'ADMIN_LOADED', payload: saved.data })
      return true
    } catch (error) {
      if (error.status === 401) apply({ type: 'LOGOUT_ADMIN' })
      toast(error.message, 'error')
      return false
    } finally {
      saving.current = false
    }
  }

  const dispatch = action => ADMIN_ACTIONS.has(action.type) ? saveAction(action) : apply(action)
  const saveProduct = (product, isNew) => saveAction({ type: isNew ? 'ADD_PRODUCT' : 'UPDATE_PRODUCT', payload: product })
  const saveSiteImages = (siteImages, handmadeGallery) => saveAction({ type: 'SET_SITE_IMAGES', payload: { siteImages, handmadeGallery } })

  return (
    <StoreContext.Provider value={{ state, dispatch, toast, saveProduct, saveSiteImages, loginAdmin, logoutAdmin }}>
      {state.catalogueError && <div className="atelier-announcement" role="status">Live stock and prices are temporarily unavailable. Please confirm details on WhatsApp.</div>}
      {children}
      <div className="toast-wrap" aria-live="polite">
        {state.toasts.map(t => <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>)}
      </div>
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
