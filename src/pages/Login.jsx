import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Heart } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { logoImg } from '../assets/images'

const ADMIN_EMAIL = 'admin@expertmommy.com'
const ADMIN_PASS = 'admin123'

export default function Login({ adminMode = false }) {
  const { state, dispatch, toast } = useStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [remember, setRemember] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleLogin = (e) => {
    e.preventDefault()
    if (adminMode) {
      if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASS) {
        dispatch({ type: 'LOGIN_ADMIN' })
        toast('Welcome back, Admin!')
        navigate('/admin')
      } else {
        toast('Invalid admin credentials', 'error')
      }
      return
    }
    const user = state.users.find(u => u.email === form.email)
    if (!user) { toast('No account found with this email', 'error'); return }
    dispatch({ type: 'LOGIN_USER', payload: user })
    toast(`Welcome back, ${user.name}!`)
    navigate('/')
  }

  const handleRegister = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast('Please fill all required fields', 'error'); return }
    if (form.password !== form.confirmPassword) { toast('Passwords do not match', 'error'); return }
    if (form.password.length < 6) { toast('Password must be at least 6 characters', 'error'); return }
    const existing = state.users.find(u => u.email === form.email)
    if (existing) { toast('Email already registered', 'error'); return }
    dispatch({ type: 'REGISTER_USER', payload: { name: form.name, email: form.email, phone: form.phone, password: form.password } })
    toast(`Welcome to Expert Mommy, ${form.name}!`)
    navigate('/')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo-wrap">
          <img
            src={logoImg}
            alt="Expert Mommy"
            style={{ height: 72, width: 'auto', objectFit: 'contain', margin: '0 auto', display: 'block' }}
          />
        </div>

        {adminMode ? (
          <>
            <h2 className="login-h2">Admin Login</h2>
            <p className="login-sub">Access the admin dashboard</p>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="frow">
                <label className="flabel">Email</label>
                <input className="finput" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="admin@expertmommy.com" />
              </div>
              <div className="frow">
                <label className="flabel">Password</label>
                <div style={{ position: 'relative' }}>
                  <input className="finput" type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" style={{ paddingRight: 42 }} />
                  <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-light)', background: 'var(--cream)', padding: '8px 12px', borderRadius: 6 }}>
                Demo: admin@expertmommy.com / admin123
              </div>
              <button type="submit" className="btn btn-primary w-full btn-lg">Sign In to Admin</button>
            </form>
            <p className="login-footer-text">
              <a href="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>← Back to Store</a>
            </p>
          </>
        ) : (
          <>
            <h2 className="login-h2">{tab === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="login-sub">{tab === 'login' ? 'Sign in to your account' : 'Join the Expert Mommy family'}</p>

            <div className="auth-tabs">
              <div className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Login</div>
              <div className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Register</div>
            </div>

            {tab === 'login' ? (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="frow">
                  <label className="flabel">Email Address</label>
                  <input className="finput" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" />
                </div>
                <div className="frow">
                  <label className="flabel">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input className="finput" type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" style={{ paddingRight: 42 }} />
                    <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="remember-row">
                  <label className="check-label">
                    <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> Remember me
                  </label>
                  <span className="forgot-link">Forgot password?</span>
                </div>
                <button type="submit" className="btn btn-primary w-full btn-lg">Sign In</button>
              </form>
            ) : (
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="frow">
                  <label className="flabel">Full Name *</label>
                  <input className="finput" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Priya Sharma" />
                </div>
                <div className="frow">
                  <label className="flabel">Email Address *</label>
                  <input className="finput" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" />
                </div>
                <div className="frow">
                  <label className="flabel">Phone Number</label>
                  <input className="finput" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" />
                </div>
                <div className="frow">
                  <label className="flabel">Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input className="finput" type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 6 characters" style={{ paddingRight: 42 }} />
                    <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="frow">
                  <label className="flabel">Confirm Password *</label>
                  <input className="finput" type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Repeat password" />
                </div>
                <button type="submit" className="btn btn-primary w-full btn-lg">Create Account</button>
              </form>
            )}

            <p className="login-footer-text" style={{ marginTop: 16 }}>
              Admin?{' '}
              <a href="/admin-login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Admin Login →</a>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
