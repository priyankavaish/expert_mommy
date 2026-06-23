import {
  categoryBaby, categoryToy, categoryKidswear,
  categoryBag, categoryHome, categoryHat
} from '../assets/images'

export const CATEGORIES = [
  { id: 'baby', name: 'Baby Essentials', image: categoryBaby },
  { id: 'toys', name: 'Toys & Amigurumi', image: categoryToy },
  { id: 'kidswear', name: 'Kids Wear', image: categoryKidswear },
  { id: 'bags', name: 'Bags & Accessories', image: categoryBag },
  { id: 'home', name: 'Home Decor', image: categoryHome },
  { id: 'winter', name: 'Winter Specials', image: categoryHat }
]

export const INITIAL_PRODUCTS = [
  { id: 'p1', name: 'Knitted Baby Booties Set', category: 'baby', price: 699, originalPrice: 899, image: categoryBaby, sku: 'BB-001', stock: 15, description: 'Adorable hand-knitted baby booties, soft and skin-friendly. Perfect for newborns up to 6 months. Made with 100% organic cotton yarn.', rating: 4.8, reviews: 34, featured: true, newArrival: true, tags: ['baby','knit','booties'] },
  { id: 'p2', name: 'Amigurumi Bunny Toy', category: 'toys', price: 849, originalPrice: 1099, image: categoryToy, sku: 'AT-001', stock: 8, description: 'Adorable hand-crocheted amigurumi bunny wearing a tiny outfit. Safe for babies above 3 years. Made with hypoallergenic yarn.', rating: 4.9, reviews: 52, featured: true, newArrival: false, tags: ['toy','amigurumi','bunny'] },
  { id: 'p3', name: 'Crochet Baby Cardigan', category: 'kidswear', price: 1199, originalPrice: 1499, image: categoryKidswear, sku: 'KW-001', stock: 12, description: 'Beautiful hand-crocheted cardigan for babies 3-12 months. Soft cotton yarn, gentle on baby skin. Available in pink and white.', rating: 4.7, reviews: 28, featured: true, newArrival: true, tags: ['kidswear','cardigan','crochet'] },
  { id: 'p4', name: 'Macramé Tote Bag', category: 'bags', price: 1299, originalPrice: 1599, image: categoryBag, sku: 'BG-001', stock: 6, description: 'Handcrafted macramé tote bag, earthy and eco-friendly. Perfect for daily use or beach trips. Made from natural cotton rope.', rating: 4.6, reviews: 19, featured: false, newArrival: true, tags: ['bag','macrame','tote'] },
  { id: 'p5', name: 'Knitted Cushion Cover', category: 'home', price: 999, originalPrice: 1299, image: categoryHome, sku: 'HM-001', stock: 20, description: 'Chunky knitted cushion cover in natural cream. Adds warmth and texture to any room. Fits standard 16x16 inch cushion inserts.', rating: 4.5, reviews: 41, featured: false, newArrival: false, tags: ['home','cushion','decor'] },
  { id: 'p6', name: 'Pom-Pom Winter Hat', category: 'winter', price: 749, originalPrice: 949, image: categoryHat, sku: 'WS-001', stock: 18, description: 'Cozy hand-knitted winter beanie with a fluffy pom-pom. One size fits most adults. Made from warm merino wool blend.', rating: 4.8, reviews: 63, featured: true, newArrival: false, tags: ['winter','hat','beanie'] },
  { id: 'p7', name: 'Baby Headband Set (3pcs)', category: 'baby', price: 449, originalPrice: 599, image: categoryBaby, sku: 'BB-002', stock: 25, description: 'Set of 3 adorable hand-knitted headbands for baby girls. Soft, stretchy, and comfortable. Perfect gift set.', rating: 4.7, reviews: 47, featured: false, newArrival: true, tags: ['baby','headband','set'] },
  { id: 'p8', name: 'Crochet Teddy Bear', category: 'toys', price: 999, originalPrice: 1299, image: categoryToy, sku: 'AT-002', stock: 5, description: 'Handcrafted crochet teddy bear, filled with hypoallergenic stuffing. Safe for babies 0+. Height approximately 25cm.', rating: 5.0, reviews: 87, featured: true, newArrival: true, tags: ['toy','teddy','crochet'] },
  { id: 'p9', name: 'Kids Beanie Hat', category: 'winter', price: 549, originalPrice: 699, image: categoryHat, sku: 'WS-002', stock: 22, description: 'Sweet knitted beanie for toddlers and kids aged 1-5 years. Extra soft merino blend, keeps little ones warm.', rating: 4.6, reviews: 31, featured: false, newArrival: false, tags: ['winter','kids','hat'] },
  { id: 'p10', name: 'Crochet Boho Bag', category: 'bags', price: 1099, originalPrice: 1399, image: categoryBag, sku: 'BG-002', stock: 9, description: 'Bohemian style crochet shoulder bag with wooden button closure. Spacious interior, perfect everyday companion.', rating: 4.4, reviews: 22, featured: false, newArrival: false, tags: ['bag','boho','crochet'] },
  { id: 'p11', name: 'Knitted Baby Blanket', category: 'baby', price: 1499, originalPrice: 1899, image: categoryBaby, sku: 'BB-003', stock: 7, description: 'Luxuriously soft hand-knitted baby blanket. 60x80 cm, perfect swaddle size. Made from premium organic cotton.', rating: 4.9, reviews: 56, featured: true, newArrival: false, tags: ['baby','blanket','knit'] },
  { id: 'p12', name: 'Crochet Wall Hanging', category: 'home', price: 1199, originalPrice: 1499, image: categoryHome, sku: 'HM-002', stock: 11, description: 'Beautiful bohemian crochet wall hanging with macramé details. Size: 40x60 cm. Adds a warm handmade touch to any wall.', rating: 4.7, reviews: 18, featured: false, newArrival: true, tags: ['home','wall','decor'] }
]

