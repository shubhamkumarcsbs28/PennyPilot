import { useState } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { getCategoryById, CATEGORIES } from '../utils/mockData'
import { formatCurrency } from '../utils/formatters'
import { Button } from '../components/ui/Button'
import { AlertTriangle, CheckCircle, Edit2 } from 'lucide-react'
import { format } from 'date-fns'

export const BudgetPage = () => {
  const { getBudgetStatus, updateBudget, budgets } = useExpenses()
  const budgetStatus = getBudgetStatus()
  const [editing, setEditing] = useState(null)
  const [editVal, setEditVal] = useState('')

  const handleSave = (cat) => {
    const val = parseFloat(editVal)
    if (!isNaN(val) && val > 0) updateBudget(cat, val)
    setEditing(null)
  }

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0)
  const totalSpent  = budgetStatus.reduce((s, b) => s + b.spent, 0)
  const exceeded    = budgetStatus.filter(b => b.exceeded)

  return (
    <div className="page-content stagger">
      <div className="page-header">
        <div>
          <h2 className="page-title">Budget Manager</h2>
          <p className="page-subtitle">Set monthly limits and track spending by category</p>
        </div>
      </div>

      {/* Alerts */}
      {exceeded.length > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
          <AlertTriangle size={20} color="var(--color-danger)" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-danger)' }}>Budget Exceeded!</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {exceeded.map(b => getCategoryById(b.category).label).join(', ')} exceeded this month.
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Total Budget</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-primary)' }}>{formatCurrency(totalBudget)}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Total Spent</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: totalSpent > totalBudget ? 'var(--color-danger)' : 'var(--text-primary)' }}>
            {formatCurrency(totalSpent)}
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Remaining</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-accent)' }}>
            {formatCurrency(Math.max(0, totalBudget - totalSpent))}
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Period</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            {format(new Date(), 'MMMM yyyy')}
          </div>
        </div>
      </div>

      {/* Budget Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {budgetStatus.map(b => {
          const cat = getCategoryById(b.category)
          const isEditing = editing === b.category
          return (
            <div key={b.category} className="budget-card" style={{ borderLeft: `3px solid ${b.exceeded ? 'var(--color-danger)' : b.pct > 75 ? 'var(--color-warning)' : 'var(--color-accent)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${cat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {cat.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{cat.label}</div>
                    {b.exceeded
                      ? <div style={{ fontSize: 11, color: 'var(--color-danger)', fontWeight: 600 }}>⚠ Budget exceeded</div>
                      : <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{Math.round(b.pct)}% used</div>
                    }
                  </div>
                </div>
                <button
                  onClick={() => { setEditing(b.category); setEditVal(String(b.limit)) }}
                  style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--bg-elevated)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
                >
                  <Edit2 size={13} />
                </button>
              </div>

              {isEditing ? (
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <input
                    className="input"
                    type="number"
                    value={editVal}
                    onChange={e => setEditVal(e.target.value)}
                    autoFocus
                    style={{ flex: 1 }}
                  />
                  <Button variant="primary" size="sm" onClick={() => handleSave(b.category)}>Save</Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>✕</Button>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Spent: <strong style={{ color: b.exceeded ? 'var(--color-danger)' : 'var(--text-primary)' }}>{formatCurrency(b.spent)}</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>Limit: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(b.limit)}</strong></span>
                </div>
              )}

              <div className="progress-bar">
                <div className="progress-fill" style={{
                  width: `${b.pct}%`,
                  background: b.exceeded ? 'var(--color-danger)' : b.pct > 75 ? 'var(--color-warning)' : 'linear-gradient(90deg,var(--color-primary),var(--color-accent))',
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
