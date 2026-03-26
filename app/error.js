'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FiRefreshCw, FiArrowLeft } from 'react-icons/fi';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--gray-200)', lineHeight: 1 }}>500</h1>
        <h2 style={{ fontSize: '1.4rem', marginTop: 8, marginBottom: 12 }}>Something went wrong</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>
          An unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={reset}>
            <FiRefreshCw /> Try Again
          </button>
          <Link href="/" className="btn btn-outline">
            <FiArrowLeft /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
