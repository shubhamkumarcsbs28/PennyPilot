import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Sparkles, ArrowRight, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

export const LoginPage = () => {
  const { login }     = useAuth()
  const navigate      = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back! 👋')
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg">
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '15%', right: '10%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', left: '5%',
        width: 250, height: 250, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="auth-card animate-fadeInUp">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99,102,241,0.5)',
          }}>
            <Sparkles size={24} color="white" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 4 }}>
            PennyPilot
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
            Your AI-powered finance companion
          </p>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 4 }}>
          Welcome back
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 28 }}>
          Sign in to your account to continue
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group" style={{ marginBottom: 16 }}>
            <label className="input-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Email</label>
            <input
              className="input"
              type="email"
              placeholder="aarav@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: 24 }}>
            <label className="input-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', paddingRight: 42 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
                }}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: 16 }}
            disabled={loading}
          >
            {loading
              ? <><Loader size={16} className="animate-spin" /> Signing in…</>
              : <><span>Sign In</span> <ArrowRight size={16} /></>
            }
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
          Create an account or sign in with your registered email and password.
        </p>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#818cf8', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
