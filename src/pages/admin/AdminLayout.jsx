import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Warehouse, Truck,
  Bell, LogOut, ExternalLink
} from 'lucide-react'
import { useStore } from '../../context/StoreContext'

const nav = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingCart, badge: true },
  { label: 'Customers', to: '/admin/users', icon: Users },
  { label: 'Coupons', to: '/admin/coupons', icon: Tag },
  { label: 'Inventory', to: '/admin/inventory', icon: Warehouse },
  { label: 'Delivery', to: '/admin/delivery', icon: Truck }
]

export default function AdminLayout({ children }) {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const pendingOrders = state.orders.filter(o => o.status === 'pending').length

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT_ADMIN' })
    navigate('/')
  }

  return (
    <div className="admin-wrap">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="adm-brand">
          <div className="adm-brand-name">Expert Mommy</div>
          <div className="adm-brand-sub">Admin Panel</div>
          <div className="adm-badge">● Admin</div>
        </div>

        <nav className="adm-nav">
          <div className="adm-section-lbl">Main Menu</div>
          {nav.map(({ label, to, icon: Icon, badge, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) => `adm-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} className="adm-link-icon" />
              {label}
              {badge && pendingOrders > 0 && (
                <span className="adm-link-nbadge">{pendingOrders}</span>
              )}
            </NavLink>
          ))}

          <div className="adm-section-lbl" style={{ marginTop: 16 }}>Store</div>
          <a href="/" target="_blank" className="adm-link">
            <ExternalLink size={16} /> View Store
          </a>
        </nav>

        <div className="adm-footer">
          <div className="adm-user">
            <div className="adm-avatar">A</div>
            <div>
              <div className="adm-user-name">Admin</div>
              <div className="adm-user-role">admin@expertmommy.com</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 13, color: '#6A6A88', cursor: 'pointer', background: 'none', border: 'none', padding: '6px 0' }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-page-title-wrap">
            <div className="admin-ptitle">Admin Dashboard</div>
            <div className="admin-pbread">Expert Mommy / Admin</div>
          </div>
          <div className="adm-topbar-right">
            <button className="hdr-btn adm-notif-btn">
              <Bell size={18} />
              {pendingOrders > 0 && <span className="adm-notif-dot" />}
            </button>
            <div className="adm-avatar" style={{ cursor: 'default' }}>A</div>
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  )
}
