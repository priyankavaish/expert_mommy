import { useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { defaultGallery, imageSlots } from '../../data/siteImages'

async function readPhoto(file) {
  const bitmap = await createImageBitmap(file)
  try {
    const canvas = document.createElement('canvas')
    const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height))
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/webp', 0.8)
  } finally {
    bitmap.close()
  }
}

function ImageEditor({ photo, onChange, onRemove, removeLabel, disabled, upload, label }) {
  const [url, setUrl] = useState('')
  return (
    <div className="site-image-editor">
      {photo.src && <img src={photo.src} alt={label} />}
      <div>
        <label className="frow">{label}
          <input className="finput" type="file" accept="image/*" disabled={disabled} onChange={event => {
            const file = event.target.files[0]
            event.target.value = ''
            if (file) upload([file], ([src]) => onChange(src))
          }} />
        </label>
        <div className="site-image-actions">
          <input className="finput" type="url" aria-label={label + ' URL'} placeholder="https://example.com/photo.jpg" value={url} onChange={event => setUrl(event.target.value)} />
          <button type="button" className="btn btn-outline btn-sm" disabled={disabled || !/^https?:\/\/[^\s]+$/i.test(url.trim())} onClick={() => {
            onChange(url.trim())
            setUrl('')
          }}>Use URL</button>
          {onRemove && <button type="button" className="btn btn-ghost btn-sm" disabled={disabled} onClick={onRemove}>{removeLabel}</button>}
        </div>
      </div>
    </div>
  )
}

export default function SiteImages() {
  const { state, saveSiteImages, toast } = useStore()
  const [images, setImages] = useState(state.siteImages || {})
  const [gallery, setGallery] = useState(state.handmadeGallery ?? defaultGallery)
  const [uploading, setUploading] = useState(false)

  const upload = async (files, update) => {
    setUploading(true)
    try {
      update(await Promise.all(files.map(readPhoto)))
    } catch {
      toast('Could not open the selected images. Try JPG, PNG, or WebP.', 'error')
    } finally {
      setUploading(false)
    }
  }

  const updateSlide = (index, changes) => setGallery(current => current.map((slide, i) => i === index ? { ...slide, ...changes } : slide))
  const save = () => {
    if (saveSiteImages(images, gallery)) toast('Site images saved.')
    else toast('Browser storage is full or unavailable. Try image URLs or fewer uploads.', 'error')
  }

  return (
    <div className="site-image-settings">
      <h1>Site Images</h1>
      <p>Upload photos or use image URLs, then save. Changes apply to this browser.</p>
      <section className="adm-card">
        <h2>Handmade gallery</h2>
        <label className="frow">Add gallery photos
          <input className="finput" type="file" accept="image/*" multiple disabled={uploading} onChange={event => {
            const files = Array.from(event.target.files)
            event.target.value = ''
            if (files.length) upload(files, sources => setGallery(current => [...current, ...sources.map(src => ({ src, label: '' }))]))
          }} />
        </label>
        <ImageEditor photo={{}} label="Add gallery photo by URL or file" disabled={uploading} upload={upload}
          onChange={src => setGallery(current => [...current, { src, label: '' }])} />
        {gallery.map((slide, i) => (
          <div key={i} className="site-gallery-slide">
            <ImageEditor photo={slide} label={'Replace gallery photo ' + (i + 1)} disabled={uploading} upload={upload}
              onChange={src => updateSlide(i, { src })} removeLabel="Remove"
              onRemove={() => setGallery(current => current.filter((_, index) => index !== i))} />
            <label className="frow">Caption for photo {i + 1}
              <input className="finput" value={slide.label} onChange={event => updateSlide(i, { label: event.target.value })} />
            </label>
          </div>
        ))}
        <button type="button" className="btn btn-ghost btn-sm" disabled={uploading} onClick={() => setGallery(defaultGallery)}>Restore default gallery</button>
      </section>
      <section className="adm-card">
        <h2>Banners, logo, portrait and Instagram</h2>
        {Object.entries(imageSlots).map(([key, slot]) => (
          <ImageEditor key={key} photo={{ src: images[key] || slot.src }} label={slot.label} disabled={uploading} upload={upload}
            onChange={src => setImages(current => ({ ...current, [key]: src }))}
            removeLabel="Restore default" onRemove={images[key] ? () => setImages(({ [key]: removed, ...current }) => current) : undefined} />
        ))}
      </section>
      <button type="button" className="btn btn-primary" disabled={uploading} onClick={save}>{uploading ? 'Preparing images...' : 'Save site images'}</button>
    </div>
  )
}
