import { useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { defaultGallery, imageSlots } from '../../data/siteImages'
import { contentSections, defaultContent } from '../../data/siteContent'

async function readPhoto(file) {
  const bitmap = await createImageBitmap(file)
  try {
    const canvas = document.createElement('canvas')
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
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
          <button type="button" className="btn btn-outline btn-sm" disabled={disabled || !/^https:\/\/[^\s]+$/i.test(url.trim())} onClick={() => {
            onChange(url.trim())
            setUrl('')
          }}>Use URL</button>
          {onRemove && <button type="button" className="btn btn-ghost btn-sm" disabled={disabled} onClick={onRemove}>{removeLabel}</button>}
        </div>
      </div>
    </div>
  )
}

function GalleryEditor({ gallery, setGallery, uploading, upload }) {
  const updateSlide = (index, changes) => setGallery(current => current.map((slide, i) => i === index ? { ...slide, ...changes } : slide))
  return (
    <div className="site-content-group">
      <h3>Gallery photos</h3>
      <label className="frow">Add gallery photos
        <input className="finput" type="file" accept="image/*" multiple disabled={uploading} onChange={event => {
          const files = Array.from(event.target.files)
          event.target.value = ''
          if (files.length) upload(files, sources => setGallery(current => [...current, ...sources.map(src => ({ src, label: '' }))]))
        }} />
      </label>
      <ImageEditor photo={{}} label="Add gallery photo by URL" disabled={uploading} upload={upload}
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
    </div>
  )
}

export default function SiteImages() {
  const { state, saveSiteContent, toast } = useStore()
  const [images, setImages] = useState(state.siteImages || {})
  const [gallery, setGallery] = useState(state.handmadeGallery ?? defaultGallery)
  const [content, setContent] = useState(state.siteContent || {})
  const [active, setActive] = useState(contentSections[0].id)
  const [uploading, setUploading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const section = contentSections.find(s => s.id === active)

  const change = setter => value => { setter(value); setDirty(true) }
  const editImages = change(setImages), editGallery = change(setGallery), editContent = change(setContent)

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

  const resetSection = () => {
    editContent(current => Object.fromEntries(Object.entries(current).filter(([key]) => !key.startsWith(section.id + '.'))))
    editImages(current => Object.fromEntries(Object.entries(current).filter(([key]) => !section.images.includes(key))))
    if (section.gallery) editGallery(defaultGallery)
  }

  const save = async () => {
    const changed = Object.fromEntries(Object.entries(content).filter(([key, value]) => key in defaultContent && value !== defaultContent[key]))
    if (await saveSiteContent(images, gallery, changed)) {
      setContent(changed)
      setDirty(false)
      toast('Website content published.')
    }
  }

  return (
    <div className="site-image-settings">
      <h1>Website Content</h1>
      <p>Pick a section, edit its text and photos, then save. Saved changes appear on the storefront.
        In text: press Enter for a new line, wrap words in <code>*stars*</code> for <em>italic</em> or <code>**double stars**</code> for <strong>bold</strong>.</p>

      <nav className="site-content-tabs" aria-label="Website sections">
        {contentSections.map(s => (
          <button key={s.id} type="button" className={s.id === active ? 'active' : ''} onClick={() => setActive(s.id)}>
            {s.title}<small>{s.page}</small>
          </button>
        ))}
      </nav>

      <section className="adm-card" key={section.id}>
        <div className="site-content-head">
          <h2>{section.title} <small>{section.page}</small></h2>
          <button type="button" className="btn btn-ghost btn-sm" disabled={uploading} onClick={resetSection}>Restore section defaults</button>
        </div>

        <div className="site-content-group">
          <h3>Text</h3>
          {Object.entries(section.fields).map(([key, field]) => {
            const id = section.id + '.' + key
            const value = content[id] ?? field.value
            const onChange = event => editContent(current => ({ ...current, [id]: event.target.value }))
            return (
              <label key={id} className="frow">{field.label}
                {field.long
                  ? <textarea rows={Math.max(2, value.split('\n').length + 1)} value={value} onChange={onChange} />
                  : <input className="finput" value={value} onChange={onChange} />}
              </label>
            )
          })}
        </div>

        {section.images.length > 0 && (
          <div className="site-content-group">
            <h3>Photos</h3>
            {section.id === 'shop' && <p className="site-content-hint">Upload a wide image to show a banner on the Products page.</p>}
            {section.images.map(key => {
              const slot = imageSlots[key]
              return (
                <ImageEditor key={key} photo={{ src: images[key] || slot.src }} label={slot.label} disabled={uploading} upload={upload}
                  onChange={src => editImages(current => ({ ...current, [key]: src }))}
                  removeLabel={slot.src ? "Restore default" : "Remove banner"} onRemove={images[key] ? () => editImages(({ [key]: removed, ...current }) => current) : undefined} />
              )
            })}
          </div>
        )}

        {section.gallery && <GalleryEditor gallery={gallery} setGallery={editGallery} uploading={uploading} upload={upload} />}
      </section>

      <div className="site-content-save">
        <button type="button" className="btn btn-primary" disabled={uploading} onClick={save}>{uploading ? 'Preparing images...' : 'Save all changes'}</button>
        {dirty && <span>You have unsaved changes.</span>}
      </div>
    </div>
  )
}
