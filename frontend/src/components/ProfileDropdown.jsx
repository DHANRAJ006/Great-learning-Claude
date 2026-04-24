// ============================================================
//  ProfileDropdown Component
// ============================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function ProfileDropdown({ user, onClose, onSettings, onCerts }) {
  const { showToast, logout } = useApp();
  const navigate = useNavigate();

  const progress = user?.overallProgress ?? 68;

  const handleLogout = () => {
    logout();
    onClose();
    showToast('👋 Logged out securely. See you soon!', 'info');
  };

  return (
    <div className="profile-dropdown open" id="profile-dropdown" role="menu" aria-label="Profile menu">

      {/* Header */}
      <div className="dropdown-header">
        <div className="dropdown-avatar-wrap">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatarSeed||'learnflow'}&backgroundColor=b6e3f4`}
            alt="Avatar" className="dropdown-avatar"
            onError={e => e.target.style.display='none'}
          />
          <div className="online-dot"></div>
        </div>
        <div className="dropdown-user-info">
          <strong>{user?.name || 'Hari Ramachandran'}</strong>
          <span>{user?.email || 'hari.r@example.com'}</span>
          <div className="plan-badge">⚡ {user?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="dropdown-progress-section">
        <div className="dp-progress-label">
          <span>Course Progress</span>
          <span className="dp-progress-pct">{progress}%</span>
        </div>
        <div className="dp-progress-bar">
          <div className="dp-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="dp-progress-sub">
          {user?.inProgress?.length || 3} courses in progress this month
        </p>
      </div>

      <div className="dropdown-divider"></div>

      {/* Menu items */}
      <ul className="dropdown-menu-list" role="none">
        <li role="none">
          <button className="dropdown-item" role="menuitem"
            onClick={() => { onClose(); navigate('/courses'); }}>
            <BookIcon /> My Learning
          </button>
        </li>
        <li role="none">
          <button className="dropdown-item" role="menuitem" onClick={() => { onClose(); onCerts(); }}>
            <CertIcon /> Certificates
            <span className="dd-badge">{user?.certificates?.length || 2}</span>
          </button>
        </li>
        <li role="none">
          <button className="dropdown-item" role="menuitem" onClick={() => { onClose(); onSettings(); }}>
            <SettingsIcon /> Settings
          </button>
        </li>
      </ul>

      <div className="dropdown-divider"></div>

      <button className="dropdown-item dropdown-logout" role="menuitem"
        onClick={handleLogout}>
        <LogOutIcon /> Log Out
      </button>
    </div>
  );
}

/* ── Inline SVG Icons ── */
const BookIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const CertIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>;
const SettingsIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const LogOutIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
