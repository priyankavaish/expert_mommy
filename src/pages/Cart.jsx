import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Cart() {
  const { state, dispatch, cartTotal, toast, applyCoupon } = useStore()
  const navigate = useNavigate()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')

  const { delivery } = state
  const shipping = cartTotal >= delivery.freeShippingThreshold ? 0 : delivery.standardRate

  let discount = 0
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') discount = Math.round(cartTotal * appliedCoupon.value / 100)
    else discount = appliedCoupon.value
    discount = Math.min(discount, cartTotal)
  }

  const total = cartTotal + shipping - discount

  const handleApplyCoupon = () => {
    setCouponError('')
    const coupon = applyCoupon(couponCode)
    if (!coupon) { setCouponError('Invalid or expired coupon code'); return }
    if (cartTotal < coupon.minOrder) { setCouponError(`Minimum order ₹${coupon.minOrder} required`); return }
    setAppliedCoupon(coupon)
    toast('Coupon applied successfully!')
  }

  if (state.cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: 80 }}>
            <div className="empty-icon">🛍️</div>
            <div className="empty-title">Your cart is empty</div>
            <div className="empty-desc">Add some beautiful handcrafted items to your cart!</div>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/shop')}>
              <ShoppingBag size={16} /> Shop Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 style={{ fontSize: '1.8rem', marginBottom: 28 }}>Shopping Cart <span style={{ fontSize: 16, color: 'var(--text-medium)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>({state.cart.length} items)</span></h1>

        <div className="cart-layout">
          {/* Items */}
          <div>
            <div className="cart-items-list">
              {state.cart.map(item => (
                <div key={item.productId} className="cart-item">
                  <img src={item.image} alt={item.name} className="citem-img" onClick={() => navigate(`/product/${item.productId}`)} style={{ cursor: 'pointer' }} />
                  <div>
                    <div className="citem-name" onClick={() => navigate(`/product/${item.productId}`)} style={{ cursor: 'pointer' }}>{item.name}</div>
                    <div className="citem-cat">{item.category}</div>
                    <div className="citem-price">₹{item.price.toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 16 }}>
                      ₹{(item.price * item.qty).toLocaleString()}
                    </div>
                    <div className="qty-wrap" style={{ margin: 0 }}>
                      <button className="qty-btn" style={{ width: 32, height: 32 }} onClick={() => dispatch({ type: 'UPDATE_CART_QTY', payload: { productId: item.productId, qty: item.qty - 1 } })}>
                        <Minus size={13} />
                      </button>
                      <div className="qty-num" style={{ width: 40, height: 32, lineHeight: '32px', fontSize: 13 }}>{item.qty}</div>
                      <button className="qty-btn" style={{ width: 32, height: 32 }} onClick={() => dispatch({ type: 'UPDATE_CART_QTY', payload: { productId: item.productId, qty: item.qty + 1 } })}>
                        <Plus size={13} />
                      </button>
                    </div>
                    <button className="citem-remove" onClick={() => { dispatch({ type: 'REMOVE_FROM_CART', payload: item.productId }); toast('Item removed', 'error') }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => navigate('/shop')}>← Continue Shopping</button>
              <button className="btn btn-ghost" style={{ color: '#C62828', borderColor: '#C62828' }} onClick={() => dispatch({ type: 'CLEAR_CART' })}>
                <Trash2 size={14} /> Clear Cart
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <div className="summary-ttl">Order Summary</div>

            <div className="sum-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
            {discount > 0 && <div className="sum-row" style={{ color: '#2E7D32' }}><span>Discount ({appliedCoupon.code})</span><span>−₹{discount}</span></div>}
            <div className="sum-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span style={{ color: '#2E7D32', fontWeight: 600 }}>Free</span> : `₹${shipping}`}</span>
            </div>
            {shipping > 0 && (
              <p style={{ fontSize: 12, color: 'var(--text-medium)', marginTop: -6, marginBottom: 8 }}>
                Add ₹{(delivery.freeShippingThreshold - cartTotal).toLocaleString()} more for free shipping
              </p>
            )}

            {/* Coupon */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 14, marginTop: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Tag size={14} color="var(--primary)" /> Have a coupon?
              </div>
              <div className="coupon-row">
                <input className="coupon-inp" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter code" />
                <button className="btn btn-primary btn-sm" onClick={handleApplyCoupon}>Apply</button>
              </div>
              {couponError && <p style={{ fontSize: 12, color: '#C62828', marginTop: 5 }}>{couponError}</p>}
            </div>

            <div className="sum-row total" style={{ borderTop: '2px solid var(--border)', marginTop: 10 }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)', fontSize: 18 }}>₹{total.toLocaleString()}</span>
            </div>

            <button className="btn btn-primary w-full btn-lg" style={{ marginTop: 18 }} onClick={() => navigate('/checkout')}>
              Proceed to Checkout <ArrowRight size={16} />
            </button>

            <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: 'var(--text-light)' }}>
              🔒 Secure & Encrypted Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
