import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg-primary)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'pulse 1.5s ease infinite',
          }}>
            <span style={{ fontSize: 24 }}>✦</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading PennyPilot…</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}
