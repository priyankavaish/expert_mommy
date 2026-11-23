import { ageLabel } from '../data/ages'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, MessageCircle, Heart } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { money, productUrl, customUrl } from '../data/whatsapp'
import ProductCard from '../components/ProductCard'
import useReveal from '../hooks/useReveal'
import usePhotoRotation from '../hooks/usePhotoRotation'
function Detail({ product, products }) {
 const [paused, setPaused] = useState(false)
 const photos=product.images?.length ? product.images : [product.image]
 const [active, setActive] = usePhotoRotation(photos.length, paused)
 const selectPhoto = index => {
   setPaused(true)
   setActive(index)
 }
 const next = delta => selectPhoto((active + delta + photos.length) % photos.length)
 useReveal([product.id])
 return <main className="atelier container detail-page reveal"><div className="atelier-breadcrumb"><Link to="/">Home</Link> / <Link to="/shop">Our sweaters</Link> / <span>{product.name}</span></div><div className="atelier-detail-grid"><div><div className="detail-photo"><span className="piece-label">{product.stock > 0 ? 'Only 1 piece available' : 'Currently unavailable'}</span><img src={photos[active]} alt={product.name + ' - photo ' + (active+1)}/>{photos.length>1 && <><button className="gallery-prev" onClick={()=>next(-1)} aria-label="Previous photo"><ChevronLeft/></button><button className="gallery-next" onClick={()=>next(1)} aria-label="Next photo"><ChevronRight/></button></>}<span className="gallery-count" aria-live={paused ? "polite" : "off"}>{active+1} / {photos.length}</span></div><div className="detail-thumbnails">{photos.map((src,i)=><button key={i} className={active === i ? 'selected' : ''} aria-label={'View photo '+(i+1)} aria-pressed={active===i} onClick={()=>selectPhoto(i)}><img src={src} alt="" /></button>)}</div>{photos.length > 1 && <button type="button" className="btn btn-ghost btn-sm photo-autoplay" onClick={() => setPaused(current => !current)}>{paused ? "Resume slideshow" : "Pause slideshow"}</button>}<p className="photo-note">Photos show the same handmade piece from different views. Colours may vary slightly on screen.</p></div><div className="detail-copy"><span className="eyebrow">{product.category === 'crochet' ? 'HAND CROCHET' : 'HAND KNITTED'} &middot; 100% HANDMADE</span><h1>{product.name}</h1><div className="detail-price">{money(product.price)}</div><p>{product.description}</p><div className="detail-facts"><div><span>Availability</span><strong>{product.stock > 0 ? '1 unique piece' : 'Unavailable'}</strong></div><div><span>Approx. age</span><strong>{ageLabel(product)}</strong></div><div><span>Size & fit</span><strong>Ask us for measurements</strong></div><div><span>Product code</span><strong>{product.sku}</strong></div><div><span>Delivery</span><strong>Confirmed on WhatsApp</strong></div></div>{product.stock>0 ? <a className="btn btn-primary detail-enquire" href={productUrl(product)} target="_blank" rel="noopener noreferrer"><MessageCircle size={19}/> Enquire on WhatsApp</a> : <a className="btn btn-outline detail-enquire" href={customUrl} target="_blank" rel="noopener noreferrer">Ask about a custom piece</a>}<p className="age-fit-note">Age is an estimate only. Please confirm chest, length and sleeve measurements on WhatsApp before ordering.</p><p className="enquiry-note">We'll confirm availability, exact measurements, delivery charges and payment details in the chat. Your order is confirmed personally on WhatsApp.</p><div className="detail-custom"><Heart size={22}/><div><h3>Love it, but have something else in mind?</h3><p>Custom orders are welcome. Let's discuss your size, colour or design.</p><a className="text-link" href={customUrl} target="_blank" rel="noopener noreferrer">Create your own</a></div></div><details className="care-details"><summary>A little care goes a long way</summary><p>For handmade knitwear, gentle hand washing in cool water and drying flat helps preserve its shape. Ask us for care instructions for this specific piece.</p></details></div></div><section className="atelier-section reveal"><div className="collection-heading"><h2>A little more handmade love.</h2><Link to="/shop" className="text-link">View all</Link></div><div className="knit-grid">{products.filter(p=>p.id!==product.id).slice(0,4).map(p=><ProductCard key={p.id} product={p}/>)}</div></section></main>
}
export default function ProductDetail() {
 const {id}=useParams()
 const {state}=useStore()
 const product=state.products.find(p=>p.id===id)
 if(!product) return <main className="container empty-state"><h1>Sweater not found</h1><Link className="btn btn-primary" to="/shop">Explore our sweaters</Link></main>
 return <Detail key={id} product={product} products={state.products}/>
}
