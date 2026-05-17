import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, CreditCard, Camera, Brain, MessageSquare,
  Target, User, Settings, ChevronLeft, ChevronRight,
  Sparkles, TrendingUp,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/expenses',  icon: CreditCard,      label: 'Expenses'    },
  { to: '/scanner',   icon: Camera,          label: 'OCR Scanner' },
  { to: '/insights',  icon: Brain,           label: 'AI Insights' },
  { to: '/predict',   icon: TrendingUp,      label: 'Predictions' },
  { to: '/sms',       icon: MessageSquare,   label: 'SMS Parser'  },
  { to: '/budget',    icon: Target,          label: 'Budget'      },
  { to: '/profile',   icon: User,            label: 'Profile'     },
  { to: '/settings',  icon: Settings,        label: 'Settings'    },
]

export const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`mobile-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={onMobileClose}
      />

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div style={{
          height: 64, display: 'flex', alignItems: 'center',
          padding: collapsed ? '0 16px' : '0 20px',
          borderBottom: '1px solid var(--border)',
          gap: 10, overflow: 'hidden',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
          }}>
            <Sparkles size={18} color="white" />
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                PennyPilot
              </div>
              <div style={{ fontSize: 10, color: 'var(--color-primary)', fontWeight: 600, marginTop: 2 }}>
                AI Finance
              </div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              style={{ marginBottom: 2 }}
              onClick={onMobileClose}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle (desktop only) */}
        <div style={{
          padding: '12px 10px',
          borderTop: '1px solid var(--border)',
        }}>
          <button
            onClick={onToggle}
            className="nav-item"
            style={{ width: '100%', background: 'none', border: 'none', justifyContent: collapsed ? 'center' : 'flex-end' }}
          >
            {collapsed
              ? <ChevronRight size={16} />
              : <><span style={{ fontSize: 12 }}>Collapse</span><ChevronLeft size={16} /></>
            }
          </button>
        </div>
      </aside>
    </>
  )
}
