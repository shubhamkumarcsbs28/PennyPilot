// Empty state placeholder with icon and CTA
export const EmptyState = ({ icon = '📭', title = 'Nothing here yet', description = '', action = null }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '60px 24px', textAlign: 'center',
  }}>
    <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.6 }}>{icon}</div>
    <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{title}</h3>
    {description && (
      <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 320, lineHeight: 1.6 }}>{description}</p>
    )}
    {action && <div style={{ marginTop: 24 }}>{action}</div>}
  </div>
)
