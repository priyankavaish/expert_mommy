import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { onRequest } from '../functions/api/[[route]].js'

function setup() {
  const database = new DatabaseSync(':memory:')
  database.exec(readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8'))
  const DB = {
    prepare(sql) {
      const prepared = database.prepare(sql)
      const statement = args => ({
        bind: (...values) => statement(values),
        all: async () => ({ results: prepared.all(...args) }),
        first: async () => prepared.get(...args),
        run: async () => ({ meta: { changes: Number(prepared.run(...args.map(value => value instanceof ArrayBuffer ? new Uint8Array(value) : value)).changes) } }),
      })
      return statement([])
    },
    async batch(statements) {
      database.exec('BEGIN')
      try {
        const results = []
        for (const statement of statements) results.push(await statement.run())
        database.exec('COMMIT')
        return results
      } catch (error) {
        database.exec('ROLLBACK')
        throw error
      }
    },
  }
  const env = { DB, ADMIN_EMAIL: 'admin@example.test', ADMIN_PASSWORD: 'test-password-1234567890' }
  const origin = 'https://expert.example'
  const call = (path, method = 'GET', body, cookie, requestOrigin = origin) => onRequest({
    env,
    request: new Request(origin + '/api/' + path, {
      method,
      headers: { Origin: requestOrigin, ...(cookie ? { Cookie: cookie } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  })
  const login = () => call('admin/login', 'POST', { email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD })
  return { call, login }
}

test('admin changes require a valid session and publish public data only', async () => {
  const { call, login } = setup()
  assert.equal((await call('admin/store')).status, 401)
  assert.equal((await call('admin/store', 'PUT', {})).status, 401)
  assert.equal(await (await call('catalogue')).json(), null)
  const signedIn = await login()
  assert.equal(signedIn.status, 200)
  const setCookie = signedIn.headers.get('Set-Cookie')
  assert.match(setCookie, /HttpOnly; Secure; SameSite=Strict/)
  const cookie = setCookie.split(';')[0]
  const { revision } = await (await call('admin/store', 'GET', undefined, cookie)).json()
  const image = 'data:image/png;base64,iVBORw0KGgo='
  const data = {
    products: [{ id: 'p1', name: 'Sweater', stock: 0, price: 900, originalPrice: 1000, image, images: [image] }],
    siteImages: {}, handmadeGallery: [{ src: image, label: 'A 🧶 photo' }],
    orders: [{ id: 'secret-order' }], users: [{ id: 'secret-user' }], coupons: [], delivery: {},
  }
  assert.equal((await call('admin/store', 'PUT', { revision, data }, cookie, 'https://other.example')).status, 403)
  assert.equal((await call('admin/store', 'PUT', { revision, data }, cookie)).status, 200)
  assert.equal((await call('admin/store', 'PUT', { revision, data }, cookie)).status, 409)
  const publicData = await (await call('catalogue')).json()
  assert.deepEqual(Object.keys(publicData), ['products', 'siteImages', 'handmadeGallery', 'siteContent', 'categories'])
  assert.deepEqual(publicData.siteContent, {})
  assert.deepEqual(publicData.categories, [])
  const withText = { ...data, siteContent: { 'shop.title': 'New *title*' }, categories: [{ id: 'socks', name: 'Socks' }] }
  const latest = (await (await call('admin/store', 'GET', undefined, cookie)).json()).revision
  assert.equal((await call('admin/store', 'PUT', { revision: latest, data: withText }, cookie)).status, 200)
  const published = await (await call('catalogue')).json()
  assert.equal(published.siteContent['shop.title'], 'New *title*')
  assert.deepEqual(published.categories, [{ id: 'socks', name: 'Socks' }])
  const badCategory = { ...withText, categories: [{ id: 'Bad Id', name: 'x' }] }
  const latest3 = (await (await call('admin/store', 'GET', undefined, cookie)).json()).revision
  assert.equal((await call('admin/store', 'PUT', { revision: latest3, data: badCategory }, cookie)).status, 400)
  const badText = { ...withText, siteContent: { 'bad key!': 'x' } }
  const latest2 = (await (await call('admin/store', 'GET', undefined, cookie)).json()).revision
  assert.equal((await call('admin/store', 'PUT', { revision: latest2, data: badText }, cookie)).status, 400)
  assert.equal(publicData.products[0].stock, 0)
  const photo = await call(publicData.products[0].image.replace('/api/', ''))
  assert.equal(photo.headers.get('Content-Type'), 'image/png')
  assert.equal((await photo.arrayBuffer()).byteLength, 8)
  assert.equal(publicData.handmadeGallery[0].label, 'A 🧶 photo')
  assert.equal((await call('admin/logout', 'POST', undefined, cookie)).status, 200)
  assert.equal((await call('admin/store', 'GET', undefined, cookie)).status, 401)
})

test('incorrect admin passwords are rate limited', async () => {
  const { call, login } = setup()
  for (let i = 0; i < 8; i++) {
    assert.equal((await call('admin/login', 'POST', { email: 'admin@example.test', password: 'wrong' })).status, 401)
  }
  assert.equal((await login()).status, 429)
})
