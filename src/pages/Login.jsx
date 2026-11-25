import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { imageSlots } from '../data/siteImages'
import Seo from '../components/Seo'

export default function Login() {
  const { state, loginAdmin } = useStore()
  const navigate = useNavigate()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async event => {
    event.preventDefault()
    if (pending) return
    const fields = new FormData(event.currentTarget)
    setPending(true)
    setError('')
    try {
      await loginAdmin({ email: fields.get('email'), password: fields.get('password') })
      navigate('/admin', { replace: true })
    } catch (failure) {
      setError(failure.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="login-page">
      <Seo title="Admin sign-in" noindex />
      <div className="login-card">
        <div className="login-logo-wrap">
          <img src={state.siteImages.logo || imageSlots.logo.src} alt="Expert Mommy" style={{ height: 72, width: 'auto', margin: '0 auto' }} />
        </div>
        <h1>Admin sign-in</h1>
        <form onSubmit={handleLogin}>
          <label className="frow">Email
            <input className="finput" name="email" type="email" required autoComplete="username" maxLength={254} />
          </label>
          <label className="frow">Password
            <input className="finput" name="password" type="password" required autoComplete="current-password" maxLength={512} />
          </label>
          {error && <p role="alert">{error}</p>}
          <button className="btn btn-primary login-submit" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </div>
    </main>
  )
}
