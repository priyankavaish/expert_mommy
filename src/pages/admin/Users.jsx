import { useState } from 'react'
import { Search, Eye, Trash2, X, Mail, Phone, MapPin } from 'lucide-react'
import { useStore } from '../../context/StoreContext'

export default function AdminUsers() {
  const { state, dispatch, toast } = useStore()
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const filtered = state.users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  )

  const userOrders = (userId) => state.orders.filter(o => o.userId === userId)
  const userRevenue = (userId) => userOrders(userId).reduce((s, o) => s + o.total, 0)

  const handleDelete = () => {
    dispatch({ type: 'DELETE_USER', payload: deleteId })
    toast('User removed', 'error')
    setDeleteId(null)
    if (selectedUser?.id === deleteId) setSelectedUser(null)
  }

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Customers</h1>
        <p style={{ fontSize: 13, color: 'var(--text-medium)' }}>Manage registered customers</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 22 }}>
        {[
          { label: 'Total Customers', value: state.users.filter(u => u.role === 'customer').length },
          { label: 'Active (with orders)', value: state.users.filter(u => u.orders?.length > 0).length },
          { label: 'New This Month', value: state.users.filter(u => u.createdAt?.startsWith('2025')).length }
        ].map(({ label, value }) => (
          <div key={label} className="adm-card" style={{ padding: '18px 22px' }}>
            <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{value}</div>
          </div>
        ))}
      </div>

      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={14} className="adm-search-icon" />
          <input className="adm-search" placeholder="Search by name, email or phone..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="adm-toolbar-right">
          <span style={{ fontSize: 13, color: 'var(--text-medium)' }}>{filtered.length} customers</span>
        </div>
      </div>

      <div className="adm-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => {
              const orders = userOrders(user.id)
              const revenue = userRevenue(user.id)
              return (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--primary) 0%, #A84E66 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{user.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-light)' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{user.phone || '—'}</td>
                  <td style={{ fontSize: 12.5, color: 'var(--text-light)' }}>{user.createdAt}</td>
                  <td>
                    <span className={`badge ${orders.length > 0 ? 'badge-green' : 'badge-orange'}`}>
                      {orders.length} order{orders.length !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{revenue.toLocaleString()}</td>
                  <td>
                    <div className="tbl-actions">
                      <button className="tbl-act view" onClick={() => setSelectedUser(user)} title="View"><Eye size={13} /></button>
                      <button className="tbl-act del" onClick={() => setDeleteId(user.id)} title="Delete"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state"><div className="empty-icon">👥</div><div className="empty-title">No customers found</div></div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="modal-hdr">
              <div className="modal-ttl">Customer Profile</div>
              <button className="modal-close" onClick={() => setSelectedUser(null)}><X size={16} /></button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, var(--primary) 0%, #A84E66 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 24, fontWeight: 700, margin: '0 auto 10px' }}>
                {selectedUser.name.charAt(0)}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>{selectedUser.name}</div>
              <span className="badge badge-green">{selectedUser.role}</span>
            </div>

            <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
                  <Mail size={14} color="var(--primary)" /> {selectedUser.email}
                </div>
                {selectedUser.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
                    <Phone size={14} color="var(--primary)" /> {selectedUser.phone}
                  </div>
                )}
                {selectedUser.address && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
                    <MapPin size={14} color="var(--primary)" /> {selectedUser.address}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Order History</div>
              {userOrders(selectedUser.id).length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-medium)' }}>No orders yet</p>
              ) : (
                userOrders(selectedUser.id).map(o => (
                  <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>#{o.id}</span>
                    <span style={{ color: 'var(--text-medium)' }}>{o.createdAt}</span>
                    <span className={`badge ${o.status === 'delivered' ? 'badge-green' : 'badge-orange'}`}>{o.status}</span>
                    <span style={{ fontWeight: 700 }}>₹{o.total.toLocaleString()}</span>
                  </div>
                ))
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, paddingTop: 10, fontSize: 14 }}>
                <span>Total Spent</span>
                <span style={{ color: 'var(--primary)' }}>₹{userRevenue(selectedUser.id).toLocaleString()}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setSelectedUser(null)}>Close</button>
              <button className="btn btn-primary" style={{ background: '#E53935', borderColor: '#E53935' }} onClick={() => { setDeleteId(selectedUser.id); setSelectedUser(null) }}>
                <Trash2 size={14} /> Remove Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div className="modal-hdr"><div className="modal-ttl">Remove Customer?</div></div>
            <p style={{ fontSize: 14, color: 'var(--text-medium)' }}>This will permanently remove the customer and their data.</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: '#E53935', borderColor: '#E53935' }} onClick={handleDelete}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
