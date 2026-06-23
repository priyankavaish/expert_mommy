import { createContext, useContext, useReducer, useEffect } from 'react'
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS, INITIAL_COUPONS, INITIAL_DELIVERY } from '../data/initialData'

const StoreContext = createContext()

const defaultState = {
  products: INITIAL_PRODUCTS,
  cart: [],
  wishlist: [],
  user: null,
  isAdminLoggedIn: false,
  orders: INITIAL_ORDERS,
  users: INITIAL_USERS,
  coupons: INITIAL_COUPONS,
  delivery: INITIAL_DELIVERY,
  toasts: []
}

function loadState() {
  try {
    const saved = localStorage.getItem('expertMommy_v1')
    if (!saved) return defaultState
    const parsed = JSON.parse(saved)
    // Re-attach images (they are module references, not serializable)
    const productsWithImages = parsed.products.map(p => {
      const orig = INITIAL_PRODUCTS.find(op => op.id === p.id)
      return orig ? { ...p, image: orig.image } : p
    })
    const ordersWithImages = (parsed.orders || []).map(o => ({
      ...o,
      items: o.items.map(item => {
        const prod = INITIAL_PRODUCTS.find(p => p.id === item.productId)
        return { ...item, image: prod ? prod.image : item.image }
      })
    }))
    return {
      ...defaultState,
      ...parsed,
      products: productsWithImages,
      orders: ordersWithImages,
      toasts: []
    }
  } catch {
    return defaultState
  }
}

function reducer(state, action) {
  switch (action.type) {
    /* ── Cart ── */
    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.productId === action.payload.productId)
      if (existing) {
        return { ...state, cart: state.cart.map(i => i.productId === action.payload.productId ? { ...i, qty: i.qty + action.payload.qty } : i) }
      }
      return { ...state, cart: [...state.cart, action.payload] }
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.productId !== action.payload) }
    case 'UPDATE_CART_QTY':
      return { ...state, cart: state.cart.map(i => i.productId === action.payload.productId ? { ...i, qty: Math.max(1, action.payload.qty) } : i) }
    case 'CLEAR_CART':
      return { ...state, cart: [] }

    /* ── Wishlist ── */
    case 'TOGGLE_WISHLIST': {
      const inWL = state.wishlist.includes(action.payload)
      return { ...state, wishlist: inWL ? state.wishlist.filter(id => id !== action.payload) : [...state.wishlist, action.payload] }
    }

    /* ── Auth ── */
    case 'LOGIN_USER':
      return { ...state, user: action.payload }
    case 'LOGOUT_USER':
      return { ...state, user: null }
    case 'LOGIN_ADMIN':
      return { ...state, isAdminLoggedIn: true }
    case 'LOGOUT_ADMIN':
      return { ...state, isAdminLoggedIn: false }
    case 'REGISTER_USER': {
      const newUser = { ...action.payload, id: 'u' + Date.now(), role: 'customer', createdAt: new Date().toISOString().split('T')[0], orders: [] }
      return { ...state, users: [...state.users, newUser], user: newUser }
    }

    /* ── Products ── */
    case 'ADD_PRODUCT':
      return { ...state, products: [action.payload, ...state.products] }
    case 'UPDATE_PRODUCT':
      return { ...state, products: state.products.map(p => p.id === action.payload.id ? action.payload : p) }
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) }

    /* ── Orders ── */
    case 'PLACE_ORDER': {
      const newOrder = { ...action.payload, id: 'o' + Date.now(), createdAt: new Date().toISOString().split('T')[0], tracking: '' }
      const updatedUsers = state.users.map(u => u.id === newOrder.userId ? { ...u, orders: [...u.orders, newOrder.id] } : u)
      const updatedProducts = state.products.map(prod => {
        const item = newOrder.items.find(i => i.productId === prod.id)
        return item ? { ...prod, stock: Math.max(0, prod.stock - item.qty) } : prod
      })
      return { ...state, orders: [newOrder, ...state.orders], users: updatedUsers, products: updatedProducts }
    }
    case 'UPDATE_ORDER':
      return { ...state, orders: state.orders.map(o => o.id === action.payload.id ? action.payload : o) }
    case 'DELETE_ORDER':
      return { ...state, orders: state.orders.filter(o => o.id !== action.payload) }

    /* ── Users ── */
    case 'UPDATE_USER':
      return { ...state, users: state.users.map(u => u.id === action.payload.id ? action.payload : u) }
    case 'DELETE_USER':
      return { ...state, users: state.users.filter(u => u.id !== action.payload) }

    /* ── Coupons ── */
    case 'ADD_COUPON':
      return { ...state, coupons: [action.payload, ...state.coupons] }
    case 'UPDATE_COUPON':
      return { ...state, coupons: state.coupons.map(c => c.id === action.payload.id ? action.payload : c) }
    case 'DELETE_COUPON':
      return { ...state, coupons: state.coupons.filter(c => c.id !== action.payload) }
    case 'USE_COUPON':
      return { ...state, coupons: state.coupons.map(c => c.code === action.payload ? { ...c, usedCount: c.usedCount + 1 } : c) }

    /* ── Delivery ── */
    case 'UPDATE_DELIVERY':
      return { ...state, delivery: { ...state.delivery, ...action.payload } }

    /* ── Toasts ── */
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, { id: Date.now(), ...action.payload }] }
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) }

    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState)

  useEffect(() => {
    const { toasts, ...persistable } = state
    localStorage.setItem('expertMommy_v1', JSON.stringify(persistable))
  }, [state])

  // Auto-remove toasts after 3s
  useEffect(() => {
    if (state.toasts.length === 0) return
    const timer = setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: state.toasts[0].id })
    }, 3000)
    return () => clearTimeout(timer)
  }, [state.toasts])

  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0)

  const toast = (msg, type = 'success') => dispatch({ type: 'ADD_TOAST', payload: { msg, type } })

  const applyCoupon = (code) => {
    const coupon = state.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active)
    return coupon || null
  }

  return (
    <StoreContext.Provider value={{ state, dispatch, cartCount, cartTotal, toast, applyCoupon }}>
      {children}
      <ToastContainer toasts={state.toasts} dispatch={dispatch} />
    </StoreContext.Provider>
  )
}

function ToastContainer({ toasts, dispatch }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`} onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: t.id })}>
          {t.type === 'success' ? '✓' : '✕'} {t.msg}
        </div>
      ))}
    </div>
  )
}

export const useStore = () => useContext(StoreContext)
