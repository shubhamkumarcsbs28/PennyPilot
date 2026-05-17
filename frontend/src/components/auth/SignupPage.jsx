import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Sparkles, ArrowRight, Loader, User, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export const SignupPage = () => {
  const { register }  = useAuth()
  const navigate      = useNavigate()
  const [form, setForm]       = useState({ name: '', email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created! Welcome to PennyPilot 🎉')
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg">
      <div style={{
        position: 'absolute', top: '10%', left: '15%',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="auth-card animate-fadeInUp">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16, margin: '0 auto 12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99,102,241,0.5)',
          }}>
            <Sparkles size={22} color="white" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 4 }}>PennyPilot</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>AI-powered expense tracking</p>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 4 }}>Create account</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
          Join thousands managing finances smarter
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group" style={{ marginBottom: 14 }}>
            <label className="input-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Full Name</label>
            <input
              className="input"
              type="text"
              placeholder="Aarav Sharma"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: 14 }}>
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
                placeholder="Min 6 characters"
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
            style={{ width: '100%', marginBottom: 20 }}
            disabled={loading}
          >
            {loading
              ? <><Loader size={16} className="animate-spin" /> Creating Account…</>
              : <><span>Create Account</span> <ArrowRight size={16} /></>
            }
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#818cf8', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
