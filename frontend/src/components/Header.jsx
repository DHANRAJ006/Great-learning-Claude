// ============================================================
//  Header Component
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useTheme } from '../hooks/useTheme.js';
import SearchBar from './SearchBar.jsx';
import ProfileDropdown from './ProfileDropdown.jsx';
import SettingsModal from './SettingsModal.jsx';
import CertModal from './CertModal.jsx';

export default function Header() {
  const { user } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [scrolled,      setScrolled]      = useState(false);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [settingsOpen,  setSettingsOpen]  = useState(false);
  const [certOpen,      setCertOpen]      = useState(false);
  const [notifDot,      setNotifDot]      = useState(true);
  const profileRef = useRef(null);
  const { showToast } = useApp();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="site-header">
        <div className="header-inner">

          {/* Logo */}
          <NavLink to="/" className="logo" aria-label="LearnFlow Home">
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
              <path d="M4 20 L14 4 L24 20 Z" fill="url(#logo-grad)" opacity="0.9"/>
              <path d="M8 24 L14 14 L20 24 Z" fill="url(#logo-grad2)"/>
              <defs>
                <linearGradient id="logo-grad" x1="4" y1="4" x2="24" y2="20" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="var(--accent-1)"/>
                  <stop offset="100%" stopColor="var(--accent-2)"/>
                </linearGradient>
                <linearGradient id="logo-grad2" x1="8" y1="14" x2="20" y2="24" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="var(--accent-2)"/>
                  <stop offset="100%" stopColor="var(--accent-3)"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="logo-text">LearnFlow</span>
          </NavLink>

          {/* Search */}
          <SearchBar />

          {/* Nav links */}
          <nav className="nav-links" aria-label="Main navigation">
            <NavLink to="/"        className={({isActive}) => `nav-link${isActive ? ' active' : ''}`} end>Home</NavLink>
            <NavLink to="/courses" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>All Courses</NavLink>
            <NavLink to="/live"    className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>
              Live <span className="live-badge">LIVE</span>
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="header-actions">

            {/* Theme toggle */}
            <button className="icon-btn" id="theme-toggle-btn" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
              {theme === 'dark'
                ? <svg id="theme-icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                : <svg id="theme-icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>

            {/* Notifications */}
            <button className="icon-btn notif-btn" onClick={() => { setNotifDot(false); showToast('🔔 No new notifications', 'info'); }} title="Notifications" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {notifDot && <span className="notif-dot"></span>}
            </button>

            {/* Profile / Login */}
            {user ? (
              <div className="profile-wrapper" ref={profileRef}>
                <button
                  className="profile-trigger"
                  id="profile-trigger"
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen(o => !o)}
                >
                  <div className="avatar-ring">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatarSeed || 'learnflow'}&backgroundColor=b6e3f4`}
                      alt="Avatar" className="avatar-img"
                      onError={e => { e.target.style.display='none'; }}
                    />
                    <div className="avatar-fallback">
                      {user.name ? user.name.split(' ').map(n=>n[0]).join('').slice(0,2) : '??'}
                    </div>
                  </div>
                  <div className="profile-info">
                    <span className="profile-name">{user.name || 'Learner'}</span>
                    <span className="profile-role">{user.plan === 'pro' ? 'Premium Learner' : 'Free Member'}</span>
                  </div>
                  <svg className="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>

                {profileOpen && (
                  <ProfileDropdown
                    user={user}
                    onClose={() => setProfileOpen(false)}
                    onSettings={() => { setProfileOpen(false); setSettingsOpen(true); }}
                    onCerts={() =>   { setProfileOpen(false); setCertOpen(true); }}
                  />
                )}
              </div>
            ) : (
              <NavLink to="/login" className="btn btn-primary btn-sm" style={{ padding: '8px 20px', borderRadius: '100px' }}>
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </header>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
      {certOpen     && <CertModal    onClose={() => setCertOpen(false)}    user={user} />}
    </>
  );
}
