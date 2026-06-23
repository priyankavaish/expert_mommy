import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Users, Tag, TrendingUp, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react'
import { useStore } from '../../context/StoreContext'

const STATUS_COLORS = {
  pending: 'badge-orange',
  processing: 'badge-blue',
  shipped: 'badge-purple',
  delivered: 'badge-green',
  cancelled: 'badge-red'
}

export default function Dashboard() {
  const { state } = useStore()
  const navigate = useNavigate()

  const totalRevenue = state.orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const totalOrders = state.orders.length
  const totalProducts = state.products.length
  const totalCustomers = state.users.filter(u => u.role === 'customer').length
  const lowStockProducts = state.products.filter(p => p.stock <= 5)
  const recentOrders = [...state.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6)

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, change: '+12%', up: true, icon: TrendingUp, cls: 'ico-green' },
    { label: 'Total Orders', value: totalOrders, change: '+8%', up: true, icon: ShoppingBag, cls: 'ico-pink' },
    { label: 'Products', value: totalProducts, change: '+2', up: true, icon: Package, cls: 'ico-blue' },
    { label: 'Customers', value: totalCustomers, change: '+5%', up: true, icon: Users, cls: 'ico-orange' }
  ]

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: 'var(--text-medium)' }}>Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map(({ label, value, change, up, icon: Icon, cls }) => (
          <div key={label} className="stat-card">
            <div>
              <div className="stat-lbl">{label}</div>
              <div className="stat-val">{value}</div>
              <div className={`stat-change ${up ? 'up' : 'down'}`}>
                {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {change} this month
              </div>
            </div>
            <div className={`stat-ico ${cls}`}><Icon size={22} /></div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 22 }}>
        {/* Recent Orders */}
        <div className="adm-card">
          <div className="adm-card-hdr">
            <div className="adm-card-title">Recent Orders</div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/orders')}>View All</button>
          </div>
          <table className="adm-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>#{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                  <td style={{ fontWeight: 600 }}>₹{order.total.toLocaleString()}</td>
                  <td><span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span></td>
                  <td style={{ color: 'var(--text-light)' }}>{order.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock + Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="adm-card">
            <div className="adm-card-hdr">
              <div className="adm-card-title">⚠️ Low Stock</div>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/inventory')}>Manage</button>
            </div>
            {lowStockProducts.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', fontSize: 13, color: 'var(--text-light)' }}>All products well stocked ✓</div>
            ) : (
              <div>
                {lowStockProducts.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderBottom: '1px solid var(--border-light)' }}>
                    <img src={p.image} alt={p.name} className="tbl-prod-img" />
                    <div style={{ flex: 1, fontSize: 13 }}>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{p.name}</div>
                      <span className="badge badge-red">{p.stock} left</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="adm-card" style={{ padding: 0, overflow: 'visible' }}>
            <div className="adm-card-hdr"><div className="adm-card-title">Quick Actions</div></div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Add New Product', '/admin/products'],
                ['View All Orders', '/admin/orders'],
                ['Manage Coupons', '/admin/coupons'],
                ['Delivery Settings', '/admin/delivery']
              ].map(([label, path]) => (
                <button key={label} className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start' }} onClick={() => navigate(path)}>
                  → {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
