// Skeleton loading placeholders
export const Skeleton = ({ width = '100%', height = 16, radius = 8, className = '' }) => (
  <div
    className={`skeleton ${className}`}
    style={{ width, height, borderRadius: radius }}
  />
)

export const SkeletonCard = () => (
  <div className="card" style={{ padding: 20 }}>
    <Skeleton height={12} width="40%" radius={6} />
    <div style={{ marginTop: 12 }}>
      <Skeleton height={28} width="60%" radius={6} />
    </div>
    <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
      <Skeleton width={16} height={16} radius={4} />
      <Skeleton height={10} width="30%" radius={4} />
    </div>
  </div>
)

export const SkeletonRow = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
    <Skeleton width={42} height={42} radius={12} />
    <div style={{ flex: 1 }}>
      <Skeleton height={12} width="45%" radius={4} />
      <div style={{ marginTop: 6 }}>
        <Skeleton height={10} width="30%" radius={4} />
      </div>
    </div>
    <Skeleton height={14} width={70} radius={4} />
  </div>
)

export const SkeletonChart = () => (
  <div className="chart-container">
    <Skeleton height={12} width="30%" radius={4} />
    <div style={{ marginTop: 20 }}>
      <Skeleton height={200} radius={8} />
    </div>
  </div>
)
