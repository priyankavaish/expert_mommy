import { Link } from 'react-router-dom'
import { MessageCircle, Instagram, Youtube } from 'lucide-react'
import { CONTACT_PHONE, customUrl } from '../data/whatsapp'
import { SOCIAL_LINKS } from '../data/social'
import { Rich, useContent } from './Content'
export default function Footer() {
  const t = useContent('footer')
  const email = t('email').trim()
  return <footer className="atelier-footer"><div className="container">
    <div className="atelier-footer-grid"><div><Link to="/" className="footer-wordmark">Expert Mommy<span><Rich text={t('tagline')}/></span></Link><p><Rich text={t('about')}/></p><div className="maker-footer-social">{SOCIAL_LINKS.map(social => { const Icon = social.id === 'instagram' ? Instagram : Youtube; return <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={'Expert Mommy on ' + social.name}><Icon size={16}/><span>{social.name}</span></a> })}</div></div>
      <div><h3><Rich text={t('linksTitle')}/></h3><Link to="/shop">All Products</Link><Link to="/shop/hand-knitted">Hand knitted</Link><Link to="/shop/crochet">Crochet</Link><Link to="/#about">Our story</Link></div>
      <div><h3><Rich text={t('customTitle')}/></h3><p><Rich text={t('customText')}/></p><a href={customUrl} target="_blank" rel="noopener noreferrer"><Rich text={t('customLink')}/></a></div>
      <div id="contact"><h3><Rich text={t('contactTitle')}/></h3><a href={customUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={15}/> {CONTACT_PHONE}</a>{email && <a href={'mailto:' + email}>{email}</a>}<p><Rich text={t('contactNote')}/></p></div>
    </div><div className="atelier-footer-bottom"><span>&copy; {new Date().getFullYear()} Expert Mommy</span><nav className="footer-policies" aria-label="Policies"><Link to="/terms-and-conditions">Terms &amp; Conditions</Link><Link to="/privacy-policy">Privacy Policy</Link><Link to="/return-policy">No Return Policy</Link><a href="/sitemap.xml">Sitemap</a></nav><a href="https://lexabiz.in/" target="_blank" rel="noopener noreferrer">Crafted by Lexabiz.in</a></div>
  </div></footer>
}
