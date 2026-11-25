import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './context/StoreContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Policy, { POLICIES } from './pages/Policy'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import SiteImages from './pages/admin/SiteImages'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminUsers from './pages/admin/Users'
import AdminCoupons from './pages/admin/Coupons'
import AdminInventory from './pages/admin/Inventory'
import AdminDelivery from './pages/admin/Delivery'

function AdminGuard({ children }) {
  const { state } = useStore()
  if (state.checkingAdmin) return <main className="container empty-state" role="status">Checking admin session…</main>
  if (!state.isAdminLoggedIn) return <Navigate to="/admin-login" replace />
  return children
}

function StorePage() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:category" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        {Object.keys(POLICIES).map(slug => <Route key={slug} path={'/' + slug} element={<Policy slug={slug} />} />)}
        <Route path="/login" element={<Navigate to="/shop" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin-login" element={<Login />} />
      <Route
        path="/admin/*"
        element={
          <AdminGuard>
            <AdminLayout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="site-images" element={<SiteImages />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="delivery" element={<AdminDelivery />} />
              </Routes>
            </AdminLayout>
          </AdminGuard>
        }
      />
      <Route path="/*" element={<StorePage />} />
    </Routes>
  )
}
