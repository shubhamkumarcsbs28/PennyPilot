import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Sparkles, ArrowRight, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'

export const LoginPage = () => {
  const { login }     = useAuth()
  const navigate      = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  // Forgot password flow states
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail]         = useState('')
  const [forgotLoading, setForgotLoading]     = useState(false)
  const [resetStep2, setResetStep2]           = useState(false)
  const [resetCode, setResetCode]             = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [devCodeReceived, setDevCodeReceived] = useState(null)

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

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    setForgotLoading(true)
    try {
      const res = await api.post('/auth/forgot-password', { email: forgotEmail })
      toast.success('Reset code generated!')
      if (res.data?.devCode) {
        setDevCodeReceived(res.data.devCode)
        setResetCode(res.data.devCode) // prefill for easy testing
      }
      setResetStep2(true)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong.'
      toast.error(msg)
    } finally {
      setForgotLoading(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match')
    }
    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters')
    }
    setForgotLoading(true)
    try {
      await api.post('/auth/reset-password', {
        email: forgotEmail,
        code: resetCode,
        newPassword
      })
      toast.success('Password reset successful! 🎉')
      setShowForgotModal(false)
      // Reset state
      setForgotEmail('')
      setResetCode('')
      setNewPassword('')
      setConfirmPassword('')
      setDevCodeReceived(null)
      setResetStep2(false)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Reset failed.'
      toast.error(msg)
    } finally {
      setForgotLoading(false)
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="input-label" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 0 }}>Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#818cf8',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#a5b4fc'}
                onMouseLeave={e => e.target.style.color = '#818cf8'}
              >
                Forgot password?
              </button>
            </div>
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

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
          padding: 16,
        }}>
          <div className="auth-card" style={{
            maxWidth: 420, width: '100%', margin: 0,
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative'
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={20} color="#818cf8" />
              Reset Password
            </h2>
            
            {!resetStep2 ? (
              // Step 1: Request Code
              <form onSubmit={handleForgotSubmit}>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>
                  Enter your registered email address, and we'll send you a 6-digit verification code to reset your password.
                </p>
                <div className="input-group" style={{ marginBottom: 20 }}>
                  <label className="input-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Email Address</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="aarav@example.com"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForgotModal(false)
                      setForgotEmail('')
                    }}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? <Loader size={16} className="animate-spin" /> : 'Send Code'}
                  </button>
                </div>
              </form>
            ) : (
              // Step 2: Enter Code & New Password
              <form onSubmit={handleResetSubmit}>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>
                  We've generated a code for you. Enter the 6-digit code and your new password.
                </p>
                
                {devCodeReceived && (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    fontSize: 13,
                    color: '#34d399',
                    marginBottom: 16,
                    textAlign: 'center'
                  }}>
                    💡 Development Mode: Your reset code is <strong>{devCodeReceived}</strong> (auto-filled below)
                  </div>
                )}

                <div className="input-group" style={{ marginBottom: 14 }}>
                  <label className="input-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Verification Code</label>
                  <input
                    className="input"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={resetCode}
                    onChange={e => setResetCode(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', letterSpacing: 4, textAlign: 'center', fontWeight: 'bold' }}
                    required
                  />
                </div>

                <div className="input-group" style={{ marginBottom: 14 }}>
                  <label className="input-label" style={{ color: 'rgba(255,255,255,0.6)' }}>New Password</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                    required
                  />
                </div>

                <div className="input-group" style={{ marginBottom: 20 }}>
                  <label className="input-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Confirm Password</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setResetStep2(false)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? <Loader size={16} className="animate-spin" /> : 'Reset Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
