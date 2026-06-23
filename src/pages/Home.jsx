import { useNavigate } from 'react-router-dom'
import { CheckCircle, Star, Sparkles, Heart, Package, Truck, CreditCard, RotateCcw, ArrowRight, Scissors, Feather, Gift, Users } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { heroTeddy, aboutKnitting } from '../assets/images'
import { CATEGORIES, INITIAL_PRODUCTS } from '../data/initialData'

/* ── ProductCard mini ── */
function ProductCard({ product }) {
  const { dispatch, toast } = useStore()
  const navigate = useNavigate()

  const handleAddToCart = (e) => {
    e.stopPropagation()
    dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id, name: product.name, price: product.price, image: product.image, qty: 1, category: product.category } })
    toast(`${product.name} added to cart!`)
  }

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
        <button className="add-bar" onClick={handleAddToCart}>
          <Package size={14} /> Add to Cart
        </button>
      </div>
      <div className="pcard-body">
        <div className="pcard-cat">{product.category}</div>
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

export default function Home() {
  const navigate = useNavigate()
  const featured = INITIAL_PRODUCTS.filter(p => p.featured).slice(0, 4)
  const newArrivals = INITIAL_PRODUCTS.filter(p => p.newArrival).slice(0, 4)

  return (
    <main>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-leaf-bg" />
        <div className="hero-leaf-bg2" />
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-tag">
                <Sparkles size={13} /> Handmade with Love
              </div>
              <h1 className="hero-title">
                Cozy Creations,<br />
                Made for <em>Every</em><br />
                Precious Moment <Heart size={28} style={{ display: 'inline', color: 'var(--primary)', verticalAlign: 'middle' }} />
              </h1>
              <p className="hero-desc">
                Beautiful hand-knitted &amp; crochet products for babies, kids, and your lovely home. Each piece crafted stitch by stitch with premium yarn and endless love.
              </p>
              <div className="hero-btns">
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/shop')}>
                  Shop Now <ArrowRight size={16} />
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => navigate('/shop?filter=new')}>
                  New Arrivals
                </button>
              </div>
              <div className="hero-trust">
                <div className="trust-item"><CheckCircle size={15} /> 100% Handmade</div>
                <div className="trust-item"><Star size={15} /> Premium Quality</div>
                <div className="trust-item"><Heart size={15} /> Made with Love</div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-img-circle">
                <img src={heroTeddy} alt="Handmade teddy bear" className="hero-img" />
              </div>
              <div className="hero-handmade-badge">
                <Heart size={18} />
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 400 }}>Crafted by</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--primary)' }}>Pushpa Rani</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Bar ── */}
      <section className="feature-bar">
        <div className="container">
          <div className="feature-bar-row">
            <div className="feature-bar-item"><CheckCircle size={16} /> 100% Handmade</div>
            <div className="feature-bar-item"><Star size={16} /> Premium Quality</div>
            <div className="feature-bar-item"><Heart size={16} /> Made with Love</div>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="feature-cards-section">
        <div className="container">
          <div className="features-grid">
            {[
              { Icon: Scissors, title: 'Hand Knitted & Crochet', desc: 'Carefully handmade stitch by stitch using premium quality yarns.' },
              { Icon: Feather, title: 'Soft & Skin Friendly', desc: 'Gentle on skin, perfect for your little ones and the whole family.' },
              { Icon: Gift, title: 'Perfect Gift Ideas', desc: 'Thoughtful & unique gifts for every occasion and celebration.' },
              { Icon: Users, title: 'Made by Expert Hands', desc: 'Crafted with passion by Pushpa Rani and her skilled artisans.' }
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="feat-card">
                <div className="feat-icon"><Icon size={22} /></div>
                <div className="feat-title">{title}</div>
                <p className="feat-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop By Category ── */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Explore</span>
            <h2 className="section-title">Shop By Category</h2>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="cat-card" onClick={() => navigate(`/shop/${cat.id}`)}>
                <img src={cat.image} alt={cat.name} className="cat-img" />
                <div className="cat-body">
                  <div className="cat-name">{cat.name}</div>
                  <div className="cat-link">Shop Now <ArrowRight size={10} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="arrivals-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Bestsellers</span>
            <h2 className="section-title">Featured Products</h2>
          </div>
          <div className="arrivals-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/shop')}>
              View All Products <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-img-wrap">
              <img src={aboutKnitting} alt="Knitting with love" className="about-main-img" />
              <div className="about-circle-badge">
                Made<br />with<br />Love
              </div>
            </div>
            <div className="about-content">
              <span className="section-tag">About Us</span>
              <h2 className="about-title">
                Crafted with Passion by <br />
                <em style={{ color: 'var(--primary)' }}>Pushpa Rani</em> <Heart size={22} style={{ color: 'var(--primary)', display: 'inline', verticalAlign: 'middle' }} />
              </h2>
              <p className="about-desc">
                Expert Mommy is a labour of love and creativity. Every product is handcrafted with premium yarns, combining modern aesthetics with timeless artisanal techniques. We believe every stitch carries warmth, and every creation is a little piece of the maker's heart.
              </p>
              <div className="about-feats">
                {[
                  'Made with love & patience',
                  'High quality premium yarn',
                  'Unique & long lasting',
                  'Supporting handmade'
                ].map(f => (
                  <div key={f} className="about-feat">
                    <div className="about-feat-icon"><CheckCircle size={13} /></div>
                    {f}
                  </div>
                ))}
              </div>
              <div className="signature">Pushpa Rani</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="arrivals-section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Just In</span>
            <h2 className="section-title">New Arrivals</h2>
          </div>
          <div className="arrivals-grid">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            {[
              { Icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹599' },
              { Icon: CreditCard, title: 'Secure Payments', desc: '100% safe & trusted' },
              { Icon: RotateCcw, title: 'Easy Returns', desc: 'Hassle-free process' },
              { Icon: Heart, title: 'Happy Customers', desc: 'Thank you for your love' }
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="trust-card">
                <div className="trust-icon"><Icon size={24} /></div>
                <div className="trust-title">{title}</div>
                <div className="trust-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="newsletter-section" id="contact">
        <div className="container">
          <h2 className="newsletter-title">Stay in the Loop 🧶</h2>
          <p className="newsletter-desc">Subscribe for new arrivals, exclusive offers &amp; handmade inspiration.</p>
          <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
            <input className="newsletter-input" type="email" placeholder="Enter your email address..." />
            <button className="newsletter-btn" type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </main>
  )
}
