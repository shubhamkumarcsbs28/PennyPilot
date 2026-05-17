import { useExpenses } from '../context/ExpenseContext'
import { formatCurrency } from '../utils/formatters'
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Info, Target } from 'lucide-react'

const TYPE_CONFIG = {
  warning:  { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)',  label: 'Warning',     labelColor: '#f59e0b', Icon: AlertTriangle },
  tip:      { bg: 'rgba(99,102,241,0.08)',   border: 'rgba(99,102,241,0.2)',  label: 'Tip',         labelColor: '#6366f1', Icon: Lightbulb },
  info:     { bg: 'rgba(59,130,246,0.08)',   border: 'rgba(59,130,246,0.2)',  label: 'Insight',     labelColor: '#3b82f6', Icon: Info },
  positive: { bg: 'rgba(16,185,129,0.08)',   border: 'rgba(16,185,129,0.2)',  label: 'Opportunity', labelColor: '#10b981', Icon: Target },
}

export const InsightsPage = () => {
  const { insights, stats, categoryData } = useExpenses()

  return (
    <div className="page-content stagger">
      <div className="page-header">
        <div>
          <h2 className="page-title">AI Insights</h2>
          <p className="page-subtitle">Smart analysis powered by your spending data</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(99,102,241,0.1)', borderRadius: 99, fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>
          ✨ AI Powered
        </div>
      </div>

      {/* Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Monthly Spend',    value: formatCurrency(stats.totalSpent),       icon: '💸', color: 'var(--color-danger)'   },
          { label: 'vs Last Month',    value: `${stats.changePercent > 0 ? '+' : ''}${stats.changePercent}%`, icon: stats.changePercent > 0 ? '📈' : '📉', color: stats.changePercent > 0 ? 'var(--color-danger)' : 'var(--color-accent)' },
          { label: 'Daily Average',    value: formatCurrency(stats.avgPerDay),         icon: '📅', color: 'var(--color-warning)'  },
          { label: 'Transactions',     value: stats.transactionCount,                  icon: '🧾', color: 'var(--color-primary)'  },
        ].map(item => (
          <div key={item.label} className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Insight Cards */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
        🧠 AI Recommendations
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
        {insights.map(insight => {
          const cfg = TYPE_CONFIG[insight.type] || TYPE_CONFIG.info
          const { Icon } = cfg
          return (
            <div key={insight.id} className="insight-card" style={{ background: cfg.bg, borderColor: cfg.border }}>
              <div className="insight-icon" style={{ background: `${cfg.border}`, color: cfg.labelColor }}>
                <span style={{ fontSize: 20 }}>{insight.icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{insight.title}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: cfg.labelColor, padding: '2px 8px', borderRadius: 99, background: `${cfg.border}` }}>
                    {cfg.label}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {insight.description}
                </p>
                {insight.saving && (
                  <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(16,185,129,0.12)', borderRadius: 99, fontSize: 12, fontWeight: 700, color: 'var(--color-accent)' }}>
                    💰 Potential saving: {formatCurrency(insight.saving)}/month
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Category Analysis */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
        📊 Category Analysis
      </h3>
      <div className="card" style={{ padding: 24 }}>
        {categoryData.slice(0, 6).map(cat => {
          const max = categoryData[0]?.value || 1
          const pct = (cat.value / max) * 100
          return (
            <div key={cat.id} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  <span>{cat.icon}</span> {cat.label}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: cat.color }}>{formatCurrency(cat.value)}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%`, background: cat.color }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
