'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiHome,
  FiHeart,
  FiGrid,
  FiPlusSquare,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiMenu,
  FiX,
  FiChevronDown,
  FiStar,
} from 'react-icons/fi';
import { MdApartment } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { user, isAuthenticated, isLandlord, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push('/');
  };

  const isActive = (path) =>
    pathname === path || (path !== '/' && pathname.startsWith(path))
      ? styles.active
      : '';

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const roleLabel =
    user?.role === 'LANDLORD'
      ? user?.isPremium ? 'Premium Landlord' : 'Landlord'
      : user?.role === 'ADMIN'
      ? 'Administrator'
      : 'Tenant';

  return (
    <>
      {/* ── MAIN HEADER ───────────────────────────────────────────── */}
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>

          {/* LOGO */}
          <Link href="/" className={styles.logo} aria-label="Go to homepage">
            <div className={styles.logoImageWrap}>
              <Image
                src="/nvhlogo.png"
                alt="Nairobi Vacant Houses"
                width={44}
                height={44}
                className={styles.logoImage}
                priority
              />
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>Nairobi Vacant Houses</span>
              <span className={styles.logoSub}>Find Your Perfect Home</span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className={styles.nav} aria-label="Main navigation">
            <Link href="/" className={`${styles.navLink} ${isActive('/')}`}>
              <span className={styles.navLinkIcon}><FiHome size={15} /></span>
              Home
            </Link>
            <Link href="/listings" className={`${styles.navLink} ${isActive('/listings')}`}>
              <span className={styles.navLinkIcon}><MdApartment size={16} /></span>
              Listings
            </Link>
            {isAuthenticated && (
              <Link href="/favorites" className={`${styles.navLink} ${isActive('/favorites')}`}>
                <span className={styles.navLinkIcon}><FiHeart size={15} /></span>
                Favorites
              </Link>
            )}
            {isLandlord && (
              <Link href="/dashboard" className={`${styles.navLink} ${isActive('/dashboard')}`}>
                <span className={styles.navLinkIcon}><FiGrid size={15} /></span>
                Dashboard
              </Link>
            )}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className={styles.actions}>
            {isAuthenticated ? (
              <>
                {isLandlord && (
                  <Link href="/dashboard/new" className={styles.postBtn}>
                    <FiPlusSquare size={16} />
                    Post Listing
                  </Link>
                )}

                {/* User dropdown */}
                <div className={styles.userMenu} ref={dropdownRef}>
                  <button
                    className={styles.userMenuBtn}
                    onClick={() => setDropdownOpen((p) => !p)}
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                    aria-label="Open user menu"
                  >
                    <div className={styles.userAvatar}>{initials}</div>
                    <span className={styles.userName}>
                      {user?.name?.split(' ')[0]}
                    </span>
                    <FiChevronDown
                      size={14}
                      className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className={styles.dropdown} role="menu">
                      <div className={styles.dropdownHeader}>
                        <div className={styles.dropdownName}>{user?.name}</div>
                        <div className={styles.dropdownEmail}>{user?.email}</div>
                        <span className={`${styles.dropdownBadge} ${user?.isPremium ? styles.dropdownBadgePremium : ''}`}>
                          {user?.isPremium && <FiStar size={10} />}
                          {roleLabel}
                        </span>
                      </div>

                      <Link href="/dashboard" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)} role="menuitem">
                        <span className={styles.dropdownLinkIcon}><FiGrid size={15} /></span>
                        Dashboard
                      </Link>

                      <Link href="/favorites" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)} role="menuitem">
                        <span className={styles.dropdownLinkIcon}><FiHeart size={15} /></span>
                        My Favorites
                      </Link>

                      <hr className={styles.dropdownDivider} />

                      <button className={`${styles.dropdownLink} ${styles.logoutLink}`} onClick={handleLogout} role="menuitem">
                        <span className={styles.dropdownLinkIcon}><FiLogOut size={15} /></span>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className={styles.loginBtn}>
                  <FiLogIn size={15} />
                  Login
                </Link>
                <Link href="/register" className={styles.registerBtn}>
                  <FiUserPlus size={15} />
                  Register
                </Link>
              </>
            )}

            {/* Burger — mobile only */}
            <button
              className={styles.burger}
              onClick={() => setMobileOpen((p) => !p)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ─────────────────────────────────────────── */}
      {mobileOpen && (
        <nav className={styles.mobileDrawer} aria-label="Mobile navigation">
          <div className={styles.mobileInner}>

            {/* Logged-in user card */}
            {isAuthenticated && (
              <div className={styles.mobileUserCard}>
                <div className={styles.mobileAvatarLarge}>{initials}</div>
                <div>
                  <div className={styles.mobileUserName}>{user?.name}</div>
                  <div className={styles.mobileUserRole}>{roleLabel}</div>
                </div>
              </div>
            )}

            <Link href="/" className={`${styles.mobileNavLink} ${isActive('/')}`}>
              <span className={styles.mobileNavLinkIcon}><FiHome size={18} /></span>
              Home
            </Link>

            <Link href="/listings" className={`${styles.mobileNavLink} ${isActive('/listings')}`}>
              <span className={styles.mobileNavLinkIcon}><MdApartment size={18} /></span>
              All Listings
            </Link>

            {isAuthenticated && (
              <Link href="/favorites" className={`${styles.mobileNavLink} ${isActive('/favorites')}`}>
                <span className={styles.mobileNavLinkIcon}><FiHeart size={18} /></span>
                My Favorites
              </Link>
            )}

            {isAuthenticated && (
              <Link href="/dashboard" className={`${styles.mobileNavLink} ${isActive('/dashboard')}`}>
                <span className={styles.mobileNavLinkIcon}><FiGrid size={18} /></span>
                Dashboard
              </Link>
            )}

            <hr className={styles.mobileDivider} />

            {isAuthenticated ? (
              <>
                {isLandlord && (
                  <Link href="/dashboard/new" className={styles.mobilePostBtn}>
                    <FiPlusSquare size={18} />
                    Post a New Listing
                  </Link>
                )}
                <button className={`${styles.mobileNavLink} ${styles.mobileLogoutBtn}`} onClick={handleLogout}>
                  <span className={styles.mobileNavLinkIcon}><FiLogOut size={18} /></span>
                  Sign Out
                </button>
              </>
            ) : (
              <div className={styles.mobileAuthBtns}>
                <Link href="/login" className={styles.mobileLoginBtn}>
                  <FiLogIn size={16} /> Login
                </Link>
                <Link href="/register" className={styles.mobileRegisterBtn}>
                  <FiUserPlus size={16} /> Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </>
  );
}