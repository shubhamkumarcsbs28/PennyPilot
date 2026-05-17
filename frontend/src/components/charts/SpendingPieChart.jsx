import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { getCategoryById } from '../../utils/mockData'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{d.icon}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{d.label}</span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: d.color, marginTop: 4 }}>
        ₹{d.value.toLocaleString('en-IN')}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
        {payload[0].percent ? `${(payload[0].percent * 100).toFixed(1)}% of total` : ''}
      </div>
    </div>
  )
}

const CustomLegend = ({ payload }) => (
  <div style={{
    display: 'flex', flexWrap: 'wrap', gap: '8px 16px',
    justifyContent: 'center', marginTop: 12,
  }}>
    {payload?.map((entry, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
        <span style={{ color: 'var(--text-secondary)' }}>{entry.value}</span>
      </div>
    ))}
  </div>
)

export const SpendingPieChart = ({ data = [] }) => {
  if (!data.length) return (
    <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
      No data this month
    </div>
  )

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={95}
          paddingAngle={3}
          dataKey="value"
          nameKey="label"
          animationBegin={0}
          animationDuration={800}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  )
}
