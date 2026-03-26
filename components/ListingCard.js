'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiMapPin, FiHeart, FiEye } from 'react-icons/fi';
import { MdApartment } from 'react-icons/md';
import { getImageUrl, HOUSE_TYPE_LABELS, formatPrice, AMENITIES_LIST } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { favoritesAPI } from '../lib/api';

const AMENITY_ICONS = {
  Water: '💧', Electricity: '⚡', Parking: '🅿️', WiFi: '📶', Security: '🔒',
};

export default function ListingCard({ listing, onFavoriteToggle }) {
  const { isAuthenticated } = useAuth();
  const [favorited, setFavorited] = useState(listing.isFavorited || false);
  const [favLoading, setFavLoading] = useState(false);

  const image = listing.images?.[0];
  const imageUrl = image ? getImageUrl(image.path) : '/placeholder.jpg';

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (favLoading) return;
    setFavLoading(true);
    try {
      const data = await favoritesAPI.toggle(listing.id);
      setFavorited(data.isFavorited);
      if (onFavoriteToggle) onFavoriteToggle(listing.id, data.isFavorited);
    } catch {
      // silent
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <Link href={`/listings/${listing.id}`} style={{ display: 'block' }}>
      <div className="card listing-card">
        <div className="listing-card-image">
          <img src={imageUrl} alt={listing.title} loading="lazy" />
          <span className="listing-card-type">
            {HOUSE_TYPE_LABELS[listing.houseType] || listing.houseType}
          </span>
          <button
            className={`listing-card-fav ${favorited ? 'active' : ''}`}
            onClick={handleFavorite}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            disabled={favLoading}
          >
            <FiHeart fill={favorited ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="listing-card-body">
          <div className="listing-card-price">
            {formatPrice(listing.price)}
            <span> /month</span>
          </div>
          <div className="listing-card-title">{listing.title}</div>
          <div className="listing-card-location">
            <FiMapPin size={13} />
            {listing.location}
          </div>

          {listing.amenities && listing.amenities.length > 0 && (
            <div className="listing-card-amenities">
              {listing.amenities.slice(0, 4).map((a) => (
                <span key={a} className="amenity-chip">
                  {a}
                </span>
              ))}
              {listing.amenities.length > 4 && (
                <span className="amenity-chip">+{listing.amenities.length - 4}</span>
              )}
            </div>
          )}

          <div className="listing-card-footer">
            <span className="listing-card-landlord">
              <MdApartment size={12} style={{ marginRight: 4 }} />
              {listing.landlordName}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <FiEye size={12} /> {listing.views || 0} views
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
