'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiHeart } from 'react-icons/fi';
import { favoritesAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import ListingCard from '../../components/ListingCard';
import Pagination from '../../components/Pagination';
import { ListingsGridSkeleton } from '../../components/Skeletons';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/favorites');
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await favoritesAPI.getAll({ page, limit: 12 });
        setListings(data.listings || []);
        setPagination(data.pagination || {});
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, [isAuthenticated, page]);

  const handleFavoriteToggle = (listingId, isFav) => {
    if (!isFav) {
      setListings((prev) => prev.filter((l) => l.id !== listingId));
      setPagination((p) => ({ ...p, total: p.total - 1 }));
    }
  };

  if (authLoading) return null;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1><FiHeart style={{ marginRight: 10 }} />My Favorites</h1>
          <p>Houses you have saved for later</p>
        </div>
      </div>

      <div className="section-sm">
        <div className="container">
          {loading ? (
            <ListingsGridSkeleton count={6} />
          ) : listings.length > 0 ? (
            <>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 20 }}>
                {pagination.total} saved listing{pagination.total !== 1 ? 's' : ''}
              </p>
              <div className="listings-grid">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={{ ...listing, isFavorited: true }}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                ))}
              </div>
              <Pagination pagination={pagination} onChange={setPage} />
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><FiHeart /></div>
              <h3>No saved listings yet</h3>
              <p>Browse listings and click the heart icon to save your favorite homes here.</p>
              <Link href="/listings" className="btn btn-primary">Browse Listings</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
