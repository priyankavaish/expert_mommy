import { useState } from 'react'
import usePhotoRotation from '../hooks/usePhotoRotation'
import { ageLabel } from '../data/ages'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { money, productUrl, DELIVERY_CHARGE } from '../data/whatsapp'
import { useStore } from '../context/StoreContext'
import { categoryName } from '../data/categories'
export default function ProductCard({ product }) {
  const { state } = useStore()
  const age = ageLabel(product)
  const photos = product.images?.length ? product.images : [product.image]
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [active] = usePhotoRotation(photos.length, hovered || focused)
  return <article className="knit-card">
    <Link to={'/product/' + product.id} className="knit-card-photo"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
      <span className="piece-label">{product.stock > 0 ? 'Only 1 piece' : 'Sold out'}</span>
      <img src={photos[active]} alt={product.name} loading="lazy" />
      <span className="photo-count">{photos.length} photo{photos.length === 1 ? '' : 's'}</span>
    </Link>
    <div className={'knit-card-type cat-' + product.category}>{product.category === 'crochet' ? 'Hand crochet' : product.category === 'hand-knitted' ? 'Hand knitted' : categoryName(state, product.category)} &middot; Handmade</div>
    <Link to={'/product/' + product.id} className="knit-card-title">{product.name}</Link>
    {age && <p className="product-age">Approx. age: {age}</p>}
    <div className="knit-card-bottom">
      <div className="knit-card-price">
        <span className="price-now">{money(product.price)}</span>
        {product.originalPrice > product.price && <s className="price-was">{money(product.originalPrice)}</s>}
        <small className="price-delivery">+ {money(DELIVERY_CHARGE)} delivery</small>
      </div>
      {product.stock > 0 ? <a href={productUrl(product)} target="_blank" rel="noopener noreferrer" aria-label={'Enquire about ' + product.name}><MessageCircle size={15}/> Enquire</a> : <span className="muted">Sold out</span>}
    </div>
  </article>
}
