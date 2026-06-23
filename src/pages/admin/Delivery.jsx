import { useState } from 'react'
import { Truck, Save, Package, Clock, IndianRupee, MapPin, CreditCard } from 'lucide-react'
import { useStore } from '../../context/StoreContext'

export default function AdminDelivery() {
  const { state, dispatch, toast } = useStore()
  const [form, setForm] = useState({ ...state.delivery })
  const [saved, setSaved] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setDays = (k, v) => setForm(f => ({ ...f, estimatedDays: { ...f.estimatedDays, [k]: v } }))

  const handleSave = () => {
    dispatch({ type: 'UPDATE_DELIVERY', payload: form })
    toast('Delivery settings saved!')
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Delivery Settings</h1>
        <p style={{ fontSize: 13, color: 'var(--text-medium)' }}>Configure shipping rates and delivery options</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, alignItems: 'start' }}>
        {/* Shipping Rates */}
        <div className="adm-card">
          <div className="adm-card-hdr">
            <div className="adm-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Truck size={16} color="var(--primary)" /> Shipping Rates
            </div>
          </div>
          <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="frow">
              <label>Free Shipping Threshold (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-medium)' }}>₹</span>
                <input className="finput" type="number" value={form.freeShippingThreshold} onChange={e => set('freeShippingThreshold', Number(e.target.value))} style={{ paddingLeft: 28 }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-medium)', marginTop: 4 }}>Orders above this amount get free standard shipping</div>
            </div>
            <div className="frow">
              <label>Standard Shipping Rate (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-medium)' }}>₹</span>
                <input className="finput" type="number" value={form.standardRate} onChange={e => set('standardRate', Number(e.target.value))} style={{ paddingLeft: 28 }} />
              </div>
            </div>
            <div className="frow">
              <label>Express Shipping Rate (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-medium)' }}>₹</span>
                <input className="finput" type="number" value={form.expressRate} onChange={e => set('expressRate', Number(e.target.value))} style={{ paddingLeft: 28 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Times */}
        <div className="adm-card">
          <div className="adm-card-hdr">
            <div className="adm-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} color="var(--primary)" /> Delivery Timeframes
            </div>
          </div>
          <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="frow">
              <label>Standard Delivery (e.g. "5-7")</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input className="finput" value={form.estimatedDays.standard} onChange={e => setDays('standard', e.target.value)} placeholder="5-7" />
                <span style={{ color: 'var(--text-medium)', fontSize: 13, whiteSpace: 'nowrap' }}>business days</span>
              </div>
            </div>
            <div className="frow">
              <label>Express Delivery (e.g. "2-3")</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input className="finput" value={form.estimatedDays.express} onChange={e => setDays('express', e.target.value)} placeholder="2-3" />
                <span style={{ color: 'var(--text-medium)', fontSize: 13, whiteSpace: 'nowrap' }}>business days</span>
              </div>
            </div>
            <div className="frow">
              <label>Shipping Carrier / Partner</label>
              <input className="finput" value={form.carrier} onChange={e => set('carrier', e.target.value)} placeholder="India Post / Delhivery" />
            </div>
          </div>
        </div>

        {/* COD Settings */}
        <div className="adm-card">
          <div className="adm-card-hdr">
            <div className="adm-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CreditCard size={16} color="var(--primary)" /> Cash on Delivery
            </div>
          </div>
          <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
              <input type="checkbox" checked={form.codAvailable} onChange={e => set('codAvailable', e.target.checked)} style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
              <div>
                <div style={{ fontWeight: 600 }}>Enable Cash on Delivery</div>
                <div style={{ fontSize: 12, color: 'var(--text-medium)' }}>Allow customers to pay on delivery</div>
              </div>
            </label>
            {form.codAvailable && (
              <div className="frow">
                <label>COD Handling Charge (₹)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-medium)' }}>₹</span>
                  <input className="finput" type="number" value={form.codCharge} onChange={e => set('codCharge', Number(e.target.value))} style={{ paddingLeft: 28 }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Service Areas */}
        <div className="adm-card">
          <div className="adm-card-hdr">
            <div className="adm-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={16} color="var(--primary)" /> Service Areas
            </div>
          </div>
          <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="frow">
              <label>Serviceable Pincodes / Areas</label>
              <input className="finput" value={form.servicePincodes} onChange={e => set('servicePincodes', e.target.value)} placeholder="All India / Specific pincodes" />
              <div style={{ fontSize: 12, color: 'var(--text-medium)', marginTop: 4 }}>Enter "All India" for nationwide shipping</div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="adm-card" style={{ marginTop: 0 }}>
        <div className="adm-card-hdr">
          <div className="adm-card-title">Checkout Preview</div>
          <span style={{ fontSize: 12, color: 'var(--text-medium)' }}>How it appears to customers</span>
        </div>
        <div style={{ padding: 22, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { icon: '🚚', title: `Standard Delivery`, sub: `${form.estimatedDays.standard} business days`, price: `₹${form.standardRate} (Free above ₹${form.freeShippingThreshold})` },
            { icon: '⚡', title: 'Express Delivery', sub: `${form.estimatedDays.express} business days`, price: `₹${form.expressRate}` },
            { icon: '💰', title: 'Cash on Delivery', sub: form.codAvailable ? 'Available' : 'Not available', price: form.codAvailable ? `+₹${form.codCharge} COD charge` : '—' }
          ].map(({ icon, title, sub, price }) => (
            <div key={title} style={{ background: 'var(--cream)', borderRadius: 'var(--radius)', padding: '14px 16px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-medium)', margin: '4px 0' }}>{sub}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>{price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
        <button className="btn btn-primary btn-lg" onClick={handleSave}>
          <Save size={16} /> {saved ? 'Saved! ✓' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
