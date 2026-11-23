import { useState } from 'react'
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { CATEGORIES } from '../../data/initialData'
import { AGE_LABELS } from '../../data/ages'

const EMPTY = { name: '', category: CATEGORIES[0].id, ageGroup: '', tags: '', images: [], rating: '', reviews: '', price: '', originalPrice: '', stock: '', sku: '', description: '', featured: false, newArrival: false }

export default function AdminProducts() {
  const { state, dispatch, saveProduct, toast } = useStore()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const filtered = state.products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setForm(EMPTY)
    setImageUrl('')
    setModal('add')
  }

  const openEdit = p => {
    const images = [...new Set([p.image, ...(p.images || [])].filter(Boolean))]
    setForm({
      ...EMPTY, ...p, images,
      originalPrice: p.originalPrice ?? '',
      tags: (p.tags || []).join(', '),
    })
    setImageUrl('')
    setModal('edit')
  }

  const addImageUrl = () => {
    const url = imageUrl.trim()
    if (!/^https:\/\/[^\s]+$/i.test(url)) {
      toast('Enter an image URL starting with https://', 'error')
      return
    }
    set('images', [...form.images, url])
    setImageUrl('')
  }

  const uploadImages = async event => {
    const files = Array.from(event.target.files)
    event.target.value = ''
    if (!files.length) return
    setUploading(true)
    try {
      const images = await Promise.all(files.map(async file => {
        const bitmap = await createImageBitmap(file)
        try {
          const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height))
          const canvas = document.createElement('canvas')
          canvas.width = Math.max(1, Math.round(bitmap.width * scale))
          canvas.height = Math.max(1, Math.round(bitmap.height * scale))
          canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
          return canvas.toDataURL('image/webp', 0.82)
        } finally {
          bitmap.close()
        }
      }))
      setForm(current => ({ ...current, images: [...current.images, ...images] }))
    } catch {
      toast('Could not open the selected images. Try JPG, PNG, or WebP.', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    const { name, price, originalPrice, stock, tags, images } = form
    const rating = form.rating ?? ''
    const reviews = form.reviews ?? ''
    if (rating !== '' && (!Number.isFinite(Number(rating)) || Number(rating) < 0 || Number(rating) > 5)) {
      toast('Rating must be between 0 and 5.', 'error')
      return
    }
    if (reviews !== '' && (!Number.isInteger(Number(reviews)) || Number(reviews) < 0)) {
      toast('Review count must be a non-negative whole number.', 'error')
      return
    }
    if (!name.trim() || price === '' || !Number.isFinite(Number(price)) || Number(price) < 0 ||
        !Number.isFinite(Number(originalPrice)) || Number(originalPrice) < 0 ||
        stock === '' || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
      toast('Enter a product name, valid prices, and a whole number for stock.', 'error')
      return
    }
    if (imageUrl.trim()) {
      toast('Click Add URL to include the image before saving.', 'error')
      return
    }
    if (!images.length) {
      toast('Add at least one product image.', 'error')
      return
    }

    const product = {
      ...form,
      id: form.id || 'p' + Date.now(),
      name: name.trim(),
      price: Number(price),
      originalPrice: originalPrice === '' ? Number(price) : Number(originalPrice),
      stock: Number(stock),
      rating: rating === '' ? undefined : Number(rating),
      reviews: reviews === '' ? undefined : Number(reviews),
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      image: images[0],
    }
    if (!await saveProduct(product, modal === 'add')) return
    toast(modal === 'add' ? 'Product added successfully!' : 'Product updated!')
    setModal(null)
  }

  const toggleSoldOut = async product => {
    const soldOut = product.stock <= 0
    const { stockBeforeSoldOut, ...details } = product
    const updated = soldOut
      ? { ...details, stock: stockBeforeSoldOut > 0 ? stockBeforeSoldOut : 1 }
      : { ...details, stock: 0, stockBeforeSoldOut: product.stock }

    if (!await saveProduct(updated, false)) return
    toast(soldOut ? 'Product is back in stock.' : 'Product marked sold out.')
  }

  const handleDelete = async () => {
    if (!await dispatch({ type: 'DELETE_PRODUCT', payload: deleteId })) return
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
                        <div style={{ fontSize: 11.5, color: 'var(--text-light)' }}>&#9733; {p.rating ?? '–'} ({p.reviews ?? 0} reviews)</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{p.sku}</td>
                  <td>{catName}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>&#8377;{p.price.toLocaleString()}</div>
                    {p.originalPrice > p.price && <div style={{ fontSize: 11.5, color: 'var(--text-light)', textDecoration: 'line-through' }}>&#8377;{p.originalPrice.toLocaleString()}</div>}
                  </td>
                  <td>
                    <span className={`badge ${p.stock === 0 ? 'badge-red' : p.stock <= 5 ? 'badge-orange' : 'badge-green'}`}>
                      {p.stock <= 0 ? 'Sold Out' : `${p.stock} in stock`}
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
                      <button className="btn btn-outline btn-sm" onClick={() => toggleSoldOut(p)} aria-label={(p.stock > 0 ? 'Mark sold out: ' : 'Restock: ') + p.name}>
                        {p.stock > 0 ? 'Mark sold out' : 'Restock'}
                      </button>
                      <button className="tbl-act edit" onClick={() => openEdit(p)} title="Edit product" aria-label={"Edit " + p.name}><Edit2 size={13} /></button>
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
        <div className="modal-overlay" onClick={() => !uploading && setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-hdr">
              <div className="modal-ttl">{modal === 'add' ? 'Add New Product' : 'Edit Product'}</div>
              <button className="modal-close" onClick={() => !uploading && setModal(null)}><X size={16} /></button>
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
                <label>Sale Price (&#8377;) *</label>
                <input className="finput" type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} placeholder="699" />
              </div>
              <div className="frow">
                <label>Original Price (&#8377;)</label>
                <input className="finput" type="number" min="0" step="0.01" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} placeholder="899" />
              </div>
              <div className="frow">
                <label>Stock Qty *</label>
                <input className="finput" type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="10" />
              </div>
            </div>
            <div className="fgrid">
              <label className="frow">Age Group
                <select className="fselect finput" value={form.ageGroup} onChange={e => set('ageGroup', e.target.value)}>
                  <option value="">Unspecified</option>
                  {Object.entries(AGE_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                </select>
              </label>
              <label className="frow">Tags
                <input className="finput" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="winter, sweater" />
              </label>
              <label className="frow">Rating
                <input className="finput" type="number" min="0" max="5" step="0.1" value={form.rating ?? ''} onChange={e => set('rating', e.target.value)} />
              </label>
              <label className="frow">Review Count
                <input className="finput" type="number" min="0" value={form.reviews ?? ''} onChange={e => set('reviews', e.target.value)} />
              </label>
            </div>
            <div className="frow">
              <label htmlFor="product-photos">Product Photos *</label>
              <input id="product-photos" className="finput" type="file" accept="image/*" multiple disabled={uploading} onChange={uploadImages} />
              {uploading && <span role="status">Preparing photos...</span>}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input className="finput" aria-label="Image URL" placeholder="https://example.com/photo.jpg" value={imageUrl} onChange={e => setImageUrl(e.target.value)} disabled={uploading} />
                <button className="btn btn-ghost btn-sm" disabled={uploading || !imageUrl.trim()} onClick={addImageUrl}>Add URL</button>
              </div>
              {form.images.map((image, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  <img className="tbl-prod-img" src={image} alt={'Product photo ' + (index + 1)} />
                  {index === 0 ? <span>Main photo</span> : (
                    <button className="btn btn-ghost btn-sm" disabled={uploading} onClick={() => set('images', [image, ...form.images.filter((_, i) => i !== index)])}>Make main</button>
                  )}
                  <button className="btn btn-ghost btn-sm" disabled={uploading} aria-label={'Remove photo ' + (index + 1)} onClick={() => set('images', form.images.filter((_, i) => i !== index))}>Remove</button>
                </div>
              ))}
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
              <button className="btn btn-ghost" onClick={() => !uploading && setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={uploading}>{modal === 'add' ? 'Add Product' : 'Save Changes'}</button>
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
