const COOKIE = '__Host-expert_session'
const SESSION_TTL = 8 * 60 * 60
const MAX_BYTES = 12 * 1024 * 1024
const CHUNK_PATTERN = /[\s\S]{1,400000}/gu
const encoder = new TextEncoder()

const reply = (data, status = 200, headers = {}) => Response.json(data, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers },
})

const hex = bytes => Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
const digest = async value => hex(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value))))

async function passwordMatches(actual, expected) {
  const [a, b] = await Promise.all([digest(actual), digest(expected)])
  let difference = 0
  for (let index = 0; index < a.length; index++) difference |= a.charCodeAt(index) ^ b.charCodeAt(index)
  return difference === 0
}

function sessionCookie(token, age) {
  return COOKIE + '=' + token + '; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=' + age
}

async function getSessionHash(request) {
  const value = request.headers.get('Cookie')?.split(';').map(part => part.trim())
    .find(part => part.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1)
  return value && /^[a-f0-9]{64}$/.test(value) ? digest(value) : null
}

async function loadStore(db) {
  const { results } = await db.prepare(
    'SELECT v.revision, c.content FROM store_version v LEFT JOIN store_chunks c ON c.revision = v.revision WHERE v.id = 1 ORDER BY c.position'
  ).all()
  if (!results.length) throw new Error('Missing database migration')
  return { revision: results[0].revision, data: results[0].content === null ? null : JSON.parse(results.map(row => row.content).join('')) }
}

const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const isText = (value, max) => typeof value === 'string' && value.length <= max
const isPhoto = value => typeof value === 'string' && value.length <= 1_500_000 &&
  (/^https:\/\/[^\s]+$/i.test(value) || /^\/(?:assets|src|expert_mommy_ux_images|api\/media)\/[a-z0-9_./%()-]+$/i.test(value) ||
    /^data:image\/(?:webp|png|jpeg);base64,[a-z0-9+/]+={0,2}$/i.test(value))

function validateStore(data) {
  if (!isRecord(data) || !Array.isArray(data.products) || data.products.length > 500 ||
      !['orders', 'users', 'coupons'].every(key => Array.isArray(data[key]) && data[key].every(isRecord)) ||
      !isRecord(data.delivery) || !isRecord(data.siteImages) || !Object.values(data.siteImages).every(isPhoto) ||
      !(data.handmadeGallery === null || (Array.isArray(data.handmadeGallery) && data.handmadeGallery.length <= 50 &&
        data.handmadeGallery.every(photo => isRecord(photo) && isPhoto(photo.src) && isText(photo.label, 250)))) ||
      !(data.siteContent === undefined || (isRecord(data.siteContent) && Object.keys(data.siteContent).length <= 300 &&
        Object.entries(data.siteContent).every(([key, value]) => /^[a-z0-9]+\.[a-z0-9]+$/i.test(key) && isText(value, 3000))))) return false
  const ids = new Set(data.products.map(product => product?.id))
  return ids.size === data.products.length && data.products.every(product => isRecord(product) &&
    isText(product.id, 80) && product.id.length > 0 && isText(product.name, 250) && product.name.trim() &&
    Number.isFinite(product.price) && product.price >= 0 && Number.isFinite(product.originalPrice) && product.originalPrice >= 0 &&
    Number.isSafeInteger(product.stock) && product.stock >= 0 && isPhoto(product.image) &&
    Array.isArray(product.images) && product.images.length <= 24 && product.images.length > 0 &&
    product.images[0] === product.image && product.images.every(isPhoto))
}

async function readJson(request, limit) {
  const reader = request.body?.getReader()
  if (!reader) return { error: reply({ error: 'Request body required.' }, 400) }
  let size = 0
  const decoder = new TextDecoder()
  const parts = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > limit) {
      await reader.cancel()
      return { error: reply({ error: 'Upload is too large.' }, 413) }
    }
    parts.push(decoder.decode(value, { stream: true }))
  }
  parts.push(decoder.decode())
  try {
    return { body: JSON.parse(parts.join('')) }
  } catch {
    return { error: reply({ error: 'Invalid JSON.' }, 400) }
  }
}

async function login(request, env, now) {
  const { body, error } = await readJson(request, 4096)
  if (error) return error
  if (!isRecord(body) || !isText(body.email, 254) || !isText(body.password, 512)) {
    return reply({ error: 'Enter a valid email and password.' }, 400)
  }
  const address = request.headers.get('CF-Connecting-IP') || 'local'
  const window = Math.floor(now / 600)
  const limit = await env.DB.prepare(
    'INSERT INTO login_attempts VALUES (?, ?, 1) ON CONFLICT(address) DO UPDATE SET attempts = CASE WHEN window = excluded.window THEN attempts + 1 ELSE 1 END, window = excluded.window RETURNING attempts'
  ).bind(address, window).first()
  if (limit.attempts > 8) return reply({ error: 'Too many login attempts. Try again in 10 minutes.' }, 429, { 'Retry-After': '600' })
  if (!(await passwordMatches(body.password, env.ADMIN_PASSWORD)) || body.email.trim().toLowerCase() !== env.ADMIN_EMAIL.trim().toLowerCase()) {
    return reply({ error: 'Invalid admin credentials.' }, 401)
  }
  const token = hex(crypto.getRandomValues(new Uint8Array(32)))
  await env.DB.batch([
    env.DB.prepare('DELETE FROM admin_sessions WHERE expires <= ? OR token_hash = ?').bind(now, await getSessionHash(request)),
    env.DB.prepare('DELETE FROM login_attempts WHERE window < ?').bind(window - 1),
    env.DB.prepare('DELETE FROM login_attempts WHERE address = ?').bind(address),
    env.DB.prepare('INSERT INTO admin_sessions VALUES (?, ?)').bind(await digest(token), now + SESSION_TTL),
  ])
  return reply({ authenticated: true }, 200, { 'Set-Cookie': sessionCookie(token, SESSION_TTL) })
}


