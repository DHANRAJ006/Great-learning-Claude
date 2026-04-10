// ============================================================
//  SettingsModal Component
// ============================================================
import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme.js';
import { useApp }   from '../context/AppContext.jsx';

const ACCENTS = [
  { id: 'violet', label: 'Violet', cls: 'swatch-violet' },
  { id: 'cyan',   label: 'Cyan',   cls: 'swatch-cyan'   },
  { id: 'rose',   label: 'Rose',   cls: 'swatch-rose'   },
  { id: 'amber',  label: 'Amber',  cls: 'swatch-amber'  },
];

export default function SettingsModal({ onClose }) {
  const { theme: currentTheme, accent: currentAccent } = useTheme();
  const { applyTheme, applyAccent } = useTheme();
  const { showToast } = useApp();

  const [draftTheme,  setDraftTheme]  = useState(currentTheme);
  const [draftAccent, setDraftAccent] = useState(currentAccent);
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
    applyTheme(draftTheme);
    applyAccent(draftAccent);
    onClose();
    showToast('✅ Settings saved!', 'success');
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
            <div className="settings-row">
              <div className="settings-label">
                <strong>Theme</strong>
                <span>Choose your preferred colour scheme</span>
              </div>
              <div className="theme-toggle-group" role="radiogroup">
                {['dark','light'].map(t => (
                  <button key={t}
                    className={`theme-option${draftTheme === t ? ' active' : ''}`}
                    role="radio" aria-checked={draftTheme === t}
                    onClick={() => setDraftTheme(t)}>
                    <span className="theme-icon">{t === 'dark' ? '🌙' : '☀️'}</span>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
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
                  onClick={() => setDraftAccent(a.id)}>
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
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
