'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiSearch, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { MdApartment } from 'react-icons/md';
import { listingsAPI, HOUSE_TYPE_LABELS } from '../lib/api';
import ListingCard from '../components/ListingCard';
import { ListingsGridSkeleton } from '../components/Skeletons';

const HOUSE_TYPES = Object.entries(HOUSE_TYPE_LABELS);

const WHY_ITEMS = [
  { icon: '🔍', title: 'Verified Listings', desc: 'All listings are reviewed before going live on our platform.' },
  { icon: '📞', title: 'Direct Contact', desc: 'Connect directly with landlords — no middlemen, no hidden fees.' },
  { icon: '🏡', title: 'Wide Coverage', desc: 'Listings across all major Nairobi estates and suburbs.' },
  { icon: '💰', title: 'All Budgets', desc: 'From budget bedsitters to executive apartments — find your fit.' },
];

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ listings: 0, locations: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [data, locData] = await Promise.all([
          listingsAPI.getAll({ limit: 6, sortBy: 'views', sortOrder: 'desc' }),
          listingsAPI.getLocations(),
        ]);
        setFeatured(data.listings || []);
        setStats({ listings: data.pagination?.total || 0, locations: locData.locations?.length || 0 });
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/listings?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push('/listings');
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: 20, fontSize: '0.85rem', marginBottom: 16 }}>
              <MdApartment /> Your Nairobi Home Awaits
            </div>
            <h1>Find Your Perfect<br />Rental in Nairobi</h1>
            <p>Browse hundreds of verified rental listings across all Nairobi estates. Single rooms, bedsitters, apartments — all in one place.</p>

            <form className="hero-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search by area, house type, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search listings"
              />
              <button type="submit" className="btn btn-primary">
                <FiSearch /> Search
              </button>
            </form>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="number">{stats.listings}+</div>
                <div className="label">Active Listings</div>
              </div>
              <div className="hero-stat">
                <div className="number">{stats.locations}+</div>
                <div className="label">Nairobi Areas</div>
              </div>
              <div className="hero-stat">
                <div className="number">100%</div>
                <div className="label">Free to Browse</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOUSE TYPES */}
      <section className="section-sm" style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 12, overflow: 'auto', paddingBottom: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {HOUSE_TYPES.map(([val, label]) => (
              <Link
                key={val}
                href={`/listings?houseType=${val}`}
                style={{
                  padding: '8px 20px', borderRadius: 20, background: 'var(--primary-light)',
                  color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem',
                  border: '1.5px solid rgba(26,107,60,0.2)', whiteSpace: 'nowrap', transition: 'var(--transition)',
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Featured Listings</h2>
            <p>Explore our most viewed rental properties across Nairobi</p>
          </div>

          {loading ? (
            <ListingsGridSkeleton count={6} />
          ) : featured.length > 0 ? (
            <>
              <div className="listings-grid">
                {featured.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 36 }}>
                <Link href="/listings" className="btn btn-primary btn-lg">
                  View All Listings <FiArrowRight />
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><MdApartment /></div>
              <h3>No listings yet</h3>
              <p>Be the first to list your property on Nairobi Vacant Houses.</p>
              <Link href="/register?role=LANDLORD" className="btn btn-primary">List Your Property</Link>
            </div>
          )}
        </div>
      </section>

      {/* WHY US */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="section-title">
            <h2>Why Choose Us?</h2>
            <p>We make finding a home in Nairobi simple and stress-free</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {WHY_ITEMS.map((item) => (
              <div key={item.title} style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ marginBottom: 8, fontSize: '1rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA LANDLORD */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', marginBottom: 12 }}>Are You a Landlord?</h2>
          <p style={{ opacity: 0.9, maxWidth: 520, margin: '0 auto 28px', fontSize: '1.05rem' }}>
            List your vacant property for free and reach thousands of tenants looking for homes in Nairobi.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register?role=LANDLORD" className="btn btn-accent btn-lg">
              Post Your Listing Free
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254718959781'}?text=Hi, I want to list my property`}
              target="_blank" rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
            >
              <FiCheckCircle /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
