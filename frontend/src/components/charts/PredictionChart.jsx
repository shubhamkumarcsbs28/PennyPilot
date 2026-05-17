import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend, ReferenceLine
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '12px 16px', boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {p.name === 'total' ? 'Actual' : 'Predicted'}:
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: p.color }}>
            ₹{Number(p.value).toLocaleString('en-IN')}
          </span>
        </div>
      ))}
      {label === 'Next' && (
        <div style={{
          fontSize: 10, color: 'var(--text-muted)', marginTop: 6,
          padding: '4px 8px', background: 'rgba(99,102,241,0.08)', borderRadius: 6,
        }}>
          ⚡ AI Predicted Value
        </div>
      )}
    </div>
  )
}

export const PredictionChart = ({ data = [] }) => {
  const splitIdx = data.findIndex(d => d.type === 'predicted')

  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          axisLine={false} tickLine={false}
          tickFormatter={v => `₹${(v/1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        {splitIdx > 0 && (
          <ReferenceLine
            x={data[splitIdx - 1]?.month}
            stroke="var(--border)"
            strokeDasharray="4 4"
            label={{ value: 'Now', fill: 'var(--text-muted)', fontSize: 11 }}
          />
        )}
        <Bar
          dataKey="total"
          fill="var(--bg-muted)"
          radius={[4,4,0,0]}
          barSize={24}
          animationDuration={800}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#6366f1"
          strokeWidth={2.5}
          dot={(props) => {
            const { cx, cy, payload } = props
            if (payload.type === 'predicted') {
              return (
                <g key={`dot-${cx}`}>
                  <circle cx={cx} cy={cy} r={8} fill="rgba(99,102,241,0.15)" />
                  <circle cx={cx} cy={cy} r={5} fill="#6366f1" stroke="white" strokeWidth={2} />
                </g>
              )
            }
            return <circle key={`dot-${cx}`} cx={cx} cy={cy} r={3} fill="#6366f1" />
          }}
          animationDuration={1200}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
