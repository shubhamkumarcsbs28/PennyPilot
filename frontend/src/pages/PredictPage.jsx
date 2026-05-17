import { useExpenses } from '../context/ExpenseContext'
import { PredictionChart } from '../components/charts/PredictionChart'
import { formatCurrency } from '../utils/formatters'
import { getCategoryById } from '../utils/mockData'
import { TrendingUp, AlertTriangle, Zap } from 'lucide-react'

export const PredictPage = () => {
  const { predictions, categoryData } = useExpenses()

  return (
    <div className="page-content stagger">
      <div className="page-header">
        <div>
          <h2 className="page-title">Expense Predictions</h2>
          <p className="page-subtitle">AI-powered forecast based on your spending history</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(99,102,241,0.1)', borderRadius: 99, fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>
          <Zap size={14} /> Predictive AI
        </div>
      </div>

      {/* Key Prediction Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card stat-card gradient-card-indigo" style={{ padding: 24, color: 'white' }}>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>Next Month Predicted</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{formatCurrency(predictions.nextMonthPredicted)}</div>
          <div style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>Based on last 3 months trend</div>
        </div>

        <div className="card stat-card gradient-card-emerald" style={{ padding: 24, color: 'white' }}>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>This Month Projected</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{formatCurrency(predictions.thisMonthProjected)}</div>
          <div style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>At current daily rate</div>
        </div>

        <div className="card stat-card gradient-card-amber" style={{ padding: 24, color: 'white' }}>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>Estimated Savings</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{formatCurrency(predictions.savingsEstimate)}</div>
          <div style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>If you follow recommendations</div>
        </div>

        {predictions.overspendRisk && (
          <div className="card stat-card gradient-card-rose" style={{ padding: 24, color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <AlertTriangle size={16} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Overspend Risk!</span>
            </div>
            <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.5 }}>
              You're on track to exceed your average monthly spend. Consider reducing discretionary expenses.
            </div>
          </div>
        )}
      </div>

      {/* Prediction Chart */}
      <div className="chart-container" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Spending Forecast</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Historical data + AI prediction for next month</p>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--bg-muted)' }} /> Actual
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#6366f1' }} /> Predicted
            </div>
          </div>
        </div>
        <PredictionChart data={predictions.chartData} />
      </div>

      {/* Category-wise Predictions */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
          Category-wise Forecast
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
          {categoryData.slice(0, 6).map(cat => {
            const predicted = Math.round(cat.value * (0.9 + Math.random() * 0.3))
            const higher = predicted > cat.value
            return (
              <div key={cat.id} className="budget-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 22 }}>{cat.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{cat.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>This month: {formatCurrency(cat.value)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: higher ? 'var(--color-danger)' : 'var(--color-accent)' }}>
                    {formatCurrency(predicted)}
                  </span>
                  {higher
                    ? <TrendingUp size={14} color="var(--color-danger)" />
                    : <TrendingUp size={14} color="var(--color-accent)" style={{ transform: 'rotate(180deg)' }} />
                  }
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Predicted next month</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
