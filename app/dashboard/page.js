'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit2, FiTrash2, FiGrid, FiEye, FiHeart, FiStar } from 'react-icons/fi';
import { MdApartment } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { listingsAPI, getImageUrl, HOUSE_TYPE_LABELS, formatPrice } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { DashboardSkeleton } from '../../components/Skeletons';
import Pagination from '../../components/Pagination';

const FREE_LIMIT = 4;

export default function DashboardPage() {
  const { user, isAuthenticated, isLandlord, loading: authLoading } = useAuth();
  const router = useRouter();

  const [listings, setListings] = useState([]);
  const [meta, setMeta] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (!isAuthenticated || !isLandlord) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await listingsAPI.getMyListings({ page });
        setListings(data.listings || []);
        setMeta(data.meta);
        setPagination(data.pagination || {});
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, [isAuthenticated, isLandlord, page]);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await listingsAPI.delete(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
      setPagination((p) => ({ ...p, total: p.total - 1 }));
      if (meta) setMeta((m) => ({ ...m, listingCount: m.listingCount - 1, canCreate: true }));
    } catch (err) {
      alert(err.message || 'Failed to delete listing.');
    } finally {
      setDeleting(null);
    }
  };

  if (authLoading || !isAuthenticated) return null;

  if (!isLandlord) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="empty-state-icon"><FiGrid /></div>
        <h2>Tenant Account</h2>
        <p style={{ color: 'var(--text-muted)', margin: '12px auto 24px', maxWidth: 400 }}>
          Your account is registered as a Tenant. To list properties, please register a Landlord account.
        </p>
        <Link href="/listings" className="btn btn-primary">Browse Listings</Link>
      </div>
    );
  }

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254718959781';

  return (
    <div className="section-sm">
      <div className="container">
        <div className="dashboard-layout">
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <div className="sidebar-profile">
              <div className="sidebar-avatar">{user?.name?.[0]?.toUpperCase() || 'L'}</div>
              <div className="sidebar-name">{user?.name}</div>
              <div className="sidebar-email">{user?.email}</div>
              <div style={{ marginTop: 10 }}>
                <span className={`badge ${user?.isPremium ? 'badge-premium' : 'badge-gray'}`}>
                  {user?.isPremium ? '⭐ Premium' : 'Free Tier'}
                </span>
              </div>
            </div>
            <nav className="sidebar-nav">
              <Link href="/dashboard" className="active"><FiGrid /> My Listings</Link>
              <Link href="/dashboard/new"><FiPlus /> New Listing</Link>
              <hr className="divider" />
              <Link href="/listings"><MdApartment /> Browse All</Link>
            </nav>
          </aside>

          {/* Main */}
          <main className="dashboard-main">
            {/* Premium Banner */}
            {!user?.isPremium && (
              <div className="premium-banner">
                <h3><FiStar /> Upgrade to Premium</h3>
                <p>
                  You can post up to {FREE_LIMIT} listings on the free plan.
                  {meta?.listingCount >= FREE_LIMIT
                    ? ' You have reached your limit.'
                    : ` You have ${FREE_LIMIT - (meta?.listingCount || 0)} listings remaining.`}
                  {' '}Upgrade for unlimited listings.
                </p>
                <a
                  href={`https://wa.me/${whatsapp}?text=Hi, I want to upgrade to premium on Nairobi Vacant Houses`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm"
                >
                  <FaWhatsapp /> Upgrade via WhatsApp: +{whatsapp}
                </a>
              </div>
            )}

            {/* Stats */}
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon green"><MdApartment /></div>
                <div>
                  <div className="stat-value">{pagination.total}</div>
                  <div className="stat-label">Total Listings</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange"><FiEye /></div>
                <div>
                  <div className="stat-value">
                    {listings.reduce((s, l) => s + (l.views || 0), 0)}
                  </div>
                  <div className="stat-label">Total Views</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue"><FiHeart /></div>
                <div>
                  <div className="stat-value">
                    {listings.reduce((s, l) => s + (l._count?.favorites || 0), 0)}
                  </div>
                  <div className="stat-label">Total Saves</div>
                </div>
              </div>
            </div>

            {/* Listings */}
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h3>My Listings</h3>
                {meta?.canCreate ? (
                  <Link href="/dashboard/new" className="btn btn-primary btn-sm">
                    <FiPlus /> New Listing
                  </Link>
                ) : (
                  <a
                    href={`https://wa.me/${whatsapp}?text=Hi, I want to upgrade to premium`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn btn-accent btn-sm"
                  >
                    <FiStar /> Upgrade for More
                  </a>
                )}
              </div>

              {loading ? (
                <DashboardSkeleton />
              ) : listings.length > 0 ? (
                <>
                  {listings.map((listing) => {
                    const image = listing.images?.[0];
                    return (
                      <div key={listing.id} className="my-listing-row">
                        <div className="my-listing-thumb">
                          <img
                            src={image ? getImageUrl(image.path) : '/placeholder.jpg'}
                            alt={listing.title}
                          />
                        </div>
                        <div className="my-listing-info">
                          <div className="my-listing-title">{listing.title}</div>
                          <div className="my-listing-meta">
                            {listing.location} · {HOUSE_TYPE_LABELS[listing.houseType]} ·&nbsp;
                            <FiEye size={11} style={{ verticalAlign: 'middle' }} /> {listing.views} ·&nbsp;
                            <FiHeart size={11} style={{ verticalAlign: 'middle' }} /> {listing._count?.favorites || 0}
                          </div>
                        </div>
                        <div className="my-listing-price">{formatPrice(listing.price)}<span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-muted)' }}>/mo</span></div>
                        <div className="my-listing-actions">
                          <Link href={`/listings/${listing.id}`} className="btn btn-ghost btn-sm" title="View"><FiEye /></Link>
                          <Link href={`/dashboard/edit/${listing.id}`} className="btn btn-outline btn-sm" title="Edit"><FiEdit2 /></Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(listing.id, listing.title)}
                            disabled={deleting === listing.id}
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <Pagination pagination={pagination} onChange={setPage} />
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon"><MdApartment /></div>
                  <h3>No listings yet</h3>
                  <p>Post your first listing and start connecting with potential tenants.</p>
                  <Link href="/dashboard/new" className="btn btn-primary">Post Your First Listing</Link>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
