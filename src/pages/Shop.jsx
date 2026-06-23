import { useState, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Heart, Package, ArrowRight } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { CATEGORIES } from '../data/initialData'

function ProductCard({ product }) {
  const { dispatch, toast } = useStore()
  const navigate = useNavigate()
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="pcard-image-wrap">
        <img src={product.image} alt={product.name} className="pcard-img" />
        <div className="pcard-badges">
          {product.newArrival && <span className="badge badge-new">New</span>}
          {discount > 0 && <span className="badge badge-sale">{discount}% Off</span>}
        </div>
        <div className="pcard-actions">
          <button className="pact-btn" onClick={e => { e.stopPropagation(); dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id }) }} title="Wishlist">
            <Heart size={15} />
          </button>
        </div>
        <button className="add-bar" onClick={e => {
          e.stopPropagation()
          dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id, name: product.name, price: product.price, image: product.image, qty: 1, category: product.category } })
          toast(`${product.name} added to cart!`)
        }}>
          <Package size={14} /> Add to Cart
        </button>
      </div>
      <div className="pcard-body">
        <div className="pcard-cat">{CATEGORIES.find(c => c.id === product.category)?.name || product.category}</div>
        <div className="pcard-name">{product.name}</div>
        <div className="pcard-rating">
          <span className="stars">{'★'.repeat(Math.round(product.rating))}</span>
          <span className="rcount">({product.reviews})</span>
        </div>
        <div className="pcard-price">
          <span className="price-now">₹{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && <span className="price-was">₹{product.originalPrice.toLocaleString()}</span>}
          {discount > 0 && <span className="price-off">{discount}%</span>}
        </div>
      </div>
    </div>
  )
}

export default function Shop() {
  const { state } = useStore()
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter')

  const [selectedCats, setSelectedCats] = useState(category ? [category] : [])
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sortBy, setSortBy] = useState('default')

  const toggleCat = (id) => setSelectedCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])

  const products = useMemo(() => {
    let list = [...state.products]
    if (filter === 'new') list = list.filter(p => p.newArrival)
    if (filter === 'featured') list = list.filter(p => p.featured)
    if (selectedCats.length > 0) list = list.filter(p => selectedCats.includes(p.category))
    if (priceMin) list = list.filter(p => p.price >= Number(priceMin))
    if (priceMax) list = list.filter(p => p.price <= Number(priceMax))
    switch (sortBy) {
      case 'price-asc': return list.sort((a, b) => a.price - b.price)
      case 'price-desc': return list.sort((a, b) => b.price - a.price)
      case 'rating': return list.sort((a, b) => b.rating - a.rating)
      case 'newest': return list.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0))
      default: return list
    }
  }, [state.products, selectedCats, priceMin, priceMax, sortBy, filter])

  const pageTitle = filter === 'new' ? 'New Arrivals' : filter === 'featured' ? 'Featured Products' : category ? CATEGORIES.find(c => c.id === category)?.name || 'Shop' : 'All Products'

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <div className="breadcrumb">
            <span>Home</span><span className="sep">/</span><span className="current">{pageTitle}</span>
          </div>
          <h1 className="page-banner-title">{pageTitle}</h1>
        </div>
      </div>

      <div className="container">
        <div className="shop-layout">
          {/* Sidebar */}
          <aside className="shop-sidebar">
            <div className="sidebar-header"><SlidersHorizontal size={15} /> Filters</div>

            <div className="filter-section">
              <div className="filter-title">Categories</div>
              {CATEGORIES.map(cat => (
                <label key={cat.id} className="filter-option">
                  <input type="checkbox" checked={selectedCats.includes(cat.id)} onChange={() => toggleCat(cat.id)} />
                  <label>{cat.name}</label>
                </label>
              ))}
            </div>

            <div className="filter-section">
              <div className="filter-title">Price Range (₹)</div>
              <div className="price-inputs">
                <input className="price-inp" type="number" placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)} />
                <span style={{ color: 'var(--text-light)', fontSize: 13 }}>–</span>
                <input className="price-inp" type="number" placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)} />
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-title">Availability</div>
              <label className="filter-option">
                <input type="checkbox" />
                <label>In Stock Only</label>
              </label>
              <label className="filter-option">
                <input type="checkbox" />
                <label>New Arrivals</label>
              </label>
            </div>

            <div style={{ padding: '14px 20px' }}>
              <button className="btn btn-ghost btn-sm w-full" onClick={() => { setSelectedCats([]); setPriceMin(''); setPriceMax('') }}>
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Main */}
          <div className="shop-main">
            <div className="shop-toolbar">
              <span className="results-text">Showing <strong>{products.length}</strong> products</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--text-medium)' }}>Sort by:</span>
                <select className="sort-sel" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="default">Default</option>
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🧶</div>
                <div className="empty-title">No products found</div>
                <div className="empty-desc">Try adjusting your filters</div>
                <button className="btn btn-primary" onClick={() => { setSelectedCats([]); setPriceMin(''); setPriceMax('') }}>Clear Filters</button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
