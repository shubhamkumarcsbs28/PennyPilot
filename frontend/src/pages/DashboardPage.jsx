import { useExpenses } from '../context/ExpenseContext'
import { useAuth } from '../context/AuthContext'
import { Card, CardHeader } from '../components/ui/Card'
import { SpendingPieChart } from '../components/charts/SpendingPieChart'
import { MonthlyBarChart } from '../components/charts/MonthlyBarChart'
import { TrendLineChart } from '../components/charts/TrendLineChart'
import { formatCurrency, formatRelativeDate } from '../utils/formatters'
import { getCategoryById } from '../utils/mockData'
import {
  TrendingUp, TrendingDown, Wallet, CreditCard,
  ArrowUpRight, ArrowDownRight, Zap, AlertTriangle,
} from 'lucide-react'
import { format } from 'date-fns'

const StatCard = ({ title, value, subtitle, trend, gradientClass, icon: Icon }) => (
  <div className={`stat-card card ${gradientClass}`} style={{ padding: 24, color: 'white' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: 'rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color="white" />
      </div>
      {trend !== undefined && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'rgba(255,255,255,0.15)',
          padding: '4px 8px', borderRadius: 99, fontSize: 12, fontWeight: 600,
        }}>
          {trend > 0
            ? <TrendingUp size={12} />
            : <TrendingDown size={12} />
          }
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>{value}</div>
    <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{title}</div>
    {subtitle && <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{subtitle}</div>}
  </div>
)

const TxRow = ({ expense }) => {
  const cat = getCategoryById(expense.category)
  const isExpense = true
  return (
    <div className="tx-row">
      <div className="tx-icon" style={{ background: `${cat.color}18` }}>
        <span style={{ fontSize: 18 }}>{cat.icon}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {expense.merchant}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          {formatRelativeDate(expense.date)} · {expense.paymentMethod}
        </div>
      </div>
      <div>
        <span className={`badge cat-${expense.category}`} style={{ marginBottom: 4, display: 'block', textAlign: 'right' }}>
          {cat.label}
        </span>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-danger)', textAlign: 'right' }}>
          −{formatCurrency(expense.amount)}
        </div>
      </div>
    </div>
  )
}

export const DashboardPage = () => {
  const { user } = useAuth()
  const {
    stats, monthlyData, trendData, categoryData, expenses, insights,
  } = useExpenses()

  const recentTx = expenses.slice(0, 8)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="page-content stagger">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">{greeting}, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="page-subtitle">{format(new Date(), 'EEEE, d MMMM yyyy')} · Here's your financial snapshot</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard
          title="Monthly Spending"
          value={formatCurrency(stats.totalSpent)}
          subtitle={`${stats.transactionCount} transactions`}
          trend={stats.changePercent}
          gradientClass="gradient-card-indigo"
          icon={CreditCard}
        />
        <StatCard
          title="Available Balance"
          value={formatCurrency(Math.max(0, (user?.balance || 45000) - stats.totalSpent))}
          subtitle="Estimated remaining"
          gradientClass="gradient-card-emerald"
          icon={Wallet}
        />
        <StatCard
          title="Avg Daily Spend"
          value={formatCurrency(stats.avgPerDay)}
          subtitle="This month"
          gradientClass="gradient-card-amber"
          icon={TrendingUp}
        />
        <StatCard
          title="Savings Rate"
          value={`${Math.max(0, Math.round(100 - (stats.totalSpent / (user?.balance || 45000)) * 100))}%`}
          subtitle="Of monthly income"
          gradientClass="gradient-card-blue"
          icon={ArrowUpRight}
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Monthly Bar */}
        <div className="chart-container">
          <CardHeader title="Monthly Overview" subtitle="Last 6 months spending" />
          <MonthlyBarChart data={monthlyData} />
        </div>

        {/* Category Pie */}
        <div className="chart-container">
          <CardHeader title="Category Breakdown" subtitle="This month" />
          <SpendingPieChart data={categoryData} />
        </div>
      </div>

      {/* Trend + Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Trend */}
        <div className="chart-container">
          <CardHeader title="Daily Trend" subtitle="Last 14 days" />
          <TrendLineChart data={trendData} />
        </div>

        {/* AI Insights Teaser */}
        <div className="card" style={{ padding: 20 }}>
          <CardHeader title="AI Insights" subtitle="Smart recommendations" icon={<Zap size={16} />} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {insights.slice(0, 3).map(insight => (
              <div key={insight.id} style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                padding: '10px 12px',
                background: insight.type === 'warning'
                  ? 'rgba(245,158,11,0.08)' : insight.type === 'tip'
                  ? 'rgba(99,102,241,0.08)' : 'rgba(16,185,129,0.08)',
                borderRadius: 10,
                border: `1px solid ${
                  insight.type === 'warning' ? 'rgba(245,158,11,0.2)'
                  : insight.type === 'tip' ? 'rgba(99,102,241,0.2)'
                  : 'rgba(16,185,129,0.2)'
                }`,
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{insight.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{insight.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.5 }}>
                    {insight.description.length > 80
                      ? insight.description.slice(0, 80) + '…'
                      : insight.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card" style={{ padding: 24 }}>
        <CardHeader
          title="Recent Transactions"
          subtitle={`${expenses.length} total transactions`}
          action={
            <a href="/expenses" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
              View all →
            </a>
          }
        />
        {recentTx.map(exp => <TxRow key={exp._id} expense={exp} />)}
      </div>
    </div>
  )
}
