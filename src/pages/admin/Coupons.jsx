import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Tag, Copy } from 'lucide-react'
import { useStore } from '../../context/StoreContext'

const EMPTY = { code: '', type: 'percentage', value: '', minOrder: '', maxUses: '', expiryDate: '', active: true, description: '' }

export default function AdminCoupons() {
  const { state, dispatch, toast } = useStore()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [deleteId, setDeleteId] = useState(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openAdd = () => { setForm(EMPTY); setModal('add') }
  const openEdit = (c) => { setForm({ ...c, value: String(c.value), minOrder: String(c.minOrder), maxUses: String(c.maxUses) }); setModal('edit') }

  const handleSave = () => {
    if (!form.code || !form.value) { toast('Fill required fields', 'error'); return }
    const coupon = { ...form, value: Number(form.value), minOrder: Number(form.minOrder) || 0, maxUses: Number(form.maxUses) || 100, usedCount: form.usedCount || 0 }
    if (modal === 'add') {
      dispatch({ type: 'ADD_COUPON', payload: { ...coupon, id: 'c' + Date.now() } })
      toast('Coupon created!')
    } else {
      dispatch({ type: 'UPDATE_COUPON', payload: coupon })
      toast('Coupon updated!')
    }
    setModal(null)
  }

  const handleDelete = () => {
    dispatch({ type: 'DELETE_COUPON', payload: deleteId })
    toast('Coupon deleted', 'error')
    setDeleteId(null)
  }

  const toggleActive = (coupon) => {
    dispatch({ type: 'UPDATE_COUPON', payload: { ...coupon, active: !coupon.active } })
    toast(`Coupon ${coupon.active ? 'deactivated' : 'activated'}`)
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => toast(`Code "${code}" copied!`))
  }

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Coupons & Discounts</h1>
        <p style={{ fontSize: 13, color: 'var(--text-medium)' }}>Create and manage discount coupons</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 22 }}>
        {[
          { label: 'Total Coupons', value: state.coupons.length },
          { label: 'Active Coupons', value: state.coupons.filter(c => c.active).length },
          { label: 'Total Uses', value: state.coupons.reduce((s, c) => s + c.usedCount, 0) }
        ].map(({ label, value }) => (
          <div key={label} className="adm-card" style={{ padding: '18px 22px' }}>
            <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{value}</div>
          </div>
        ))}
      </div>

      <div className="adm-toolbar" style={{ marginBottom: 18 }}>
        <div />
        <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={14} /> Create Coupon</button>
      </div>

      <div className="adm-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Min Order</th>
              <th>Used / Max</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.coupons.map(coupon => (
              <tr key={coupon.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Tag size={14} color="var(--primary)" />
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14 }}>{coupon.code}</span>
                    <button onClick={() => copyCode(coupon.code)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>
                      <Copy size={12} />
                    </button>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-light)' }}>{coupon.description}</div>
                </td>
                <td style={{ textTransform: 'capitalize' }}>{coupon.type}</td>
                <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                  {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                </td>
                <td>₹{coupon.minOrder}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ height: 6, flex: 1, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'var(--primary)', width: `${Math.min(100, (coupon.usedCount / coupon.maxUses) * 100)}%` }} />
                    </div>
                    <span style={{ fontSize: 12 }}>{coupon.usedCount}/{coupon.maxUses}</span>
                  </div>
                </td>
                <td style={{ fontSize: 12.5, color: new Date(coupon.expiryDate) < new Date() ? '#C62828' : 'var(--text-medium)' }}>
                  {coupon.expiryDate}
                </td>
                <td>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={coupon.active} onChange={() => toggleActive(coupon)} style={{ accentColor: 'var(--primary)', width: 14, height: 14 }} />
                    <span className={`badge ${coupon.active ? 'badge-green' : 'badge-red'}`}>{coupon.active ? 'Active' : 'Inactive'}</span>
                  </label>
                </td>
                <td>
                  <div className="tbl-actions">
                    <button className="tbl-act edit" onClick={() => openEdit(coupon)}><Edit2 size={13} /></button>
                    <button className="tbl-act del" onClick={() => setDeleteId(coupon.id)}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {state.coupons.length === 0 && (
          <div className="empty-state"><div className="empty-icon">🏷️</div><div className="empty-title">No coupons yet</div><button className="btn btn-primary btn-sm" onClick={openAdd}>Create First Coupon</button></div>
        )}
      </div>

      {/* Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-hdr">
              <div className="modal-ttl">{modal === 'add' ? 'Create Coupon' : 'Edit Coupon'}</div>
              <button className="modal-close" onClick={() => setModal(null)}><X size={16} /></button>
            </div>
            <div className="fgrid">
              <div className="frow" style={{ gridColumn: '1 / -1' }}>
                <label>Coupon Code * <span style={{ fontSize: 11, color: 'var(--text-light)' }}>(customers will enter this)</span></label>
                <input className="finput" value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="WELCOME10" style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: 2 }} />
              </div>
              <div className="frow">
                <label>Discount Type</label>
                <select className="fselect finput" value={form.type} onChange={e => set('type', e.target.value)}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div className="frow">
                <label>Discount Value *</label>
                <input className="finput" type="number" value={form.value} onChange={e => set('value', e.target.value)} placeholder={form.type === 'percentage' ? '10 (= 10%)' : '100 (= ₹100)'} />
              </div>
              <div className="frow">
                <label>Min. Order Amount (₹)</label>
                <input className="finput" type="number" value={form.minOrder} onChange={e => set('minOrder', e.target.value)} placeholder="500" />
              </div>
              <div className="frow">
                <label>Max. Uses</label>
                <input className="finput" type="number" value={form.maxUses} onChange={e => set('maxUses', e.target.value)} placeholder="100" />
              </div>
              <div className="frow" style={{ gridColumn: '1 / -1' }}>
                <label>Expiry Date</label>
                <input className="finput" type="date" value={form.expiryDate} onChange={e => set('expiryDate', e.target.value)} />
              </div>
              <div className="frow" style={{ gridColumn: '1 / -1' }}>
                <label>Description (internal note)</label>
                <input className="finput" value={form.description} onChange={e => set('description', e.target.value)} placeholder="e.g. New customer discount" />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} style={{ accentColor: 'var(--primary)' }} /> Active (customers can use this coupon)
            </label>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{modal === 'add' ? 'Create Coupon' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div className="modal-hdr"><div className="modal-ttl">Delete Coupon?</div></div>
            <p style={{ fontSize: 14, color: 'var(--text-medium)' }}>This coupon will be permanently deleted.</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: '#E53935', borderColor: '#E53935' }} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
