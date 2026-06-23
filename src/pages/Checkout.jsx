import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CreditCard, Truck, CheckCircle } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Checkout() {
  const { state, dispatch, cartTotal, toast } = useStore()
  const navigate = useNavigate()
  const { delivery } = state

  const [form, setForm] = useState({
    firstName: state.user?.name?.split(' ')[0] || '',
    lastName: state.user?.name?.split(' ')[1] || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'upi'
  })
  const [step, setStep] = useState(1)
  const [placed, setPlaced] = useState(false)

  const shipping = cartTotal >= delivery.freeShippingThreshold ? 0 : delivery.standardRate
  const total = cartTotal + shipping

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handlePlaceOrder = () => {
    if (!form.firstName || !form.address || !form.phone || !form.pincode) {
      toast('Please fill all required fields', 'error'); return
    }
    const order = {
      userId: state.user?.id || 'guest',
      customerName: `${form.firstName} ${form.lastName}`,
      customerEmail: form.email,
      items: state.cart.map(i => ({ productId: i.productId, name: i.name, qty: i.qty, price: i.price, image: i.image })),
      subtotal: cartTotal,
      discount: 0,
      shipping,
      total,
      status: 'pending',
      paymentMethod: form.paymentMethod,
      address: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`
    }
    dispatch({ type: 'PLACE_ORDER', payload: order })
    dispatch({ type: 'CLEAR_CART' })
    setPlaced(true)
  }

  if (placed) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, background: '#E8F5E9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#2E7D32' }}>
          <CheckCircle size={40} />
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: 10 }}>Order Placed Successfully! 🎉</h2>
        <p style={{ color: 'var(--text-medium)', marginBottom: 28, fontSize: 15 }}>
          Thank you for your order! We'll send you a confirmation email shortly.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/shop')}>Continue Shopping</button>
          <button className="btn btn-outline btn-lg" onClick={() => navigate('/login')}>View My Orders</button>
        </div>
      </div>
    )
  }

  if (state.cart.length === 0) {
    navigate('/cart'); return null
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 style={{ fontSize: '1.8rem', marginBottom: 28 }}>Checkout</h1>

        <div className="checkout-grid">
          <div>
            {/* Step 1: Shipping */}
            <div className="form-card">
              <div className="form-card-title"><MapPin size={18} /> Shipping Address</div>
              <div className="form-grid">
                <div className="fg">
                  <label className="flabel">First Name *</label>
                  <input className="finput" value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Priya" />
                </div>
                <div className="fg">
                  <label className="flabel">Last Name</label>
                  <input className="finput" value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Sharma" />
                </div>
                <div className="fg">
                  <label className="flabel">Email</label>
                  <input className="finput" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="priya@example.com" />
                </div>
                <div className="fg">
                  <label className="flabel">Phone *</label>
                  <input className="finput" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" />
                </div>
                <div className="fg full">
                  <label className="flabel">Address *</label>
                  <input className="finput" value={form.address} onChange={e => set('address', e.target.value)} placeholder="House no, Street, Area" />
                </div>
                <div className="fg">
                  <label className="flabel">City *</label>
                  <input className="finput" value={form.city} onChange={e => set('city', e.target.value)} placeholder="Mumbai" />
                </div>
                <div className="fg">
                  <label className="flabel">State</label>
                  <select className="fselect" value={form.state} onChange={e => set('state', e.target.value)}>
                    <option value="">Select State</option>
                    {['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'West Bengal', 'Uttar Pradesh', 'Kerala', 'Punjab'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="fg">
                  <label className="flabel">PIN Code *</label>
                  <input className="finput" value={form.pincode} onChange={e => set('pincode', e.target.value)} placeholder="400001" maxLength={6} />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery */}
            <div className="form-card">
              <div className="form-card-title"><Truck size={18} /> Delivery Method</div>
              {[
                { key: 'standard', label: `Standard Delivery (${delivery.estimatedDays.standard} days)`, price: shipping === 0 ? 'Free' : `₹${delivery.standardRate}` },
                { key: 'express', label: `Express Delivery (${delivery.estimatedDays.express} days)`, price: `₹${delivery.expressRate}` }
              ].map(opt => (
                <div key={opt.key} className={`payment-opt ${form.deliveryMethod === opt.key ? 'sel' : ''}`} onClick={() => set('deliveryMethod', opt.key)}>
                  <input type="radio" name="delivery" checked={form.deliveryMethod === opt.key || (!form.deliveryMethod && opt.key === 'standard')} readOnly />
                  <div style={{ flex: 1 }}>
                    <div className="payment-lbl">{opt.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-medium)', marginTop: 2 }}>Via {delivery.carrier}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: opt.price === 'Free' ? '#2E7D32' : 'var(--text-dark)' }}>{opt.price}</div>
                </div>
              ))}
            </div>

            {/* Step 3: Payment */}
            <div className="form-card">
              <div className="form-card-title"><CreditCard size={18} /> Payment Method</div>
              {[
                { key: 'upi', label: 'UPI / QR Code', sub: 'PhonePe, GPay, Paytm, etc.' },
                { key: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
                { key: 'netbanking', label: 'Net Banking', sub: 'All major banks' },
                { key: 'cod', label: `Cash on Delivery (+₹${delivery.codCharge})`, sub: 'Pay when your order arrives' }
              ].map(opt => (
                <div key={opt.key} className={`payment-opt ${form.paymentMethod === opt.key ? 'sel' : ''}`} onClick={() => set('paymentMethod', opt.key)}>
                  <input type="radio" name="payment" checked={form.paymentMethod === opt.key} readOnly />
                  <div>
                    <div className="payment-lbl">{opt.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-medium)' }}>{opt.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="cart-summary" style={{ top: 88 }}>
              <div className="summary-ttl">Order Summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14, maxHeight: 240, overflowY: 'auto' }}>
                {state.cart.map(item => (
                  <div key={item.productId} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6, background: 'var(--cream)', flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: 13 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{item.name}</div>
                      <div style={{ color: 'var(--text-light)' }}>Qty: {item.qty}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 14 }}>₹{(item.price * item.qty).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="sum-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
              <div className="sum-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span style={{ color: '#2E7D32', fontWeight: 600 }}>Free</span> : `₹${shipping}`}</span>
              </div>
              {form.paymentMethod === 'cod' && (
                <div className="sum-row"><span>COD Charge</span><span>₹{delivery.codCharge}</span></div>
              )}
              <div className="sum-row total">
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>₹{(total + (form.paymentMethod === 'cod' ? delivery.codCharge : 0)).toLocaleString()}</span>
              </div>
              <button className="btn btn-primary w-full btn-lg" style={{ marginTop: 20 }} onClick={handlePlaceOrder}>
                Place Order
              </button>
              <p style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--text-light)', marginTop: 10 }}>
                🔒 SSL Secured • 100% Safe Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
