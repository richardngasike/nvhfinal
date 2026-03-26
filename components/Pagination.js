'use client';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ pagination, onChange }) {
  const { page, totalPages, total, limit } = pagination;
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i);
  }

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 40 }}>
      <p className="pagination-info">
        Showing {start}–{end} of {total} listings
      </p>
      <div className="pagination">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <FiChevronLeft />
        </button>

        {pages[0] > 1 && (
          <>
            <button onClick={() => onChange(1)}>1</button>
            {pages[0] > 2 && <span style={{ padding: '0 4px', color: 'var(--text-muted)' }}>…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            className={p === page ? 'active' : ''}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span style={{ padding: '0 4px', color: 'var(--text-muted)' }}>…</span>
            )}
            <button onClick={() => onChange(totalPages)}>{totalPages}</button>
          </>
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
