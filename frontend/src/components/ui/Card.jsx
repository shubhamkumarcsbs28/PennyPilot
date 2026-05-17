// Reusable Card component with glassmorphism variant
export const Card = ({ children, className = '', glass = false, onClick }) => (
  <div
    className={`card ${glass ? 'glass' : ''} ${className}`}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : undefined }}
  >
    {children}
  </div>
)

export const CardHeader = ({ title, subtitle, action, icon }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {icon && (
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'rgba(99,102,241,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--color-primary)', flexShrink: 0,
        }}>
          {icon}
        </div>
      )}
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
)
