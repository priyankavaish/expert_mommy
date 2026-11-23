import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
import { customUrl } from '../data/whatsapp'
import { imageSlots } from '../data/siteImages'
import useReveal from '../hooks/useReveal'
export default function Shop() {
 const { state } = useStore()
 const { category } = useParams()
 const [params] = useSearchParams()
 const [query, setQuery] = useState('')
 const [sort, setSort] = useState('collection')
 const selected = ['crochet', 'hand-knitted'].includes(category) ? category : 'all'
 const products = useMemo(() => {
   let list = state.products.filter(p => (selected === 'all' || p.category === selected) && (!params.get('filter') || params.get('filter') !== 'featured' || p.featured) && p.name.toLowerCase().includes(query.toLowerCase()))
   if (sort === 'low') list.sort((a,b) => a.price - b.price)
   if (sort === 'high') list.sort((a,b) => b.price - a.price)
   return list
 }, [state.products, selected, query, sort, params])
 useReveal([products.length])
 return <main className="atelier"><section className="collection-banner"><div className="container collection-banner-grid"><div><span className="eyebrow">THE HANDMADE EDIT</span><h1>A little collection.<br/><em>A whole lot of warmth.</em></h1><p>Hand-knitted & crochet sweaters, each made with love.<br/>One piece per design. Find the one that feels like you.</p></div><div className="collection-banner-art"><img src={state.siteImages?.shopHero || imageSlots.shopHero.src} alt={state.siteImages?.shopHero ? "Expert Mommy shop collection" : imageSlots.shopHero.alt} fetchPriority="high"/></div></div></section><section className="container atelier-section reveal"><div className="collection-toolbar"><nav className="collection-tabs" aria-label="Sweater type">{[['all','All sweaters'],['hand-knitted','Hand knitted'],['crochet','Crochet']].map(([id,label]) => <Link key={id} className={selected === id ? 'selected' : ''} to={id === 'all' ? '/shop' : '/shop/'+id}>{label}</Link>)}</nav><div className="collection-controls"><label className="collection-search"><Search size={16}/><input aria-label="Search sweaters" placeholder="Find a sweater..." value={query} onChange={e => setQuery(e.target.value)}/></label><select aria-label="Sort sweaters" value={sort} onChange={e=>setSort(e.target.value)}><option value="collection">Collection order</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div></div><div className="collection-count">{products.length} handmade piece{products.length === 1 ? '' : 's'} <span>&middot; Just 1 of each &middot; Ages are approximate; confirm measurements on WhatsApp</span></div>{products.length ? <div className="knit-grid">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div> : <div className="empty-state"><h2>No sweaters found</h2><p>Try another name or browse all sweaters.</p><button className="btn btn-outline" onClick={()=>setQuery('')}>Clear search</button></div>}<div className="collection-custom"><div><span className="eyebrow">DREAMING OF SOMETHING DIFFERENT?</span><h2>We take custom orders, too.</h2><p>Tell us your colour, size and design ideas. We'll take it from there.</p></div><a className="btn btn-outline" href={customUrl} target="_blank" rel="noopener noreferrer">Discuss your idea</a></div></section></main>
}
