import { ageLabel } from '../data/ages'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { money, productUrl } from '../data/whatsapp'
export default function ProductCard({ product }) {
  return <article className="knit-card">
    <Link to={'/product/' + product.id} className="knit-card-photo">
      <span className="piece-label">{product.stock > 0 ? 'Only 1 piece' : 'Unavailable'}</span>
      <img src={product.image} alt={product.name} loading="lazy" />
      <span className="photo-count">{(product.images || [product.image]).length} photo{product.images?.length === 1 ? '' : 's'}</span>
    </Link>
    <div className={'knit-card-type cat-' + product.category}>{product.category === 'crochet' ? 'Hand crochet' : 'Hand knitted'} &middot; Handmade</div>
    <Link to={'/product/' + product.id} className="knit-card-title">{product.name}</Link>
    <p className="product-age">Approx. age: {ageLabel(product)}</p>
    <div className="knit-card-bottom"><span>{money(product.price)}</span>{product.stock > 0 ? <a href={productUrl(product)} target="_blank" rel="noopener noreferrer" aria-label={'Enquire about ' + product.name}><MessageCircle size={15}/> Enquire</a> : <span className="muted">Unavailable</span>}</div>
  </article>
}
