'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { listingsAPI } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import ListingForm from '../../../components/ListingForm';

export default function NewListingPage() {
  const { isAuthenticated, isLandlord, loading: authLoading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [premiumRequired, setPremiumRequired] = useState(false);

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254718959781';

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
    if (!authLoading && isAuthenticated && !isLandlord) router.push('/dashboard');
  }, [isAuthenticated, isLandlord, authLoading]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError('');
    setPremiumRequired(false);
    try {
      await listingsAPI.create(formData);
      router.push('/dashboard?created=1');
    } catch (err) {
      if (err.data?.isPremiumRequired) {
        setPremiumRequired(true);
        setError(err.data.upgradeMessage || 'Upgrade to premium required.');
      } else {
        setError(err.message || 'Failed to create listing.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="section-sm">
      <div className="container" style={{ maxWidth: 780 }}>
        <div style={{ marginBottom: 24 }}>
          <Link href="/dashboard" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '1.6rem' }}>Create New Listing</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>Fill in the details below to list your property</p>
        </div>

        {error && (
          <div className={`alert ${premiumRequired ? 'alert-warning' : 'alert-error'}`}>
            <div>
              <strong>{premiumRequired ? 'Listing Limit Reached' : 'Error'}</strong>
              <div style={{ marginTop: 4 }}>{error}</div>
              {premiumRequired && (
                <a
                  href={`https://wa.me/${whatsapp}?text=Hi, I want to upgrade to premium`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm"
                  style={{ marginTop: 12, display: 'inline-flex' }}
                >
                  <FaWhatsapp /> Upgrade via WhatsApp
                </a>
              )}
            </div>
          </div>
        )}

        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 32, border: '1px solid var(--border)' }}>
          <ListingForm
            onSubmit={handleSubmit}
            loading={submitting}
            submitLabel="Publish Listing"
          />
        </div>
      </div>
    </div>
  );
}
