import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Sun, Moon, Bell, Search, LogOut } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

const PAGE_TITLES = {
  '/':          { title: 'Dashboard',   subtitle: 'Your financial overview' },
  '/expenses':  { title: 'Expenses',    subtitle: 'Manage your transactions' },
  '/scanner':   { title: 'OCR Scanner', subtitle: 'Scan receipts & bills' },
  '/insights':  { title: 'AI Insights', subtitle: 'Smart spending analysis' },
  '/predict':   { title: 'Predictions', subtitle: 'Future expense forecast' },
  '/sms':       { title: 'SMS Parser',  subtitle: 'Import from bank SMS' },
  '/budget':    { title: 'Budget',      subtitle: 'Set & track spending limits' },
  '/profile':   { title: 'Profile',     subtitle: 'Your account details' },
  '/settings':  { title: 'Settings',    subtitle: 'App preferences' },
}

export const TopBar = ({ onMenuClick }) => {
  const { isDark, toggle } = useTheme()
  const { user, logout }   = useAuth()
  const location            = useLocation()
  const pageInfo            = PAGE_TITLES[location.pathname] || PAGE_TITLES['/']
  const [showUser, setShowUser] = useState(false)

  return (
    <header className="topbar">
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={onMenuClick}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', padding: 6, borderRadius: 8,
            display: 'flex', alignItems: 'center',
          }}
          className="md:hidden"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
            {pageInfo.title}
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Theme toggle */}
        <button
          onClick={toggle}
          style={{
            width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)',
            background: 'var(--bg-elevated)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)', transition: 'all 0.2s',
          }}
          title={isDark ? 'Switch to Light' : 'Switch to Dark'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button style={{
            width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)',
            background: 'var(--bg-elevated)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)',
          }}>
            <Bell size={16} />
          </button>
          <span className="notif-dot" />
        </div>

        {/* User avatar */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUser(!showUser)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 4px',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 99, cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'white',
            }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              {user?.name?.split(' ')[0] || 'User'}
            </span>
          </button>

          {showUser && (
            <div style={{
              position: 'absolute', top: 44, right: 0, minWidth: 160,
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 12, boxShadow: 'var(--shadow-lg)', padding: 8, zIndex: 99,
            }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</div>
              </div>
              <button
                onClick={() => { setShowUser(false); logout() }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  padding: '8px 12px', background: 'none', border: 'none',
                  cursor: 'pointer', borderRadius: 8, color: 'var(--color-danger)',
                  fontSize: 13, fontWeight: 500,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
