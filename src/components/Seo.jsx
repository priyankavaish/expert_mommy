import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'Expert Mommy'
const DEFAULT_DESCRIPTION = 'Handmade hand-knitted and crochet sweaters for babies and kids, made by Pushpa Rani with 44 years of knitting experience. One unique piece per design. Order on WhatsApp in India.'

const absolute = (origin, src) => !src ? origin + '/og-image.jpg' : /^https?:\/\//i.test(src) ? src : origin + (src.startsWith('/') ? '' : '/') + src

// Per-page title, description, canonical URL, social preview and structured data.
export default function Seo({ title, description = DEFAULT_DESCRIPTION, image, type = 'website', noindex = false, jsonLd }) {
  const { pathname } = useLocation()
  // index.html carries fallback tags for crawlers that skip JavaScript; drop them once page tags take over.
  useEffect(() => { document.querySelectorAll('head [data-static]').forEach(tag => tag.remove()) }, [])
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  const url = origin + pathname
  const fullTitle = title ? title + ' | ' + SITE_NAME : SITE_NAME + ' | Handmade Knitted & Crochet Sweaters for Kids'
  const photo = image && image.startsWith('data:') ? undefined : absolute(origin, image)
  const blocks = jsonLd ? [].concat(jsonLd) : []
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      {!noindex && <link rel="canonical" href={url} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={photo} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={photo} />
      {blocks.map((block, i) => <script key={i} type="application/ld+json">{JSON.stringify(block)}</script>)}
    </Helmet>
  )
}

export const absoluteUrl = src => absolute(typeof window === 'undefined' ? '' : window.location.origin, src)
