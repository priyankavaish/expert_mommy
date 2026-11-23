import { useState } from 'react'
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
import { defaultGallery } from '../data/siteImages'
import { useStore } from '../context/StoreContext'
import { whatsappUrl } from '../data/whatsapp'
import usePhotoRotation from '../hooks/usePhotoRotation'



const enquiryUrl = whatsappUrl("Hi Expert Mommy! I'd love to discuss a custom handmade piece. Can we talk about my idea?")

export default function HandmadeGallery() {
  const { state } = useStore()
  const photos = state.handmadeGallery ?? defaultGallery
  const [paused, setPaused] = useState(false)
  const [active, setActive] = usePhotoRotation(photos.length, paused)
  const photo = photos[active]


  const move = direction => {
    setPaused(true)
    setActive(index => (index + direction + photos.length) % photos.length)
  }

  return (
    <section className="handmade-gallery" aria-labelledby="handmade-gallery-title">
      <div className="container handmade-gallery-grid">
        <div className="handmade-gallery-copy">
          <h2 id="handmade-gallery-title">From tiny shoes to <em>treasured keepsakes.</em></h2>
          <p>Alongside our cosy sweaters, we crochet bags for little adventures, flower clips and gajras for your hair, soft toys to hug, and keepsake boxes for the things you love. We make caps and tiny shoes, too.</p>
          <p>Have a colour, a gift, or a design in mind? Tell us what you'd love to have made.</p>
          <a className="btn btn-primary" href={enquiryUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={17} /> Discuss a custom order
          </a>
        </div>
        {photo && <div className="handmade-gallery-carousel" role="group" aria-label="Handmade creations gallery">
          <figure>
            <img src={photo.src} alt={photo.label || 'Handmade creation'} loading="lazy" />
            <figcaption aria-live={paused ? 'polite' : 'off'}>{photo.label}</figcaption>
          </figure>
          {photos.length > 1 && <div className="handmade-gallery-controls">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => move(-1)} aria-label="Previous photo"><ChevronLeft size={18} /></button>
            <span aria-label={'Photo ' + (active + 1) + ' of ' + photos.length}>{active + 1} / {photos.length}</span>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => move(1)} aria-label="Next photo"><ChevronRight size={18} /></button>
            <button type="button" className="btn btn-ghost btn-sm photo-autoplay" onClick={() => setPaused(value => !value)}>
              {paused ? 'Resume' : 'Pause'}
            </button>
          </div>}
        </div>}
      </div>
    </section>
  )
}