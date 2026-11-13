import { Link } from 'react-router-dom'
import { Trash2, MessageCircle } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { money, whatsappUrl } from '../data/whatsapp'
export default function Cart() {
 const {state,dispatch}=useStore()
 const items=state.cart.map(i=>state.products.find(p=>p.id===i.productId)).filter(p=>p && p.stock>0)
 const total=items.reduce((n,p)=>n+p.price,0)
 const url=whatsappUrl("Hi Expert Mommy! I'd like to enquire about:\n"+items.map(p=>p.name+' ('+p.sku+'), quantity 1 - '+money(p.price)).join('\n')+"\nListed subtotal: "+money(total)+"\nPlease confirm availability, measurements, delivery charges and payment details.")
 return <main className="atelier container atelier-section"><span className="eyebrow">LET'S MAKE IT PERSONAL</span><h1>Your sweater enquiries</h1><p className="section-intro">Each handmade piece has a quantity of 1. Orders are confirmed with us on WhatsApp.</p>{!items.length ? <div className="empty-state"><h2>Find a little handmade warmth.</h2><p>Enquire directly from any sweater's page.</p><Link to="/shop" className="btn btn-primary">Browse sweaters</Link></div> : <div className="enquiry-list">{items.map(p=><div className="enquiry-item" key={p.id}><img src={p.image} alt={p.name}/><Link to={'/product/'+p.id}>{p.name}<span>Quantity: 1 &middot; {money(p.price)}</span></Link><button aria-label={'Remove '+p.name} onClick={()=>dispatch({type:'REMOVE_FROM_CART',payload:p.id})}><Trash2 size={18}/></button></div>)}<p>Listed subtotal: <strong>{money(total)}</strong>. Delivery and final amount confirmed in chat.</p><a className="btn btn-primary" href={url} target="_blank" rel="noopener noreferrer"><MessageCircle size={17}/> Enquire on WhatsApp</a><p className="enquiry-note">Opening WhatsApp does not place an order or reserve stock. Please send your message and wait for our confirmation.</p></div>}</main>
}
