'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiMapPin, FiPhone, FiHeart, FiArrowLeft, FiChevronLeft,
  FiChevronRight, FiEye, FiShare2, FiCheckCircle, FiX
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { MdApartment } from 'react-icons/md';
import { listingsAPI, favoritesAPI, getImageUrl, HOUSE_TYPE_LABELS, AMENITIES_LIST, formatPrice } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { DetailSkeleton } from '../../../components/Skeletons';

export default function ListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listingsAPI.getOne(id);
        setListing(data.listing);
        setFavorited(data.listing.isFavorited || false);
      } catch (err) {
        setError(err.status === 404 ? 'Listing not found.' : 'Failed to load listing.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleFavorite = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (favLoading) return;
    setFavLoading(true);
    try {
      const data = await favoritesAPI.toggle(id);
      setFavorited(data.isFavorited);
    } catch {}
    finally { setFavLoading(false); }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: listing.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const prevImage = () => setCurrentImage((p) => (p === 0 ? images.length - 1 : p - 1));
  const nextImage = () => setCurrentImage((p) => (p === images.length - 1 ? 0 : p + 1));

  if (loading) return <DetailSkeleton />;
  if (error) return (
    <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
      <div className="empty-state-icon"><MdApartment /></div>
      <h2>{error}</h2>
      <Link href="/listings" className="btn btn-primary" style={{ marginTop: 16 }}>
        <FiArrowLeft /> Back to Listings
      </Link>
    </div>
  );

  const images = listing.images || [];
  const hasImages = images.length > 0;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254718959781';
  const waLink = listing.landlordPhone
    ? `https://wa.me/${listing.landlordPhone.replace(/\D/g, '')}?text=Hi ${listing.landlordName}, I saw your listing "${listing.title}" on Nairobi Vacant Houses and I'm interested.`
    : `https://wa.me/${whatsapp}?text=Hi, I'm interested in this listing: ${listing.title}`;

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '14px 0' }}>
        <div className="container">
          <div className="breadcrumb" style={{ color: 'var(--text-muted)' }}>
            <Link href="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
            <span>/</span>
            <Link href="/listings" style={{ color: 'var(--text-muted)' }}>Listings</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{listing.title}</span>
          </div>
        </div>
      </div>

      <div className="container detail-layout">
        {/* LEFT COLUMN */}
        <div>
          {/* Image Carousel */}
          <div className="detail-carousel">
            <div className="carousel-main">
              {hasImages ? (
                <img
                  src={getImageUrl(images[currentImage]?.path)}
                  alt={`${listing.title} - image ${currentImage + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-100)', color: 'var(--text-muted)' }}>
                  <MdApartment size={60} />
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button className="carousel-btn carousel-prev" onClick={prevImage} aria-label="Previous image"><FiChevronLeft /></button>
                  <button className="carousel-btn carousel-next" onClick={nextImage} aria-label="Next image"><FiChevronRight /></button>
                  <span className="carousel-counter">{currentImage + 1} / {images.length}</span>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="carousel-thumbs">
                {images.map((img, i) => (
                  <div
                    key={img.id}
                    className={`carousel-thumb ${i === currentImage ? 'active' : ''}`}
                    onClick={() => setCurrentImage(i)}
                  >
                    <img src={getImageUrl(img.path)} alt={`Thumbnail ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, marginTop: 20, border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: 12, fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</h3>
            <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)' }}>{listing.description}</p>
          </div>

          {/* Amenities */}
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, marginTop: 16, border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: 16, fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amenities</h3>
            <div className="amenities-list">
              {AMENITIES_LIST.map((a) => {
                const has = listing.amenities?.includes(a);
                return (
                  <span key={a} className={`amenity-item ${has ? '' : 'amenity-missing'}`}>
                    {has ? <FiCheckCircle /> : <FiX />} {a}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Price & Header */}
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--border)', position: 'sticky', top: 90 }}>
            <div className="detail-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="detail-price">{formatPrice(listing.price)} <span>/month</span></div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className={`btn btn-ghost btn-sm ${favorited ? '' : ''}`}
                    onClick={handleFavorite}
                    disabled={favLoading}
                    style={{ color: favorited ? 'var(--danger)' : undefined }}
                    aria-label="Toggle favorite"
                  >
                    <FiHeart fill={favorited ? 'currentColor' : 'none'} />
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={handleShare} aria-label="Share listing">
                    {copied ? <FiCheckCircle color="var(--success)" /> : <FiShare2 />}
                  </button>
                </div>
              </div>
              <h1 className="detail-title">{listing.title}</h1>
              <div className="detail-location">
                <FiMapPin size={14} /> {listing.location}
              </div>
            </div>

            <div className="detail-meta">
              <span className="badge badge-primary">{HOUSE_TYPE_LABELS[listing.houseType]}</span>
              <span className="badge badge-gray"><FiEye size={11} style={{ marginRight: 3 }} />{listing.views} views</span>
              <span className="badge badge-gray">
                {new Date(listing.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            {/* Contact */}
            <div className="detail-contact-card">
              <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)' }}>
                <MdApartment /> Landlord Contact
              </h4>
              <div className="contact-name">{listing.landlordName}</div>

              {isAuthenticated ? (
                <>
                  <div className="contact-phone">
                    <FiPhone size={14} />
                    {listing.landlordPhone || 'Contact via WhatsApp'}
                  </div>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp btn-full"
                  >
                    <FaWhatsapp size={18} /> Contact via WhatsApp
                  </a>
                </>
              ) : (
                <div className="login-prompt">
                  <FiPhone size={24} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
                  <p>Login to view landlord contact details and send a message.</p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href={`/login?redirect=/listings/${listing.id}`} className="btn btn-primary btn-sm">
                      Login to Contact
                    </Link>
                    <Link href="/register" className="btn btn-outline btn-sm">Register Free</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Back button */}
            <Link href="/listings" className="btn btn-ghost btn-full" style={{ marginTop: 14 }}>
              <FiArrowLeft /> Back to Listings
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
