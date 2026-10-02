import { Link } from 'react-router-dom'
import { Instagram, Facebook, Youtube, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react'
import { logoImg } from '../assets/images'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/">
              <img
                src={logoImg}
                alt="Expert Mommy"
                style={{ height: 60, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.85, marginBottom: 12 }}
              />
            </Link>
            <p className="footer-desc">
              Beautiful handcrafted knitwear and crochet products made with love and care for babies, kids, and your lovely home. Every piece tells a story.
            </p>
            <div className="footer-social">
              <a href="#" className="soc-btn" title="Instagram"><Instagram size={15} /></a>
              <a href="#" className="soc-btn" title="Facebook"><Facebook size={15} /></a>
              <a href="#" className="soc-btn" title="YouTube"><Youtube size={15} /></a>
              <a href="#" className="soc-btn" title="Twitter"><Twitter size={15} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="footer-col-title">Quick Links</div>
            <div className="footer-links">
              {[['/', 'Home'], ['/shop', 'Shop All'], ['/shop?filter=new', 'New Arrivals'], ['/shop?filter=featured', 'Featured'], ['/#about', 'About Us'], ['/#contact', 'Contact']].map(([to, label]) => (
                <Link key={to} to={to} className="footer-link">› {label}</Link>
              ))}
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <div className="footer-col-title">Customer Care</div>
            <div className="footer-links">
              {[['#', 'Shipping Policy'], ['#', 'Return &amp; Refunds'], ['#', 'Terms &amp; Conditions'], ['#', 'Privacy Policy'], ['#', 'FAQs'], ['#', 'Track Order']].map(([to, label]) => (
                <a key={label} href={to} className="footer-link" dangerouslySetInnerHTML={{ __html: '› ' + label }} />
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="footer-col-title">Get in Touch</div>
            <div className="footer-links">
              <a href="mailto:hello@expertmommy.in" className="footer-link">
                <Mail size={13} /> hello@expertmommy.in
              </a>
              <a href="tel:+919876543210" className="footer-link">
                <Phone size={13} /> +91 98765 43210
              </a>
              <span className="footer-link">
                <MapPin size={13} /> Mumbai, India
              </span>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <div className="footer-col-title">Newsletter</div>
            <p style={{ fontSize: 13, color: '#7A7270', lineHeight: 1.65, marginBottom: 14 }}>
              Subscribe for updates on new products &amp; exclusive offers.
            </p>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{ padding: '9px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.07)', color: '#CCC', fontSize: 13, outline: 'none' }}
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--radius-sm)' }}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2025 Expert Mommy, All Rights Reserved.</p>
          <p><a href="https://lexabiz.in/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>Crafted by Lexbiz.in</a></p>
        </div>
      </div>
    </footer>
  )
}
