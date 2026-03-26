'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { listingsAPI } from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';
import ListingForm from '../../../../components/ListingForm';

export default function EditListingPage() {
  const { id } = useParams();
  const { isAuthenticated, isLandlord, loading: authLoading } = useAuth();
  const router = useRouter();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      try {
        const data = await listingsAPI.getOne(id);
        setListing(data.listing);
      } catch {
        setError('Listing not found or access denied.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isAuthenticated]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError('');
    try {
      await listingsAPI.update(id, formData);
      router.push('/dashboard?updated=1');
    } catch (err) {
      setError(err.message || 'Failed to update listing.');
      setSubmitting(false);
    }
  };

  if (authLoading || !isAuthenticated) return null;
  if (loading) return (
    <div className="container section-sm" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
      Loading listing...
    </div>
  );
  if (error && !listing) return (
    <div className="container section-sm">
      <div className="alert alert-error">{error}</div>
      <Link href="/dashboard" className="btn btn-outline">Back to Dashboard</Link>
    </div>
  );

  return (
    <div className="section-sm">
      <div className="container" style={{ maxWidth: 780 }}>
        <div style={{ marginBottom: 24 }}>
          <Link href="/dashboard" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '1.6rem' }}>Edit Listing</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>Update the details of your property listing</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 32, border: '1px solid var(--border)' }}>
          <ListingForm
            initialData={listing}
            existingImages={listing?.images || []}
            onSubmit={handleSubmit}
            loading={submitting}
            submitLabel="Update Listing"
          />
        </div>
      </div>
    </div>
  );
}
