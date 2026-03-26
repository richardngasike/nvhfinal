import Link from 'next/link';
import { MdApartment } from 'react-icons/md';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';

export const metadata = { title: 'Page Not Found | Nairobi Vacant Houses' };

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: '5rem', color: 'var(--gray-200)', marginBottom: 16 }}>
          <MdApartment />
        </div>
        <h1 style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--gray-200)', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: '1.4rem', marginTop: 8, marginBottom: 12 }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>
          The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">
            <FiArrowLeft /> Go Home
          </Link>
          <Link href="/listings" className="btn btn-outline">
            <FiSearch /> Browse Listings
          </Link>
        </div>
      </div>
    </div>
  );
}
