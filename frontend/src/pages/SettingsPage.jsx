import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { Sun, Moon, Bell, Globe, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const SettingRow = ({ icon: Icon, title, description, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', borderBottom: '1px solid var(--border-subtle)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
        <Icon size={18} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{description}</div>
      </div>
    </div>
    {children}
  </div>
)

const Toggle = ({ checked, onChange }) => (
  <div
    onClick={onChange}
    style={{
      width: 44, height: 24, borderRadius: 99, background: checked ? 'var(--color-primary)' : 'var(--bg-muted)',
      position: 'relative', cursor: 'pointer', transition: 'background 0.25s',
      flexShrink: 0,
    }}
  >
    <div style={{
      width: 18, height: 18, borderRadius: '50%', background: 'white',
      position: 'absolute', top: 3, left: checked ? 23 : 3,
      transition: 'left 0.25s', boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
    }} />
  </div>
)

export const SettingsPage = () => {
  const { isDark, toggle } = useTheme()
  const { user }           = useAuth()

  return (
    <div className="page-content stagger">
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
      </div>

      <div style={{ maxWidth: 600 }}>
        <div className="card" style={{ padding: '0 24px', marginBottom: 20 }}>
          <SettingRow icon={isDark ? Moon : Sun} title="Dark Mode" description="Toggle between light and dark theme">
            <Toggle checked={isDark} onChange={toggle} />
          </SettingRow>
          <SettingRow icon={Bell} title="Budget Alerts" description="Get notified when budget limits are exceeded">
            <Toggle checked={true} onChange={() => toast.success('Alert preference saved')} />
          </SettingRow>
          <SettingRow icon={Globe} title="Currency" description="Set your preferred currency symbol">
            <select className="input" style={{ width: 100 }} defaultValue="INR">
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
            </select>
          </SettingRow>
          <SettingRow icon={Shield} title="Data Privacy" description="Your data is stored locally and never shared" >
            <span style={{ fontSize: 12, padding: '4px 10px', background: 'rgba(16,185,129,0.12)', color: 'var(--color-accent)', borderRadius: 99, fontWeight: 600 }}>Protected</span>
          </SettingRow>
        </div>

        <div className="card" style={{ padding: 20, background: 'rgba(99,102,241,0.04)', borderColor: 'rgba(99,102,241,0.2)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>PennyPilot AI</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            This app uses on-device AI and smart rules for categorization and insights.
            OCR scanning is powered by Tesseract.js and runs entirely in your browser — no data is sent to external servers.
          </p>
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>Version 1.0.0 · Built with ❤️ and React</div>
        </div>
      </div>
    </div>
  )
}
