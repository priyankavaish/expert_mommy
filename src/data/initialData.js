import { SWEATER_GROUPS } from '../assets/products'

export const CATEGORIES = [
  { id: 'hand-knitted', name: 'Hand Knitted', image: SWEATER_GROUPS.multicolorStripe[0] },
  { id: 'crochet', name: 'Crochet', image: SWEATER_GROUPS.creamButton[0] }
]

const makeSweater = (id, name, images, ageGroup, price, originalPrice, stock, description) => ({
  id, name, category: [3, 7, 9, 10].includes(Number(id.slice(1))) ? 'crochet' : 'hand-knitted', ageGroup, price, originalPrice,
  image: images[0], images, sku: `SW-${id.slice(1).padStart(3, '0')}`,
  stock: Math.min(1, stock), description, featured: [1, 3, 4, 8].includes(Number(id.slice(1))), newArrival: true,
  tags: ['winter', 'knit', 'sweater']
})

export const INITIAL_PRODUCTS = [
  makeSweater('p1', 'Multicolor Striped Cardigan', SWEATER_GROUPS.multicolorStripe, '2-4y', 1199, 1499, 1, 'Hand-knitted multicolor striped cardigan, soft and warm.'),
  makeSweater('p2', 'Rust Orange Cardigan', SWEATER_GROUPS.rustOrange, '2-4y', 1099, 1399, 1, 'Hand-knitted rust orange cardigan, cosy winter wear.'),
  makeSweater('p3', 'Pink Colorblock Sweater', SWEATER_GROUPS.pinkColorblock, '1-2y', 1299, 1599, 1, 'Handmade pink and cream cardigan with textured crochet detailing.'),
  makeSweater('p4', 'Patchwork Cream Sweater', SWEATER_GROUPS.patchworkCream, '4-6y', 1399, 1799, 1, 'Hand-knitted cream sweater with colorful patchwork squares.'),
  makeSweater('p5', 'Cocoa & Cream Cardigan', SWEATER_GROUPS.brownColorblock, '2-4y', 1249, 1549, 1, 'Hand-knitted brown and cream colorblock cardigan.'),
  makeSweater('p7', 'Ivory Hooded Crochet Cardigan', SWEATER_GROUPS.creamButton, '6-12m', 1149, 1449, 1, 'Hand-crocheted ivory hooded cardigan with buttons and little front pockets.'),
  makeSweater('p8', 'Mustard Ruffle Sweater', SWEATER_GROUPS.mustardRuffle, '1-2y', 1349, 1699, 1, 'Hand-knitted mustard yellow sweater with ruffle detailing.'),
  makeSweater('p9', 'Seafoam Crochet Sweater Dress', SWEATER_GROUPS.tealCrochetDress, '2-4y', 1499, 1899, 1, 'Hand-crocheted seafoam sweater dress with a white neckline, tie and scalloped white hem.'),
  makeSweater('p10', 'Powder Blue Crochet Cardigan', SWEATER_GROUPS.lightBlueSash, '1-2y', 1249, 1599, 1, 'Handmade powder blue cardigan with textured crochet and ribbed trims.')
]

export const INITIAL_USERS = [
  { id: 'u1', name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210', role: 'customer', createdAt: '2025-11-10', orders: ['o1','o2'], address: '12 Park Street, Mumbai' },
  { id: 'u2', name: 'Anita Verma', email: 'anita@example.com', phone: '9123456780', role: 'customer', createdAt: '2025-12-05', orders: ['o3'], address: '45 Lake View, Pune' },
  { id: 'u3', name: 'Rekha Joshi', email: 'rekha@example.com', phone: '9000112233', role: 'customer', createdAt: '2026-01-20', orders: [], address: '8 Rose Garden, Delhi' }
]

export const INITIAL_ORDERS = [
  { id: 'o1', userId: 'u1', customerName: 'Priya Sharma', customerEmail: 'priya@example.com', items: [{ productId: 'p1', name: 'Multicolor Striped Cardigan', qty: 1, price: 1199, image: INITIAL_PRODUCTS[0].image }], subtotal: 1199, discount: 0, shipping: 0, total: 1199, status: 'delivered', paymentMethod: 'WhatsApp', address: '12 Park Street, Mumbai', createdAt: '2025-12-10', tracking: 'EM123456789IN' },
  { id: 'o2', userId: 'u1', customerName: 'Priya Sharma', customerEmail: 'priya@example.com', items: [{ productId: 'p3', name: 'Pink Colorblock Sweater', qty: 1, price: 1299, image: INITIAL_PRODUCTS[2].image }], subtotal: 1299, discount: 130, shipping: 0, total: 1169, status: 'shipped', paymentMethod: 'WhatsApp', address: '12 Park Street, Mumbai', createdAt: '2026-01-15', tracking: 'EM987654321IN' },
  { id: 'o3', userId: 'u2', customerName: 'Anita Verma', customerEmail: 'anita@example.com', items: [{ productId: 'p8', name: 'Mustard Ruffle Sweater', qty: 1, price: 1349, image: INITIAL_PRODUCTS.find(p => p.id === 'p8').image }], subtotal: 1349, discount: 0, shipping: 99, total: 1448, status: 'processing', paymentMethod: 'WhatsApp', address: '45 Lake View, Pune', createdAt: '2026-01-28', tracking: '' },
  { id: 'o4', userId: 'u2', customerName: 'Anita Verma', customerEmail: 'anita@example.com', items: [{ productId: 'p9', name: 'Seafoam Crochet Sweater Dress', qty: 1, price: 1499, image: INITIAL_PRODUCTS.find(p => p.id === 'p9').image }], subtotal: 1499, discount: 0, shipping: 0, total: 1499, status: 'pending', paymentMethod: 'WhatsApp', address: '45 Lake View, Pune', createdAt: '2026-02-01', tracking: '' }
]

export const INITIAL_COUPONS = [
  { id: 'c1', code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 500, maxUses: 100, usedCount: 23, expiryDate: '2026-12-31', active: true, description: '10% off for new customers' },
  { id: 'c2', code: 'FLAT100', type: 'fixed', value: 100, minOrder: 800, maxUses: 50, usedCount: 18, expiryDate: '2026-06-30', active: true, description: 'Flat â‚¹100 off on orders above â‚¹800' },
  { id: 'c3', code: 'MOMDAY20', type: 'percentage', value: 20, minOrder: 1000, maxUses: 200, usedCount: 67, expiryDate: '2026-05-15', active: false, description: "Mother's Day special 20% off" }
]

export const INITIAL_DELIVERY = {
  freeShippingThreshold: 599,
  standardRate: 99,
  expressRate: 199,
  estimatedDays: { standard: '5-7', express: '2-3' },
  codAvailable: true,
  codCharge: 30,
  servicePincodes: 'All India',
  carrier: 'India Post / Delhivery'
}
