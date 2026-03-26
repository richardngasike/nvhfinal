export function ListingCardSkeleton() {
  return (
    <div className="skeleton-card card">
      <div className="skeleton skeleton-image" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text-sm" />
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <div className="skeleton" style={{ height: 22, width: 60, borderRadius: 20 }} />
          <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 20 }} />
          <div className="skeleton" style={{ height: 22, width: 50, borderRadius: 20 }} />
        </div>
        <div className="skeleton skeleton-btn" style={{ borderRadius: 8 }} />
      </div>
    </div>
  );
}

export function ListingsGridSkeleton({ count = 9 }) {
  return (
    <div className="listings-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="detail-layout container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <div>
        <div className="skeleton" style={{ height: 420, borderRadius: 'var(--radius-lg)' }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ width: 80, height: 60, borderRadius: 6 }} />
          ))}
        </div>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skeleton" style={{ height: 28, width: '40%' }} />
          <div className="skeleton" style={{ height: 22, width: '70%' }} />
          <div className="skeleton" style={{ height: 18, width: '50%' }} />
          <div className="skeleton" style={{ height: 100 }} />
        </div>
      </div>
      <div>
        <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius-lg)' }} />
        <div className="skeleton" style={{ height: 160, borderRadius: 'var(--radius-lg)', marginTop: 16 }} />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 90, borderRadius: 'var(--radius-lg)' }} />
        ))}
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton" style={{ height: 72, borderRadius: 'var(--radius-sm)' }} />
      ))}
    </div>
  );
}
