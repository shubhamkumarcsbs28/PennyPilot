import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Area, AreaChart, ReferenceLine
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-accent)' }}>
        ₹{Number(payload[0]?.value || 0).toLocaleString('en-IN')}
      </div>
    </div>
  )
}

export const TrendLineChart = ({ data = [] }) => (
  <ResponsiveContainer width="100%" height={200}>
    <AreaChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%"  stopColor="var(--color-accent)" stopOpacity={0.25} />
          <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}    />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
      <XAxis
        dataKey="day"
        tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
        axisLine={false} tickLine={false}
        interval={2}
      />
      <YAxis
        tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
        axisLine={false} tickLine={false}
        tickFormatter={v => `₹${(v/1000).toFixed(0)}k`}
      />
      <Tooltip content={<CustomTooltip />} />
      <Area
        type="monotone"
        dataKey="amount"
        stroke="var(--color-accent)"
        strokeWidth={2.5}
        fill="url(#trendGrad)"
        dot={false}
        activeDot={{ r: 5, fill: 'var(--color-accent)', stroke: 'var(--bg-surface)', strokeWidth: 2 }}
        animationDuration={1000}
      />
    </AreaChart>
  </ResponsiveContainer>
)
