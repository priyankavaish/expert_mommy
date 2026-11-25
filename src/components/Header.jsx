import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, MessageCircle } from 'lucide-react'
import { imageSlots } from '../data/siteImages'
import { useStore } from '../context/StoreContext'
import { customUrl } from '../data/whatsapp'
import { Rich, useContent } from './Content'
export default function Header() {
  const { state } = useStore()
  const t = useContent('header')
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  useEffect(() => { setOpen(false); if (hash) { requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })) } else { window.scrollTo(0, 0) } }, [pathname, hash])
  return <>
    <div className="atelier-announcement"><Rich text={t('announcement')}/> <span><Rich text={t('announcementNote')}/></span></div>
    <header className="atelier-header"><div className="container atelier-header-inner">
      <Link to="/" aria-label="Expert Mommy home"><img className="atelier-logo" src={state.siteImages?.logo || imageSlots.logo.src} alt="Expert Mommy" /></Link>
      <nav aria-label="Main navigation" className={'atelier-nav ' + (open ? 'is-open' : '')}>
        <NavLink to="/" end>Home</NavLink><NavLink to="/shop">Our Products</NavLink><Link to="/#about">Our story</Link><Link to="/#custom">Custom orders</Link>
      </nav>
      <a className="header-chat" href={customUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={16}/><span><Rich text={t('chatButton')}/></span></a>
      <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open}>{open ? <X/> : <Menu/>}</button>
    </div></header>
  </>
}
