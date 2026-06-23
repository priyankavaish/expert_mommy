import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, ShoppingBag, Package, Minus, Plus, Share2, ArrowLeft, CheckCircle } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { CATEGORIES } from '../data/initialData'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch, toast } = useStore()

  const product = state.products.find(p => p.id === id)
  const [qty, setQty] = useState(1)

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🧶</div>
        <h2 style={{ marginBottom: 12 }}>Product not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/shop')}>Back to Shop</button>
      </div>
    )
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  const inWishlist = state.wishlist.includes(product.id)
  const catName = CATEGORIES.find(c => c.id === product.category)?.name || product.category

  const addToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id, name: product.name, price: product.price, image: product.image, qty, category: product.category } })
    toast(`${product.name} added to cart!`)
  }

  const buyNow = () => {
    dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id, name: product.name, price: product.price, image: product.image, qty, category: product.category } })
    navigate('/checkout')
  }

  const related = state.products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb" style={{ marginBottom: 24, justifyContent: 'flex-start' }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <span className="sep">/</span>
          <span className="current">{catName}</span>
          <span className="sep">/</span>
          <span className="current">{product.name}</span>
        </div>

        <div className="pdetail-grid">
          {/* Gallery */}
          <div>
            <img src={product.image} alt={product.name} className="gallery-main-img" />
            <div className="gallery-thumbs">
              {[product.image, product.image, product.image].map((img, i) => (
                <img key={i} src={img} alt="" className={`gallery-thumb ${i === 0 ? 'active' : ''}`} />
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="pdetail-cat">{catName}</div>
            <h1 className="pdetail-name">{product.name}</h1>

            <div className="pdetail-rating">
              <span style={{ color: '#F5A623', fontSize: 16, letterSpacing: 2 }}>{'★'.repeat(Math.round(product.rating))}</span>
              <span style={{ fontSize: 14, color: 'var(--text-medium)' }}>{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="pdetail-price-row">
              <span className="pdetail-price-now">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span style={{ fontSize: 16, color: 'var(--text-light)', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString()}</span>
                  <span className="badge badge-sale">{discount}% Off</span>
                </>
              )}
            </div>

            <p className="pdetail-desc">{product.description}</p>

            {/* Qty */}
            <div style={{ marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-dark)' }}>Quantity</div>
            <div className="qty-wrap" style={{ marginBottom: 22 }}>
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={16} /></button>
              <input className="qty-num" type="number" value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value)))} readOnly />
              <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}><Plus size={16} /></button>
              <span style={{ marginLeft: 12, fontSize: 12.5, color: 'var(--text-medium)' }}>
                {product.stock > 0 ? <span style={{ color: '#2E7D32', fontWeight: 600 }}>✓ {product.stock} in stock</span> : <span style={{ color: '#C62828' }}>Out of stock</span>}
              </span>
            </div>

            <div className="atc-row">
              <button className="atc-btn" onClick={addToCart} disabled={product.stock === 0}>
                <Package size={18} /> Add to Cart
              </button>
              <button className="wl-btn" onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id })} title="Wishlist">
                <Heart size={18} fill={inWishlist ? 'var(--primary)' : 'none'} color={inWishlist ? 'var(--primary)' : undefined} />
              </button>
            </div>

            <button className="btn btn-primary w-full" style={{ marginBottom: 22 }} onClick={buyNow}>
              <ShoppingBag size={16} /> Buy Now
            </button>

            {/* Trust mini */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 22, padding: '14px 0', borderTop: '1px solid var(--border-light)' }}>
              {['Free Shipping on ₹599+', 'Easy 7-day Returns', 'Secure Checkout'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: 'var(--text-medium)' }}>
                  <CheckCircle size={13} color="var(--primary)" /> {t}
                </div>
              ))}
            </div>

            {/* Meta */}
            <div className="pdetail-meta">
              <div className="meta-row"><span className="meta-lbl">SKU:</span><span className="meta-val">{product.sku}</span></div>
              <div className="meta-row"><span className="meta-lbl">Category:</span><span className="meta-val">{catName}</span></div>
              <div className="meta-row"><span className="meta-lbl">Tags:</span><span className="meta-val">{product.tags?.join(', ')}</span></div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <div className="section-header" style={{ textAlign: 'left', marginBottom: 24 }}>
              <span className="section-tag">You May Also Like</span>
              <h2 className="section-title">Related Products</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
              {related.map(p => (
                <div key={p.id} className="product-card" onClick={() => navigate(`/product/${p.id}`)}>
                  <div className="pcard-image-wrap">
                    <img src={p.image} alt={p.name} className="pcard-img" />
                  </div>
                  <div className="pcard-body">
                    <div className="pcard-name" style={{ fontSize: 14 }}>{p.name}</div>
                    <div className="pcard-price">
                      <span className="price-now">₹{p.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