export const INITIAL_USERS = [
  { id: 'u1', name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210', role: 'customer', createdAt: '2024-11-10', orders: ['o1','o2'], address: '12 Park Street, Mumbai' },
  { id: 'u2', name: 'Anita Verma', email: 'anita@example.com', phone: '9123456780', role: 'customer', createdAt: '2024-12-05', orders: ['o3'], address: '45 Lake View, Pune' },
  { id: 'u3', name: 'Rekha Joshi', email: 'rekha@example.com', phone: '9000112233', role: 'customer', createdAt: '2025-01-20', orders: [], address: '8 Rose Garden, Delhi' }
]

export const INITIAL_ORDERS = [
  { id: 'o1', userId: 'u1', customerName: 'Priya Sharma', customerEmail: 'priya@example.com', items: [{ productId: 'p1', name: 'Knitted Baby Booties Set', qty: 2, price: 699, image: categoryBaby }, { productId: 'p8', name: 'Crochet Teddy Bear', qty: 1, price: 999, image: categoryToy }], subtotal: 2397, discount: 0, shipping: 0, total: 2397, status: 'delivered', paymentMethod: 'UPI', address: '12 Park Street, Mumbai', createdAt: '2024-12-10', tracking: 'EM123456789IN' },
  { id: 'o2', userId: 'u1', customerName: 'Priya Sharma', customerEmail: 'priya@example.com', items: [{ productId: 'p3', name: 'Crochet Baby Cardigan', qty: 1, price: 1199, image: categoryKidswear }], subtotal: 1199, discount: 120, shipping: 0, total: 1079, status: 'shipped', paymentMethod: 'Credit Card', address: '12 Park Street, Mumbai', createdAt: '2025-01-15', tracking: 'EM987654321IN' },
  { id: 'o3', userId: 'u2', customerName: 'Anita Verma', customerEmail: 'anita@example.com', items: [{ productId: 'p6', name: 'Pom-Pom Winter Hat', qty: 2, price: 749, image: categoryHat }], subtotal: 1498, discount: 0, shipping: 99, total: 1597, status: 'processing', paymentMethod: 'COD', address: '45 Lake View, Pune', createdAt: '2025-01-28', tracking: '' },
  { id: 'o4', userId: 'u2', customerName: 'Anita Verma', customerEmail: 'anita@example.com', items: [{ productId: 'p11', name: 'Knitted Baby Blanket', qty: 1, price: 1499, image: categoryBaby }], subtotal: 1499, discount: 0, shipping: 0, total: 1499, status: 'pending', paymentMethod: 'Net Banking', address: '45 Lake View, Pune', createdAt: '2025-02-01', tracking: '' }
]

export const INITIAL_COUPONS = [
  { id: 'c1', code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 500, maxUses: 100, usedCount: 23, expiryDate: '2025-12-31', active: true, description: '10% off for new customers' },
  { id: 'c2', code: 'FLAT100', type: 'fixed', value: 100, minOrder: 800, maxUses: 50, usedCount: 18, expiryDate: '2025-06-30', active: true, description: 'Flat ₹100 off on orders above ₹800' },
  { id: 'c3', code: 'MOMDAY20', type: 'percentage', value: 20, minOrder: 1000, maxUses: 200, usedCount: 67, expiryDate: '2025-05-15', active: false, description: "Mother's Day special 20% off" }
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
