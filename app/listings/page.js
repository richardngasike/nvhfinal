'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MdApartment } from 'react-icons/md';
import { listingsAPI } from '../../lib/api';
import ListingCard from '../../components/ListingCard';
import Filters from '../../components/Filters';
import Pagination from '../../components/Pagination';
import { ListingsGridSkeleton } from '../../components/Skeletons';

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getParams = () => ({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    houseType: searchParams.get('houseType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    page: parseInt(searchParams.get('page') || '1'),
  });

  const [params, setParams] = useState(getParams);
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchListings = useCallback(async (p) => {
    setLoading(true);
    setError('');
    try {
      const data = await listingsAPI.getAll({ ...p, limit: 12 });
      setListings(data.listings || []);
      setPagination(data.pagination || {});
    } catch (err) {
      setError(err.message || 'Failed to load listings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const p = getParams();
    setParams(p);
    fetchListings(p);
  }, [searchParams]);

  const handleFilterChange = (newParams) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(newParams).filter(([, v]) => v !== '' && v != null))
    ).toString();
    router.push(`/listings?${query}`);
  };

  const handlePageChange = (page) => {
    handleFilterChange({ ...params, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Browse Listings</h1>
          <p>Find your perfect rental home across all Nairobi estates</p>
        </div>
      </div>

      <div className="section-sm">
        <div className="container">
          <Filters params={params} onChange={handleFilterChange} total={pagination.total} />

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <ListingsGridSkeleton count={12} />
          ) : listings.length > 0 ? (
            <>
              <div className="listings-grid">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              <Pagination pagination={pagination} onChange={handlePageChange} />
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><MdApartment /></div>
              <h3>No listings found</h3>
              <p>Try adjusting your search filters or browse all listings.</p>
              <button className="btn btn-outline" onClick={() => handleFilterChange({ page: 1 })}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
