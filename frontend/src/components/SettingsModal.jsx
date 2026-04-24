// ============================================================
//  SettingsModal Component
// ============================================================
import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme.js';
import { useApp }   from '../context/AppContext.jsx';

const ACCENTS = [
  { id: 'purple', label: 'Aura Purple',  cls: 'swatch-purple' },
  { id: 'blue',   label: 'Corporate Blue', cls: 'swatch-blue'   },
  { id: 'teal',   label: 'Brand Teal',   cls: 'swatch-teal'   },
  { id: 'orange', label: 'Vibrant Orange', cls: 'swatch-orange' },
  { id: 'green',  label: 'Growth Green', cls: 'swatch-green'  },
];

export default function SettingsModal({ onClose }) {
  const { theme: currentTheme, accent: currentAccent } = useTheme();
  const { applyTheme, applyAccent } = useTheme();
  const { showToast } = useApp();

  const [draftTheme,  setDraftTheme]  = useState(currentTheme);
  const [draftAccent, setDraftAccent] = useState(currentAccent);

  // Store initial state to revert if Cancelled
  const [initialTheme]  = useState(currentTheme);
  const [initialAccent] = useState(currentAccent);
  const [notifLive,   setNotifLive]   = useState(true);
  const [notifNew,    setNotifNew]    = useState(true);
  const [notifDigest, setNotifDigest] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleSave = () => {
    // Already applied via preview, just close and persist
    showToast('✅ Preferences saved!', 'success');
    onClose();
  };

  const handleCancel = () => {
    applyTheme(initialTheme);
    applyAccent(initialAccent);
    onClose();
  };

  const handleApplyTheme = (t) => {
    setDraftTheme(t);
    applyTheme(t);
  };

  const handleApplyAccent = (a) => {
    setDraftAccent(a);
    applyAccent(a);
  };

  return (
    <div
      className="modal-overlay"
      id="settings-modal-overlay"
      role="dialog" aria-modal="true" aria-labelledby="settings-modal-title"
      style={{ display: 'flex' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal settings-modal">
        <div className="modal-header">
          <h2 id="settings-modal-title">Settings</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Theme */}
          <div className="settings-section">
            <h3 className="settings-section-title">Appearance</h3>
              <div className="theme-toggle-group">
                <button 
                  className={`theme-option${draftTheme === 'dark' ? ' active' : ''}`}
                  onClick={() => handleApplyTheme('dark')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  Dark
                </button>
                <button 
                  className={`theme-option${draftTheme === 'light' ? ' active' : ''}`}
                  onClick={() => handleApplyTheme('light')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                  Light
                </button>
              </div>
          </div>

          <div className="settings-divider"/>

          {/* Accent */}
          <div className="settings-section">
            <h3 className="settings-section-title">Accent Colour</h3>
            <p className="settings-hint">Pick a colour that energises your learning</p>
            <div className="accent-grid" role="radiogroup">
              {ACCENTS.map(a => (
                <button key={a.id}
                  className={`accent-swatch${draftAccent === a.id ? ' active' : ''}`}
                  role="radio" aria-checked={draftAccent === a.id}
                  aria-label={`${a.label} accent`}
                  onClick={() => handleApplyAccent(a.id)}>
                  <div className={`swatch-circle ${a.cls}`}></div>
                  <span>{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="settings-divider"/>

          {/* Notifications */}
          <div className="settings-section">
            <h3 className="settings-section-title">Notifications</h3>
            {[
              { label: 'Live session reminders', sub: 'Get notified 10 min before a session', val: notifLive,   set: setNotifLive   },
              { label: 'New course alerts',       sub: 'Be first to know about new content',  val: notifNew,    set: setNotifNew    },
              { label: 'Weekly digest',           sub: 'Summary of your learning progress',   val: notifDigest, set: setNotifDigest },
            ].map(({ label, sub, val, set }) => (
              <div key={label} className="settings-row">
                <div className="settings-label">
                  <strong>{label}</strong><span>{sub}</span>
                </div>
                <label className="toggle-switch" aria-label={label}>
                  <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={handleCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
