import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useExpenses } from '../context/ExpenseContext'
import { formatCurrency } from '../utils/formatters'
import { Button } from '../components/ui/Button'
import { User, Mail, Calendar, Edit2, Check } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const { stats, expenses }  = useExpenses()
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState({
    name: user?.name || '',
    email: user?.email || '',
    balance: user?.balance || 45000
  })

  const handleSave = () => {
    updateUser({
      name: form.name,
      balance: Number(form.balance)
    })
    setEditing(false)
    toast.success('Profile updated!')
  }

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0)
  const topCat = (() => {
    const totals = {}
    expenses.forEach(e => { totals[e.category] = (totals[e.category] || 0) + e.amount })
    return Object.entries(totals).sort((a,b) => b[1]-a[1])[0]?.[0] || 'food'
  })()

  return (
    <div className="page-content stagger">
      <div className="page-header">
        <h2 className="page-title">Profile</h2>
      </div>

      <div style={{ maxWidth: 640 }}>
        {/* Avatar + Info Card */}
        <div className="card" style={{ padding: 32, marginBottom: 20, background: 'linear-gradient(135deg,rgba(99,102,241,0.05),rgba(16,185,129,0.05))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 800, color: 'white',
              boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
            }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{user?.name}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{user?.email}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                  <Calendar size={12} /> Member since {user?.joinedAt ? format(new Date(user.joinedAt), 'MMM yyyy') : 'Jan 2026'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 600, background: 'rgba(16,185,129,0.08)', padding: '2px 8px', borderRadius: 6 }}>
                  Income Budget: {formatCurrency(user?.balance || 45000)}
                </div>
              </div>
            </div>
          </div>

          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label">Email (Immutable)</label>
                <input className="input" type="email" value={form.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              </div>
              <div className="input-group">
                <label className="input-label">Starting Monthly Balance / Income (₹)</label>
                <input
                  className="input"
                  type="number"
                  placeholder="e.g. 50000"
                  value={form.balance}
                  onChange={e => setForm(p => ({ ...p, balance: e.target.value }))}
                />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="primary" onClick={handleSave}><Check size={14} /> Save Changes</Button>
                <Button variant="secondary" onClick={() => {
                  setEditing(false);
                  setForm({ name: user?.name || '', email: user?.email || '', balance: user?.balance || 45000 });
                }}>Cancel</Button>
              </div>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
              <Edit2 size={14} /> Edit Profile
            </Button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {[
            { label: 'Total Spent',    value: formatCurrency(totalSpent),    icon: '💸' },
            { label: 'Transactions',   value: expenses.length,               icon: '🧾' },
            { label: 'This Month',     value: formatCurrency(stats.totalSpent), icon: '📅' },
          ].map(item => (
            <div key={item.label} className="card" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{item.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
