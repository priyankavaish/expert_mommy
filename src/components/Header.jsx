import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, Search, User, Heart, ChevronDown, Menu, X } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { CATEGORIES } from '../data/initialData'
import { logoImg } from '../assets/images'

export default function Header() {
  const { cartCount, state } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link'

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-left">🌿 Free shipping on orders above ₹599</div>
          <div className="top-bar-center">🧶 Made with Love, Crafted for You</div>
          <div className="top-bar-right">Hand Knitted &amp; Crochet with Care ♥</div>
        </div>
      </div>

      {/* Main Header */}
      <header className="header">
        <div className="container">
          <div className="header-inner">
            {/* Logo */}
            <Link to="/" className="logo">
              <img
                src={logoImg}
                alt="Expert Mommy"
                style={{ height: 56, width: 'auto', objectFit: 'contain' }}
              />
            </Link>

            {/* Nav */}
            <nav className="main-nav">
              <Link to="/" className={isActive('/')}>Home</Link>
              <Link to="/shop" className={isActive('/shop')}>Shop</Link>
              <div className="nav-dropdown">
                <span className="nav-link" style={{ cursor: 'pointer' }}>
                  Categories <ChevronDown size={14} />
                </span>
                <div className="dropdown-menu">
                  {CATEGORIES.map(cat => (
                    <Link key={cat.id} to={`/shop/${cat.id}`} className="dropdown-item">
                      <img src={cat.image} alt={cat.name} style={{ width: 28, height: 28, borderRadius: 4, objectFit: 'cover' }} />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link to="/shop?filter=new" className="nav-link">New Arrivals</Link>
              <Link to="/#about" className="nav-link">About Us</Link>
              <Link to="/#contact" className="nav-link">Contact</Link>
            </nav>

            {/* Actions */}
            <div className="header-actions">
              <button className="hdr-btn" title="Search" onClick={() => navigate('/shop')}>
                <Search size={19} />
              </button>
              <button className="hdr-btn" title="Wishlist" onClick={() => navigate('/shop')}>
                <Heart size={19} />
                {state.wishlist.length > 0 && (
                  <span className="cart-count">{state.wishlist.length}</span>
                )}
              </button>
              <button className="hdr-btn" title="Account" onClick={() => navigate(state.user ? '/account' : '/login')}>
                <User size={19} />
              </button>
              <button className="hdr-btn" title="Cart" onClick={() => navigate('/cart')}>
                <ShoppingBag size={19} />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </button>
              <button className="hdr-btn" style={{ display: 'none' }} onClick={() => setMobileOpen(o => !o)}>
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileOpen && (
        <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border-light)', padding: '12px 16px' }}>
          {[['/', 'Home'], ['/shop', 'Shop'], ['/shop?filter=new', 'New Arrivals'], ['/login', 'Account']].map(([to, label]) => (
            <Link key={to} to={to} className="nav-link" style={{ display: 'block', padding: '10px 0' }} onClick={() => setMobileOpen(false)}>{label}</Link>
          ))}
        </div>
      )}
    </>
  )
}