async function prepareMedia(data) {
  const sources = [
    ...data.products.flatMap(product => product.images),
    ...Object.values(data.siteImages),
    ...(data.handmadeGallery || []).map(photo => photo.src),
  ]
  const uploads = [...new Set(sources.filter(source => source.startsWith('data:')))]
  if (uploads.length > 25) return null
  const media = await Promise.all(uploads.map(async source => {
    const comma = source.indexOf(',')
    const type = source.slice(5, source.indexOf(';'))
    const bytes = Uint8Array.from(atob(source.slice(comma + 1)), char => char.charCodeAt(0))
    return { source, id: await digest(source), type, bytes }
  }))
  const paths = new Map(media.map(({ source, id }) => [source, '/api/media/' + id]))
  const replace = source => paths.get(source) || source
  return {
    media,
    data: {
      ...data,
      products: data.products.map(product => ({ ...product, image: replace(product.image), images: product.images.map(replace) })),
      siteImages: Object.fromEntries(Object.entries(data.siteImages).map(([key, source]) => [key, replace(source)])),
      handmadeGallery: data.handmadeGallery?.map(photo => ({ ...photo, src: replace(photo.src) })) ?? null,
    },
  }
}

async function saveStore(request, db) {
  const { body, error } = await readJson(request, MAX_BYTES)
  if (error) return error
  if (!isRecord(body) || !isText(body.revision, 40) || !validateStore(body.data)) {
    return reply({ error: 'Invalid catalogue data. Check the product details and image formats.' }, 400)
  }
  const snapshot = await prepareMedia(body.data)
  if (!snapshot) return reply({ error: 'Save up to 25 new photos at a time.' }, 413)
  const revision = crypto.randomUUID()
  const serialized = JSON.stringify(snapshot.data)
  const statements = [
    db.prepare('UPDATE store_version SET revision = ? WHERE id = 1 AND revision = ?').bind(revision, body.revision),
  ]
  for (const { id, type, bytes } of snapshot.media) {
    statements.push(db.prepare(
      'INSERT OR IGNORE INTO store_media SELECT ?, ?, ? WHERE EXISTS (SELECT 1 FROM store_version WHERE revision = ?)'
    ).bind(id, type, bytes.buffer, revision))
  }
  const chunks = serialized.match(CHUNK_PATTERN)
  for (const [position, content] of chunks.entries()) {
    statements.push(db.prepare(
      'INSERT INTO store_chunks SELECT ?, ?, ? WHERE EXISTS (SELECT 1 FROM store_version WHERE revision = ?)'
    ).bind(revision, position, content, revision))
  }
  statements.push(db.prepare(
    'DELETE FROM store_chunks WHERE revision = ? AND EXISTS (SELECT 1 FROM store_version WHERE revision = ?)'
  ).bind(body.revision, revision))
  const results = await db.batch(statements)
  return results[0].meta.changes === 1
    ? reply({ revision, data: snapshot.data })
    : reply({ error: 'The store changed in another session. Reload before trying again.' }, 409)
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url)
  const route = url.pathname.replace(/\/$/, '')
  const { method } = request
  if (!env.DB) return reply({ error: 'Store database is unavailable.' }, 503)
  try {
    const now = Math.floor(Date.now() / 1000)
    const mediaId = route.match(/^\/api\/media\/([a-f0-9]{64})$/)?.[1]
    if (mediaId && method === 'GET') {
      const media = await env.DB.prepare('SELECT type, bytes FROM store_media WHERE id = ?').bind(mediaId).first()
      if (!media) return reply({ error: 'Photo not found.' }, 404)
      return new Response(new Uint8Array(media.bytes), {
        headers: { 'Content-Type': media.type, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' },
      })
    }
    if (route === '/api/catalogue' && method === 'GET') {
      const { data } = await loadStore(env.DB)
      return reply(data && { products: data.products, siteImages: data.siteImages, handmadeGallery: data.handmadeGallery, siteContent: data.siteContent || {} })
    }
    if (!['/api/admin/login', '/api/admin/logout', '/api/admin/store'].includes(route)) {
      return reply({ error: 'API route not found.' }, 404)
    }
    if (method !== 'GET' && request.headers.get('Origin') !== url.origin) {
      return reply({ error: 'Invalid request origin.' }, 403)
    }
    if (route === '/api/admin/login' && method === 'POST') {
      if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD || env.ADMIN_PASSWORD.length < 16) {
        return reply({ error: 'Admin login has not been configured.' }, 503)
      }
      return await login(request, env, now)
    }
    const tokenHash = await getSessionHash(request)
    if (route === '/api/admin/logout' && method === 'POST') {
      if (tokenHash) await env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').bind(tokenHash).run()
      return reply({ authenticated: false }, 200, { 'Set-Cookie': sessionCookie('', 0) })
    }
    const valid = tokenHash && await env.DB.prepare(
      'SELECT 1 FROM admin_sessions WHERE token_hash = ? AND expires > ?'
    ).bind(tokenHash, now).first()
    if (!valid) return reply({ error: 'Admin sign-in required.' }, 401)
    if (route === '/api/admin/store' && method === 'GET') return reply(await loadStore(env.DB))
    if (route === '/api/admin/store' && method === 'PUT') return await saveStore(request, env.DB)
    return reply({ error: 'Method not allowed.' }, 405)
  } catch (error) {
    console.error('Store API failed', error.name)
    return reply({ error: 'Store service is temporarily unavailable.' }, 503)
  }
}
