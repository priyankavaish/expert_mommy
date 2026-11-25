import InstagramSection from '../components/InstagramSection'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Scissors, MessageCircle, Sparkles } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
import MakerStory from '../components/MakerStory'
import HandmadeGallery from '../components/HandmadeGallery'
import { Rich, useContent } from '../components/Content'
import { customUrl } from '../data/whatsapp'
import { imageSlots } from '../data/siteImages'
import useReveal from '../hooks/useReveal'
export default function Home() {
 const { state } = useStore()
 const hero = useContent('homeHero'), values = useContent('homeValues'), feat = useContent('homeFeatured'), custom = useContent('custom'), how = useContent('how')
 const featured = state.products.filter(p => p.featured).slice(0, 4)
 useReveal([state.products])
 return <main className="atelier">
   <section className="atelier-hero"><div className="container atelier-hero-grid">
     <div className="atelier-hero-copy"><span className="eyebrow"><span/> <Rich text={hero('eyebrow')}/></span><h1><Rich text={hero('title')}/></h1><p><Rich text={hero('text')}/></p><div className="atelier-buttons"><Link className="btn btn-primary" to="/shop"><Rich text={hero('primaryButton')}/> <ArrowRight size={17}/></Link><a className="text-link" href="#custom"><Rich text={hero('secondaryLink')}/></a></div><div className="hero-note"><Heart size={16}/><span><Rich text={hero('note')}/></span></div></div>
     <div className="atelier-hero-art"><div className="hero-ring"/><span className="handwritten hero-handwriting"><Rich text={hero('handwriting')}/></span><img src={state.siteImages?.homeHero || imageSlots.homeHero.src} alt={state.siteImages?.homeHero ? "Expert Mommy handmade collection" : imageSlots.homeHero.alt} fetchPriority="high"/><span className="hero-seal"><Heart size={22}/><Rich text={hero('seal')}/></span><span className="hero-art-caption"><Rich text={hero('caption')}/> <span><Rich text={hero('captionSub')}/></span></span></div>
   </div></section>
   <div className="atelier-values"><div className="container"><span><Heart size={17}/> <Rich text={values('value1')}/></span><span><Scissors size={17}/> <Rich text={values('value2')}/></span><span><Sparkles size={17}/> <Rich text={values('value3')}/></span><span><MessageCircle size={17}/> <Rich text={values('value4')}/></span></div></div>
   <section className="atelier-section container reveal"><div className="collection-heading"><div><span className="eyebrow"><Rich text={feat('eyebrow')}/></span><h2><Rich text={feat('title')}/></h2></div><Link to="/shop" className="text-link"><Rich text={feat('link')}/></Link></div><p className="section-intro"><Rich text={feat('intro')}/></p><div className="knit-grid">{featured.map(p => <ProductCard key={p.id} product={p}/>)}</div><div className="view-more-wrap"><Link className="btn btn-outline" to="/shop"><Rich text={feat('button')}/> <ArrowRight size={16}/></Link></div></section>
   <HandmadeGallery />
   <MakerStory />
   <section className="atelier-section container reveal" id="custom"><div className="custom-panel"><div><span className="eyebrow"><Rich text={custom('eyebrow')}/></span><h2><Rich text={custom('title')}/></h2><p><Rich text={custom('text')}/></p><a className="btn btn-primary" href={customUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={17}/> <Rich text={custom('button')}/></a></div><div className="custom-art"><img src={state.siteImages?.custom || imageSlots.custom.src} alt={state.siteImages?.custom ? "Custom handmade design" : imageSlots.custom.alt} loading="lazy"/><span className="handwritten"><Rich text={custom('handwriting')}/></span></div></div></section>
   <section className="how-section container reveal" id="how-to-order"><span className="eyebrow"><Rich text={how('eyebrow')}/></span><h2><Rich text={how('title')}/></h2><div className="how-grid">{[1, 2, 3].map(n => <div key={n}><span>{'0' + n}</span><h3><Rich text={how('step' + n + 'Title')}/></h3><p><Rich text={how('step' + n + 'Text')}/></p></div>)}</div><p className="order-note"><Rich text={how('note')}/></p></section>
   <InstagramSection />
 </main>
}
