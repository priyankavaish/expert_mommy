import { useState } from 'react'
import { Search, Edit2, X, AlertTriangle, TrendingDown } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { CATEGORIES } from '../../data/initialData'

export default function AdminInventory() {
  const { state, dispatch, toast } = useStore()
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [editItem, setEditItem] = useState(null)
  const [newStock, setNewStock] = useState('')

  const filtered = state.products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'all' || p.category === filterCat
    return matchSearch && matchCat
  })

  const sorted = [...filtered].sort((a, b) => a.stock - b.stock)
  const lowStock = state.products.filter(p => p.stock > 0 && p.stock <= 5).length
  const outOfStock = state.products.filter(p => p.stock === 0).length
  const totalItems = state.products.reduce((s, p) => s + p.stock, 0)

  const openEdit = (p) => { setEditItem(p); setNewStock(String(p.stock)) }

  const handleUpdate = () => {
    if (isNaN(Number(newStock)) || Number(newStock) < 0) { toast('Invalid stock value', 'error'); return }
    dispatch({ type: 'UPDATE_PRODUCT', payload: { ...editItem, stock: Number(newStock) } })
    toast(`Stock updated for "${editItem.name}"`)
    setEditItem(null)
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { cls: 'badge-red', label: 'Out of Stock' }
    if (stock <= 5) return { cls: 'badge-orange', label: 'Low Stock' }
    return { cls: 'badge-green', label: 'In Stock' }
  }

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Inventory Management</h1>
        <p style={{ fontSize: 13, color: 'var(--text-medium)' }}>Monitor and update product stock levels</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 22 }}>
        {[
          { label: 'Total Products', value: state.products.length, cls: 'ico-blue' },
          { label: 'Total Stock', value: totalItems, cls: 'ico-green' },
          { label: 'Low Stock', value: lowStock, cls: 'ico-orange', warn: lowStock > 0 },
          { label: 'Out of Stock', value: outOfStock, cls: 'ico-pink', warn: outOfStock > 0 }
        ].map(({ label, value, warn }) => (
          <div key={label} className="adm-card" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: warn ? '#E65100' : 'var(--text-dark)' }}>{value}</div>
              </div>
              {warn && <AlertTriangle size={18} color="#E65100" />}
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(lowStock > 0 || outOfStock > 0) && (
        <div style={{ background: '#FFF3E0', border: '1px solid #FFB74D', borderRadius: 'var(--radius)', padding: 14, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}>
          <AlertTriangle size={16} color="#E65100" />
          <span style={{ color: '#E65100', fontWeight: 600 }}>
            {outOfStock > 0 ? `${outOfStock} product(s) out of stock. ` : ''}
            {lowStock > 0 ? `${lowStock} product(s) running low on stock.` : ''}
          </span>
          <span style={{ color: '#BF360C' }}>Please restock soon.</span>
        </div>
      )}

      <div className="adm-toolbar">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="adm-search-wrap">
            <Search size={14} className="adm-search-icon" />
            <input className="adm-search" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            style={{ padding: '9px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 13.5, outline: 'none', background: 'var(--white)', cursor: 'pointer' }}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'low', 'out'].map(f => (
            <button key={f} className="btn btn-ghost btn-sm" onClick={() => {}}>
              {f === 'all' ? 'All' : f === 'low' ? '⚠️ Low' : '❌ Out'
            }</button>
          ))}
        </div>
      </div>

      <div className="adm-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Stock Level</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(p => {
              const { cls, label } = getStockStatus(p.stock)
              const catName = CATEGORIES.find(c => c.id === p.category)?.name || p.category
              const maxStock = 30
              const pct = Math.min(100, (p.stock / maxStock) * 100)
              const barColor = p.stock === 0 ? '#E53935' : p.stock <= 5 ? '#FF9800' : '#4CAF50'
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={p.image} alt={p.name} className="tbl-prod-img" />
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.name}</div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{p.sku}</td>
                  <td style={{ fontSize: 13 }}>{catName}</td>
                  <td style={{ fontWeight: 700, fontSize: 16, color: p.stock === 0 ? '#E53935' : p.stock <= 5 ? '#E65100' : 'var(--text-dark)' }}>
                    {p.stock}
                  </td>
                  <td>
                    <div style={{ width: 100 }}>
                      <div style={{ height: 7, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: barColor, transition: 'width 0.3s' }} />
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--text-light)', marginTop: 3 }}>{p.stock}/{maxStock}</div>
                    </div>
                  </td>
                  <td><span className={`badge ${cls}`}>{label}</span></td>
                  <td>
                    <button className="tbl-act edit" onClick={() => openEdit(p)} title="Update Stock"><Edit2 size={13} /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Update Stock Modal */}
      {editItem && (
        <div className="modal-overlay" onClick={() => setEditItem(null)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-hdr">
              <div className="modal-ttl">Update Stock</div>
              <button className="modal-close" onClick={() => setEditItem(null)}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <img src={editItem.image} alt={editItem.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, background: 'var(--cream)' }} />
              <div>
                <div style={{ fontWeight: 700 }}>{editItem.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-medium)' }}>SKU: {editItem.sku}</div>
                <div style={{ fontSize: 12, color: 'var(--text-medium)' }}>Current: <strong>{editItem.stock}</strong> units</div>
              </div>
            </div>
            <div className="frow">
              <label>New Stock Quantity</label>
              <input className="finput" type="number" min="0" value={newStock} onChange={e => setNewStock(e.target.value)} placeholder="Enter new quantity" autoFocus />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setEditItem(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUpdate}>Update Stock</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
