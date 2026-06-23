import { useState } from 'react'
import { Search, Eye, X, Truck } from 'lucide-react'
import { useStore } from '../../context/StoreContext'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_COLORS = {
  pending: 'badge-orange',
  processing: 'badge-blue',
  shipped: 'badge-purple',
  delivered: 'badge-green',
  cancelled: 'badge-red'
}

export default function AdminOrders() {
  const { state, dispatch, toast } = useStore()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const filtered = state.orders.filter(o => {
    const matchSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search) || o.customerEmail?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    return matchSearch && matchStatus
  })

  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const updateStatus = (orderId, status) => {
    const order = state.orders.find(o => o.id === orderId)
    dispatch({ type: 'UPDATE_ORDER', payload: { ...order, status } })
    if (selectedOrder?.id === orderId) setSelectedOrder(o => ({ ...o, status }))
    toast(`Order status updated to ${status}`)
  }

  const updateTracking = (orderId, tracking) => {
    const order = state.orders.find(o => o.id === orderId)
    dispatch({ type: 'UPDATE_ORDER', payload: { ...order, tracking } })
    if (selectedOrder?.id === orderId) setSelectedOrder(o => ({ ...o, tracking }))
  }

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Orders</h1>
        <p style={{ fontSize: 13, color: 'var(--text-medium)' }}>Manage and track customer orders</p>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {['all', ...STATUSES].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilterStatus(s)}
            style={{ textTransform: 'capitalize' }}
          >
            {s === 'all' ? 'All Orders' : s}
            <span style={{ marginLeft: 4, background: 'rgba(255,255,255,0.25)', padding: '1px 6px', borderRadius: 50, fontSize: 10 }}>
              {s === 'all' ? state.orders.length : state.orders.filter(o => o.status === s).length}
            </span>
          </button>
        ))}
      </div>

      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={14} className="adm-search-icon" />
          <input className="adm-search" placeholder="Search by name, email or order ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="adm-toolbar-right">
          <span style={{ fontSize: 13, color: 'var(--text-medium)' }}>{sorted.length} orders</span>
        </div>
      </div>

      <div className="adm-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(order => (
              <tr key={order.id}>
                <td style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>#{order.id}</td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{order.customerName}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-light)' }}>{order.customerEmail}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: -6 }}>
                    {order.items.slice(0, 2).map((item, i) => (
                      <img key={i} src={item.image} alt={item.name} style={{ width: 30, height: 30, borderRadius: 4, objectFit: 'cover', border: '2px solid white', marginLeft: i > 0 ? -8 : 0 }} />
                    ))}
                    {order.items.length > 2 && <span style={{ fontSize: 11, color: 'var(--text-light)', marginLeft: 4, alignSelf: 'center' }}>+{order.items.length - 2}</span>}
                  </div>
                </td>
                <td style={{ fontWeight: 700 }}>₹{order.total.toLocaleString()}</td>
                <td style={{ fontSize: 12.5 }}>{order.paymentMethod}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 12, cursor: 'pointer', background: 'var(--white)', outline: 'none' }}
                  >
                    {STATUSES.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                  </select>
                </td>
                <td style={{ color: 'var(--text-light)', fontSize: 12.5 }}>{order.createdAt}</td>
                <td>
                  <button className="tbl-act view" onClick={() => setSelectedOrder(order)} title="View Details"><Eye size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">No orders found</div></div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-hdr">
              <div className="modal-ttl">Order #{selectedOrder.id}</div>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}><X size={16} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius)', padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-light)', marginBottom: 8 }}>Customer</div>
                <div style={{ fontWeight: 600 }}>{selectedOrder.customerName}</div>
                <div style={{ fontSize: 13, color: 'var(--text-medium)' }}>{selectedOrder.customerEmail}</div>
                <div style={{ fontSize: 13, color: 'var(--text-medium)', marginTop: 4 }}>{selectedOrder.address}</div>
              </div>
              <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius)', padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-light)', marginBottom: 8 }}>Order Details</div>
                <div style={{ fontSize: 13 }}>Date: <strong>{selectedOrder.createdAt}</strong></div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Payment: <strong>{selectedOrder.paymentMethod}</strong></div>
                <div style={{ fontSize: 13, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  Status: <span className={`badge ${STATUS_COLORS[selectedOrder.status]}`}>{selectedOrder.status}</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Items Ordered</div>
              {selectedOrder.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <img src={item.image} alt={item.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, background: 'var(--cream)' }} />
                  <div style={{ flex: 1, fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: 'var(--text-light)' }}>Qty: {item.qty}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{(item.price * item.qty).toLocaleString()}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15, marginTop: 10, paddingTop: 10, borderTop: '2px solid var(--border)' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>₹{selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Tracking */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Truck size={16} color="var(--primary)" />
              <input
                className="finput"
                style={{ flex: 1 }}
                placeholder="Enter tracking number..."
                defaultValue={selectedOrder.tracking}
                onChange={e => updateTracking(selectedOrder.id, e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <select
                value={selectedOrder.status}
                onChange={e => updateStatus(selectedOrder.id, e.target.value)}
                style={{ padding: '9px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 14, outline: 'none', cursor: 'pointer', background: 'var(--white)' }}
              >
                {STATUSES.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              <button className="btn btn-primary" onClick={() => setSelectedOrder(null)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
