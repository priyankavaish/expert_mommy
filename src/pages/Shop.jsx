import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
import { customUrl } from '../data/whatsapp'
import useReveal from '../hooks/useReveal'
import { Rich, useContent } from '../components/Content'
import Seo from '../components/Seo'
import { allCategories, categoryName } from '../data/categories'
const PRODUCTS_PER_PAGE = 50

export default function Shop() {
 const { state } = useStore()
 const t = useContent('shop')
 const { category } = useParams()
 const [params, setParams] = useSearchParams()
 const [query, setQuery] = useState('')
 const featuredOnly = params.get('filter') === 'featured'
 const [sort, setSort] = useState('collection')
 const categories = allCategories(state)
 const tabs = categories.filter(c => state.products.some(p => p.category === c.id))
 const selected = categories.some(c => c.id === category) ? category : 'all'
 const products = useMemo(() => {
   let list = state.products.filter(p => (selected === 'all' || p.category === selected) && (!featuredOnly || p.featured) && p.name.toLowerCase().includes(query.toLowerCase()))
   if (sort === 'low') list.sort((a,b) => a.price - b.price)
   if (sort === 'high') list.sort((a,b) => b.price - a.price)
   return list
 }, [state.products, selected, query, sort, featuredOnly])
 const pageCount = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE))
 const requestedPage = Number(params.get('page'))
 const page = Number.isInteger(requestedPage) ? Math.min(pageCount, Math.max(1, requestedPage)) : 1
 const offset = (page - 1) * PRODUCTS_PER_PAGE
 const visibleProducts = products.slice(offset, offset + PRODUCTS_PER_PAGE)

 function setPage(nextPage, replace = false) {
   const nextParams = new URLSearchParams(params)
   if (nextPage === 1) nextParams.delete('page')
   else nextParams.set('page', String(nextPage))
   setParams(nextParams, { replace })
 }

 function changePage(nextPage) {
   setPage(nextPage)
   document.getElementById('products-list')?.scrollIntoView()
 }

 function resetPage() {
   if (params.has('page')) setPage(1, true)
 }

 useReveal([products.length])
 const name = categoryName(state, selected)
 const seo = {
   all: ['Shop Handmade Knitwear & Crochet', 'Browse handmade hand-knitted and crochet sweaters, socks, gloves, caps and more. One unique piece per design, made with love in India.'],
   'hand-knitted': ['Hand Knitted Sweaters for Kids', 'Hand-knitted woollen sweaters and cardigans for babies and kids. Each piece is one of a kind, handmade by Pushpa Rani in India.'],
   crochet: ['Crochet Sweaters & Frocks for Kids', 'Handmade crochet sweaters, cardigans and frocks for babies and kids. One unique piece per design, made with love in India.'],
 }[selected] || ['Handmade ' + name, 'Shop handmade ' + name.toLowerCase() + ' by Expert Mommy. Hand-knitted and crochet pieces, each one of a kind and made with love in India.']
 const banner = state.siteImages?.shopHero
 const origin = window.location.origin
 return <main className="atelier"><Seo title={seo[0]} description={seo[1]} noindex={!!params.get('filter')} jsonLd={{ '@context': 'https://schema.org', '@type': 'ItemList', name: seo[0], itemListElement: visibleProducts.map((p, i) => ({ '@type': 'ListItem', position: offset + i + 1, url: origin + '/product/' + p.id, name: p.name })) }}/><section className="collection-banner">{banner && <div className="collection-banner-art"><img src={banner} alt="Expert Mommy shop collection" fetchPriority="high"/></div>}<div className="container collection-banner-copy"><span className="eyebrow"><Rich text={t('eyebrow')}/></span><h1><Rich text={t('title')}/></h1><p><Rich text={t('text')}/></p></div></section><section id="products-list" className="container atelier-section reveal"><div className="collection-toolbar"><nav className="collection-tabs" aria-label="Product category">{[['all','All Products'], ...tabs.map(c => [c.id, c.name])].map(([id,label]) => <Link key={id} className={selected === id ? 'selected' : ''} to={id === 'all' ? '/shop' : '/shop/'+id}>{label}</Link>)}</nav><div className="collection-controls"><label className="collection-search"><Search size={16}/><input aria-label="Search products" placeholder="Search products..." value={query} onChange={e => { setQuery(e.target.value); resetPage() }}/></label><select aria-label="Sort products" value={sort} onChange={e => { setSort(e.target.value); resetPage() }}><option value="collection">Collection order</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div></div><div className="collection-count">{products.length} handmade piece{products.length === 1 ? '' : 's'} <span>&middot; <Rich text={t('countNote')}/></span></div>{products.length ? <div className="knit-grid">{visibleProducts.map(p=><ProductCard key={p.id} product={p}/>)}</div> : <div className="empty-state"><h2>No products found</h2><p>Try another name or browse all products.</p><button className="btn btn-outline" onClick={() => { setQuery(''); resetPage() }}>Clear search</button></div>}
 {pageCount > 1 && (
   <nav className="pagination" aria-label="Products pagination">
     <button type="button" className="btn btn-outline" disabled={page === 1} onClick={() => changePage(page - 1)}>Previous</button>
     <span>Page {page} of {pageCount}</span>
     <button type="button" className="btn btn-outline" disabled={page === pageCount} onClick={() => changePage(page + 1)}>Next</button>
   </nav>
 )}
 <div className="collection-custom"><div><span className="eyebrow"><Rich text={t('customEyebrow')}/></span><h2><Rich text={t('customTitle')}/></h2><p><Rich text={t('customText')}/></p></div><a className="btn btn-outline" href={customUrl} target="_blank" rel="noopener noreferrer"><Rich text={t('customButton')}/></a></div></section></main>
}
