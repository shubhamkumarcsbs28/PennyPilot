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
    <div className="split-auth-container">
      {/* LEFT PROMO SIDE PANEL (Hidden on mobile/tablet) */}
      <div className="auth-promo-panel">
        <div className="auth-glow-blob-1" />
        <div className="auth-glow-blob-2" />

        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, zIndex: 2 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'white', letterSpacing: 0.5 }}>PennyPilot</span>
        </div>

        {/* Dynamic Mockup Card (Floating animation) */}
        <div style={{ zIndex: 2, margin: 'auto 0' }}>
          <div className="interactive-mock-card">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Active Balance</p>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginTop: 2 }}>₹45,000.00</h3>
              </div>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Sparkles size={18} color="#34d399" />
              </div>
            </div>

            {/* Budget status */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
                <span>Monthly Budget</span>
                <span style={{ color: 'white', fontWeight: 600 }}>64% Used</span>
              </div>
              <div className="progress-bar" style={{ height: 6 }}>
                <div className="progress-fill" style={{ width: '64%' }}></div>
              </div>
            </div>

            {/* Micro transaction list */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>Recent Activity</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                    ☕
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>Starbucks Coffee</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Today, 2:30 PM</p>
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#f87171' }}>-₹350.00</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                    💰
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>Freelance Design</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Yesterday</p>
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#34d399' }}>+₹12,500.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Ticker */}
        <div style={{ zIndex: 2 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 6 }}>
            Navigate your finance journey with AI.
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
            Experience instant receipt scanning, custom budget insights, and automatic prediction curves built to save you capital.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE FORM PANEL */}
      <div className="auth-form-panel">
        <div className="premium-auth-card">
          
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 8, letterSpacing: -0.5 }}>
              Create account
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
              Join thousands managing finances smarter
            </p>
          </div>

          {/* Social Logins */}
          <div className="social-login-grid">
            <button type="button" className="btn-social" onClick={() => toast.success('Google Signup simulated')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>
            <button type="button" className="btn-social" onClick={() => toast.success('GitHub Signup simulated')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <div className="auth-separator">or sign up with email</div>

          {/* Standard Form */}
          <form onSubmit={handleSubmit}>
            <div className="input-group" style={{ marginBottom: 18 }}>
              <label className="input-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Full Name</label>
              <div className="premium-input-container">
                <User className="input-icon" size={18} />
                <input
                  className="input"
                  type="text"
                  placeholder="Aarav Sharma"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: 18 }}>
              <label className="input-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Email Address</label>
              <div className="premium-input-container">
                <Mail className="input-icon" size={18} />
                <input
                  className="input"
                  type="email"
                  placeholder="aarav@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: 24 }}>
              <label className="input-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Password</label>
              <div className="premium-input-container">
                <Lock className="input-icon" size={18} />
                <input
                  className="input"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  style={{ paddingRight: 42 }}
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
              style={{ width: '100%', marginBottom: 24, borderRadius: 10, padding: '12px 20px', fontSize: 15 }}
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
            <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
