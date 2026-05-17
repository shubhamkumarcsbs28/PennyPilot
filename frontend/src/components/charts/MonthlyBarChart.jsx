import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary)' }}>
        ₹{Number(payload[0].value).toLocaleString('en-IN')}
      </div>
    </div>
  )
}

export const MonthlyBarChart = ({ data = [] }) => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={data} barSize={28} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
      <XAxis
        dataKey="month"
        tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
        axisLine={false}
        tickLine={false}
        tickFormatter={v => `₹${(v/1000).toFixed(0)}k`}
      />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)', radius: 6 }} />
      <Bar dataKey="total" radius={[6, 6, 0, 0]} animationDuration={800}>
        {data.map((_, i) => (
          <Cell
            key={i}
            fill={i === data.length - 1
              ? 'var(--color-primary)'
              : 'var(--bg-muted)'
            }
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
)
