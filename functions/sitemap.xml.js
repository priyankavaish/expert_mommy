const PAGES = ['/', '/shop', '/shop/hand-knitted', '/shop/crochet', '/terms-and-conditions', '/privacy-policy', '/return-policy']
const escape = value => String(value).replace(/[<>&'"]/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char])

// Lists the storefront pages plus every product saved in the shared catalogue.
export async function onRequestGet({ request, env }) {
  const origin = new URL(request.url).origin
  let ids = []
  try {
    const { results } = await env.DB.prepare(
      'SELECT c.content FROM store_version v JOIN store_chunks c ON c.revision = v.revision WHERE v.id = 1 ORDER BY c.position'
    ).all()
    if (results.length) ids = JSON.parse(results.map(row => row.content).join('')).products.map(product => product.id)
  } catch {
    // Serve the static pages when the catalogue is unavailable.
  }
  const urls = [...PAGES, ...ids.map(id => '/product/' + encodeURIComponent(id))]
  const body = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(path => '  <url><loc>' + escape(origin + path) + '</loc></url>').join('\n') + '\n</urlset>\n'
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } })
}
