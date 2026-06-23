import { useState } from 'react'
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { CATEGORIES } from '../../data/initialData'

const EMPTY = { name: '', category: 'baby', price: '', originalPrice: '', stock: '', sku: '', description: '', featured: false, newArrival: false }

export default function AdminProducts() {
  const { state, dispatch, toast } = useStore()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [deleteId, setDeleteId] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const filtered = state.products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => { setForm(EMPTY); setModal('add') }
  const openEdit = (p) => { setForm({ ...p, price: String(p.price), originalPrice: String(p.originalPrice), stock: String(p.stock) }); setModal('edit') }

  const handleSave = () => {
    if (!form.name || !form.price || !form.stock) { toast('Fill required fields', 'error'); return }
    const product = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice) || Number(form.price),
      stock: Number(form.stock),
      rating: form.rating || 4.5,
      reviews: form.reviews || 0,
      tags: form.tags || [form.category],
      image: state.products.find(p => p.category === form.category)?.image || state.products[0]?.image
    }
    if (modal === 'add') {
      dispatch({ type: 'ADD_PRODUCT', payload: { ...product, id: 'p' + Date.now() } })
      toast('Product added successfully!')
    } else {
      dispatch({ type: 'UPDATE_PRODUCT', payload: product })
      toast('Product updated!')
    }
    setModal(null)
  }

  const handleDelete = () => {
    dispatch({ type: 'DELETE_PRODUCT', payload: deleteId })
    toast('Product deleted', 'error')
    setDeleteId(null)
  }

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Products</h1>
        <p style={{ fontSize: 13, color: 'var(--text-medium)' }}>Manage your product catalogue</p>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={14} className="adm-search-icon" />
          <input className="adm-search" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="adm-toolbar-right">
          <span style={{ fontSize: 13, color: 'var(--text-medium)' }}>{filtered.length} products</span>
          <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={14} /> Add Product</button>
        </div>
      </div>

      <div className="adm-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const catName = CATEGORIES.find(c => c.id === p.category)?.name || p.category
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={p.image} alt={p.name} className="tbl-prod-img" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-light)' }}>★ {p.rating} ({p.reviews} reviews)</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{p.sku}</td>
                  <td>{catName}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{p.price.toLocaleString()}</div>
                    {p.originalPrice > p.price && <div style={{ fontSize: 11.5, color: 'var(--text-light)', textDecoration: 'line-through' }}>₹{p.originalPrice.toLocaleString()}</div>}
                  </td>
                  <td>
                    <span className={`badge ${p.stock === 0 ? 'badge-red' : p.stock <= 5 ? 'badge-orange' : 'badge-green'}`}>
                      {p.stock === 0 ? 'Out of Stock' : `${p.stock} in stock`}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {p.featured && <span className="badge badge-purple">Featured</span>}
                      {p.newArrival && <span className="badge badge-new">New</span>}
                    </div>
                  </td>
                  <td>
                    <div className="tbl-actions">
                      <button className="tbl-act edit" onClick={() => openEdit(p)} title="Edit"><Edit2 size={13} /></button>
                      <button className="tbl-act del" onClick={() => setDeleteId(p.id)} title="Delete"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state"><div className="empty-icon">📦</div><div className="empty-title">No products found</div></div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-hdr">
              <div className="modal-ttl">{modal === 'add' ? 'Add New Product' : 'Edit Product'}</div>
              <button className="modal-close" onClick={() => setModal(null)}><X size={16} /></button>
            </div>
            <div className="fgrid">
              <div className="frow">
                <label>Product Name *</label>
                <input className="finput" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Knitted Baby Booties" />
              </div>
              <div className="frow">
                <label>SKU</label>
                <input className="finput" value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="BB-001" />
              </div>
              <div className="frow">
                <label>Category *</label>
                <select className="fselect finput" value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="frow">
                <label>Sale Price (₹) *</label>
                <input className="finput" type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="699" />
              </div>
              <div className="frow">
                <label>Original Price (₹)</label>
                <input className="finput" type="number" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} placeholder="899" />
              </div>
              <div className="frow">
                <label>Stock Qty *</label>
                <input className="finput" type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="10" />
              </div>
            </div>
            <div className="frow">
              <label>Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Product description..." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 14, outline: 'none', resize: 'vertical', minHeight: 80, fontFamily: 'var(--font-body)' }} />
            </div>
            <div style={{ display: 'flex', gap: 20, marginBottom: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ accentColor: 'var(--primary)' }} /> Mark as Featured
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.newArrival} onChange={e => set('newArrival', e.target.checked)} style={{ accentColor: 'var(--primary)' }} /> New Arrival
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{modal === 'add' ? 'Add Product' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-hdr"><div className="modal-ttl">Delete Product?</div></div>
            <p style={{ fontSize: 14, color: 'var(--text-medium)' }}>This action cannot be undone. The product will be permanently removed.</p>
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
