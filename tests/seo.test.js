import test from 'node:test'
import assert from 'node:assert/strict'
import { onRequestGet as sitemap } from '../functions/sitemap.xml.js'
import { onRequestGet as robots } from '../functions/robots.txt.js'

const request = path => new Request('https://expertmommy.in' + path)
const db = content => ({ prepare: () => ({ all: async () => ({ results: content ? [{ content }] : [] }) }) })

test('sitemap lists storefront pages and saved products', async () => {
  const data = { products: [{ id: 'p1', category: 'socks' }, { id: 'a&b' }], categories: [{ id: 'socks', name: 'Socks' }, { id: 'caps', name: 'Caps' }] }
  const response = await sitemap({ request: request('/sitemap.xml'), env: { DB: db(JSON.stringify(data)) } })
  assert.match(response.headers.get('Content-Type'), /application\/xml/)
  const xml = await response.text()
  for (const path of ['/', '/shop', '/shop/crochet', '/shop/socks', '/return-policy', '/product/p1', '/product/a%26b']) assert.ok(xml.includes('<loc>https://expertmommy.in' + path + '</loc>'), path)
  assert.ok(!xml.includes('/shop/caps'), 'empty categories are left out')
})

test('sitemap still serves pages when the catalogue is empty or failing', async () => {
  const empty = await (await sitemap({ request: request('/sitemap.xml'), env: { DB: db(null) } })).text()
  assert.ok(empty.includes('<loc>https://expertmommy.in/shop</loc>'))
  const broken = await (await sitemap({ request: request('/sitemap.xml'), env: {} })).text()
  assert.ok(broken.includes('<loc>https://expertmommy.in/</loc>'))
})

test('robots blocks private pages and points to the sitemap', async () => {
  const text = await (await robots({ request: request('/robots.txt') })).text()
  assert.match(text, /Disallow: \/admin\n/)
  assert.match(text, /Sitemap: https:\/\/expertmommy\.in\/sitemap\.xml/)
})
