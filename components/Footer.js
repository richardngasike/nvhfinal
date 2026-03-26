import Link from 'next/link';
import { MdApartment } from 'react-icons/md';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254718959781';

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <MdApartment size={22} />
              Nairobi Vacant Houses
            </div>
            <p>
              Your trusted platform for finding quality rental homes across Nairobi.
              We connect landlords and tenants seamlessly and affordably.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', fontSize: '0.85rem' }}>
              <FiMapPin size={14} />
              <span>Nairobi, Kenya</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/listings">Browse Listings</Link></li>
              <li><Link href="/register">Register</Link></li>
              <li><Link href="/login">Login</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>For Landlords</h4>
            <ul>
              <li><Link href="/register?role=LANDLORD">List Your Property</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li>
                <a href={`https://wa.me/${whatsapp}?text=Hi, I want to upgrade to premium`} target="_blank" rel="noopener noreferrer">
                  Upgrade to Premium
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Nairobi Vacant Houses. All rights reserved.</span>
          <a
            href={`https://wa.me/${whatsapp}?text=Hello, I need help with Nairobi Vacant Houses`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-cta"
          >
            <FaWhatsapp size={18} />
            Chat Support: +{whatsapp}
          </a>
        </div>
      </div>
    </footer>
  );
}
