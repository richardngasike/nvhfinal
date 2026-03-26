'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiHome, FiUser, FiLogOut, FiGrid, FiHeart,
  FiPlusCircle, FiMenu, FiX, FiChevronDown, FiLogIn
} from 'react-icons/fi';
import { MdApartment } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, isAuthenticated, isLandlord, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setMobileOpen(false);
    router.push('/');
  };

  const isActive = (path) => pathname === path ? 'active' : '';

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-inner">
            {/* Logo */}
            <Link href="/" className="header-logo">
              <MdApartment size={28} />
              <span>Nairobi Vacant Houses</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="header-nav">
              <Link href="/" className={isActive('/')}>Home</Link>
              <Link href="/listings" className={isActive('/listings')}>Listings</Link>
              {isAuthenticated && (
                <Link href="/favorites" className={isActive('/favorites')}>Favorites</Link>
              )}
            </nav>

            {/* Actions */}
            <div className="header-actions">
              {isAuthenticated ? (
                <>
                  {isLandlord && (
                    <Link href="/dashboard/new" className="btn btn-primary btn-sm">
                      <FiPlusCircle /> Post Listing
                    </Link>
                  )}
                  <div className="user-menu" ref={dropdownRef}>
                    <button className="user-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                      <FiUser />
                      <span>{user?.name?.split(' ')[0]}</span>
                      <FiChevronDown size={14} />
                    </button>
                    {menuOpen && (
                      <div className="user-dropdown">
                        <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                          <FiGrid /> Dashboard
                        </Link>
                        <Link href="/favorites" onClick={() => setMenuOpen(false)}>
                          <FiHeart /> Favorites
                        </Link>
                        <hr className="divider" />
                        <button onClick={handleLogout} className="logout-btn">
                          <FiLogOut /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-outline btn-sm">
                    <FiLogIn /> Login
                  </Link>
                  <Link href="/register" className="btn btn-primary btn-sm">
                    <FiUser /> Register
                  </Link>
                </>
              )}

              {/* Mobile Burger */}
              <button
                className="mobile-menu-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <nav className="mobile-nav">
          <Link href="/"><FiHome /> Home</Link>
          <Link href="/listings"><MdApartment /> All Listings</Link>
          {isAuthenticated && (
            <Link href="/favorites"><FiHeart /> My Favorites</Link>
          )}
          {isAuthenticated && (
            <Link href="/dashboard"><FiGrid /> Dashboard</Link>
          )}
          {isLandlord && (
            <Link href="/dashboard/new"><FiPlusCircle /> Post Listing</Link>
          )}
          <hr className="divider" />
          {isAuthenticated ? (
            <button onClick={handleLogout}><FiLogOut /> Sign Out</button>
          ) : (
            <>
              <Link href="/login"><FiLogIn /> Login</Link>
              <Link href="/register"><FiUser /> Register</Link>
            </>
          )}
        </nav>
      )}
    </>
  );
}
