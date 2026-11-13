import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Instagram, Youtube } from 'lucide-react'
import { customUrl } from '../data/whatsapp'
import { SOCIAL_LINKS } from '../data/social'
export default function Footer() {
  return <footer className="atelier-footer"><div className="container">
    <div className="atelier-footer-grid"><div><Link to="/" className="footer-wordmark">Expert Mommy<span>little stitches. lasting love.</span></Link><p>Hand-knitted and crochet sweaters, made by Pushpa Rani with 44 years of knitting experience. One special piece at a time.</p><div className="maker-footer-social">{SOCIAL_LINKS.map(social => { const Icon = social.id === 'instagram' ? Instagram : Youtube; return <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={'Expert Mommy on ' + social.name}><Icon size={16}/><span>{social.name}</span></a> })}</div></div>
      <div><h3>Take a little look</h3><Link to="/shop">All sweaters</Link><Link to="/shop/hand-knitted">Hand knitted</Link><Link to="/shop/crochet">Crochet</Link><Link to="/#about">Our story</Link></div>
      <div><h3>Made just for you</h3><p>Have a colour or design in mind? We welcome custom orders.</p><a href={customUrl} target="_blank" rel="noopener noreferrer">Discuss a custom order</a></div>
      <div id="contact"><h3>Say hello</h3><a href={customUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={15}/> +91 97941 59418</a><a href="mailto:expertmommy6199@gmail.com">expertmommy6199@gmail.com</a><p>Availability, sizing, payment and delivery are confirmed on WhatsApp.</p></div>
    </div><div className="atelier-footer-bottom"><span>&copy; {new Date().getFullYear()} Expert Mommy</span><span>Handmade with <Heart size={12}/> in India</span><a href="https://lexabiz.in/" target="_blank" rel="noopener noreferrer">Crafted by Lexbiz.in</a></div>
  </div></footer>
}
