import InstagramSection from '../components/InstagramSection'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Scissors, MessageCircle, Sparkles } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
import MakerStory from '../components/MakerStory'
import HandmadeGallery from '../components/HandmadeGallery'
import { customUrl } from '../data/whatsapp'
import { imageSlots } from '../data/siteImages'
import useReveal from '../hooks/useReveal'
export default function Home() {
 const { state } = useStore()
 const featured = state.products.filter(p => p.featured).slice(0, 4)
 useReveal([state.products])
 return <main className="atelier">
   <section className="atelier-hero"><div className="container atelier-hero-grid">
     <div className="atelier-hero-copy"><span className="eyebrow"><span/> FROM HER HANDS TO YOUR HEART</span><h1>Little stitches.<br/>Big <em>warm hugs.</em></h1><p>Hand-knitted & crochet sweaters with a little personality and a whole lot of love. Thoughtfully handmade, one beautiful piece at a time.</p><div className="atelier-buttons"><Link className="btn btn-primary" to="/shop">Find your favourite <ArrowRight size={17}/></Link><a className="text-link" href="#custom">Made just for you</a></div><div className="hero-note"><Heart size={16}/><span>Always handmade. Never ordinary.</span></div></div>
     <div className="atelier-hero-art"><div className="hero-ring"/><span className="handwritten hero-handwriting">a hug you can wear</span><img src={state.siteImages?.homeHero || imageSlots.homeHero.src} alt={state.siteImages?.homeHero ? "Expert Mommy handmade collection" : imageSlots.homeHero.alt} fetchPriority="high"/><span className="hero-seal"><Heart size={22}/>made with<br/><em>love & care</em></span><span className="hero-art-caption">THE FLOWER PATCH SWEATER <span>HANDMADE BY EXPERT MOMMY</span></span></div>
   </div></section>
   <div className="atelier-values"><div className="container"><span><Heart size={17}/> 100% handmade</span><span><Scissors size={17}/> Hand knitted & crochet</span><span><Sparkles size={17}/> Just one of each</span><span><MessageCircle size={17}/> Order on WhatsApp</span></div></div>
   <section className="atelier-section container reveal"><div className="collection-heading"><div><span className="eyebrow">SMALL COLLECTION. SO MUCH LOVE.</span><h2>Meet your next cosy favourite.</h2></div><Link to="/shop" className="text-link">Explore all products</Link></div><p className="section-intro">Real handmade pieces, ready for a new home. Only one of each is available.</p><div className="knit-grid">{featured.map(p => <ProductCard key={p.id} product={p}/>)}</div><div className="view-more-wrap"><Link className="btn btn-outline" to="/shop">View more sweaters <ArrowRight size={16}/></Link></div></section>
   <HandmadeGallery />
   <MakerStory />
   <section className="atelier-section container reveal" id="custom"><div className="custom-panel"><div><span className="eyebrow">YOUR IDEA. OUR HANDMADE TOUCH.</span><h2>A sweater with<br/><em>your story in it.</em></h2><p>A favourite colour, a special size, or a design you've been dreaming of? We take custom orders. Share your inspiration and we'll discuss what we can make, the price and the making time.</p><a className="btn btn-primary" href={customUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={17}/> Let's make something special</a></div><div className="custom-art"><img src={state.siteImages?.custom || imageSlots.custom.src} alt={state.siteImages?.custom ? "Custom handmade design" : imageSlots.custom.alt} loading="lazy"/><span className="handwritten">a little more you &hearts;</span></div></div></section>
   <section className="how-section container reveal" id="how-to-order"><span className="eyebrow">A PERSONAL TOUCH, FROM START TO FINISH</span><h2>Your favourite is just a chat away.</h2><div className="how-grid">{[['01','Find your sweater','Browse the collection and take a closer look at all the photos.'],['02','Say hello on WhatsApp','Send an enquiry. We\u2019ll help confirm availability, measurements and delivery.'],['03','Make it yours','Confirm the details and payment with us in the chat. Then we\u2019ll arrange your order.']].map(([n,t,d]) => <div key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div><p className="order-note">Each ready-made sweater has a quantity of 1. An enquiry does not reserve a piece; we confirm your order personally on WhatsApp.</p></section>
   <InstagramSection />
 </main>
}
