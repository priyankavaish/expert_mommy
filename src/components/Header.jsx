import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, MessageCircle } from 'lucide-react'
import { logoImg } from '../assets/images'
import { customUrl } from '../data/whatsapp'
export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  useEffect(() => { setOpen(false); if (hash) { requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })) } else { window.scrollTo(0, 0) } }, [pathname, hash])
  return <>
    <div className="atelier-announcement">A little warmth, a lot of love. <span>100% handmade &middot; Custom orders welcome</span></div>
    <header className="atelier-header"><div className="container atelier-header-inner">
      <Link to="/" aria-label="Expert Mommy home"><img className="atelier-logo" src={logoImg} alt="Expert Mommy" /></Link>
      <nav aria-label="Main navigation" className={'atelier-nav ' + (open ? 'is-open' : '')}>
        <NavLink to="/" end>Home</NavLink><NavLink to="/shop">Our sweaters</NavLink><Link to="/#about">Our story</Link><Link to="/#custom">Custom orders</Link>
      </nav>
      <a className="header-chat" href={customUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={16}/><span>Let's chat</span></a>
      <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open}>{open ? <X/> : <Menu/>}</button>
    </div></header>
  </>
}
