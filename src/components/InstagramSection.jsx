import { Instagram, Play } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import useReveal from '../hooks/useReveal'
import { SOCIAL_LINKS } from '../data/social'
import { Rich, useContent } from './Content'
import photo1 from '../assets/instagram/post-1.jpg'
import photo2 from '../assets/instagram/post-2.jpg'
import photo3 from '../assets/instagram/post-3.jpg'
import photo4 from '../assets/instagram/post-4.jpg'
import photo5 from '../assets/instagram/post-5.jpg'
import photo6 from '../assets/instagram/post-6.jpg'
import photo7 from '../assets/instagram/post-7.jpg'
import photo8 from '../assets/instagram/post-8.jpg'

const photos = [
  { image: photo1, alt: 'Handmade navy crochet shorts with wooden bead drawstring', type: 'photo' },
  { image: photo2, alt: 'Hand-knitted red and white baby cardigan with pom-poms', type: 'photo' },
  { image: photo3, alt: 'Crochet sunflower bun holder hair accessory', type: 'reel' },
  { image: photo4, alt: 'Beige crochet baby frock with matching booties and bag', type: 'photo' },
  { image: photo5, alt: 'Crochet floral bun holder styled on a bridal updo', type: 'reel' },
  { image: photo6, alt: 'Yellow and brown knitted baby booties', type: 'photo' },
  { image: photo7, alt: 'Crochet red and cream sweater with teddy bear applique', type: 'reel' },
  { image: photo8, alt: 'Knitted mustard and plum baby romper set with collar', type: 'photo' }
]

export default function InstagramSection() {
  const { state } = useStore()
  const t = useContent('instagram')
  const displayedPhotos = photos.map((photo, i) => {
    const image = state.siteImages?.['instagram' + i]
    return image ? { image, alt: 'Expert Mommy Instagram photo ' + (i + 1), type: 'photo' } : photo
  })
  const instagram = SOCIAL_LINKS.find(social => social.id === 'instagram')
  useReveal()
  return (
    <section className="instagram-section reveal" aria-labelledby="instagram-heading">
      <div className="container">
        <div className="instagram-gallery-heading">
          <div><span className="eyebrow"><Rich text={t('eyebrow')} /></span><h2 id="instagram-heading"><Rich text={t('title')} /></h2><p><Rich text={t('text')} /></p></div>
          <a className="btn btn-outline" href={instagram.url} target="_blank" rel="noopener noreferrer"><Instagram size={17} /> {instagram.handle}</a>
        </div>
        <div className="instagram-photo-grid">
          <div className="instagram-photo-track">
            {[...displayedPhotos, ...displayedPhotos].map((photo, i) => <a key={photo.image + i} href={instagram.url} target="_blank" rel="noopener noreferrer" aria-label={photo.alt + ' - explore on Instagram'}><img src={photo.image} alt={photo.alt} loading="lazy" width="540" height="540" /><span className="instagram-tile-icon">{photo.type === 'reel' ? <Play size={17} /> : <Instagram size={17} />}</span><span className="instagram-tile-hover">Explore on Instagram</span></a>)}
          </div>
        </div>
        <a className="instagram-gallery-footer" href={instagram.url} target="_blank" rel="noopener noreferrer"><Rich text={t('footer')} /></a>
      </div>
    </section>
  )
}
