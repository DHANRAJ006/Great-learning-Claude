// ============================================================
//  CertModal Component
// ============================================================
import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function CertModal({ onClose, user }) {
  const { showToast } = useApp();
  const certs = user?.certificates || [];

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      id="cert-modal-overlay"
      role="dialog" aria-modal="true" aria-labelledby="cert-modal-title"
      style={{ display: 'flex' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal cert-modal">
        <div className="modal-header">
          <h2 id="cert-modal-title">Your Certificates</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close certificates">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="modal-body" id="cert-modal-body">
          {certs.length === 0 ? (
            <div style={{ textAlign:'center', padding:'var(--space-12)', color:'var(--text-muted)' }}>
              <div style={{ fontSize:'3rem', marginBottom:'var(--space-4)' }}>🏅</div>
              <p style={{ fontWeight:600 }}>No certificates yet</p>
              <p style={{ fontSize:'.88rem', marginTop:'var(--space-2)' }}>Complete a course to earn your first certificate!</p>
            </div>
          ) : (
            <div className="cert-list">
              {certs.map((cert, i) => (
                <div key={i} className="cert-item">
                  <div className="cert-icon">{cert.emoji}</div>
                  <div className="cert-info">
                    <div className="cert-title">{cert.title}</div>
                    <div className="cert-meta">{cert.instructor}</div>
                    <div className="cert-date">
                      {cert.date} &nbsp;·&nbsp; ID: {cert.credentialId}
                    </div>
                  </div>
                  <button
                    className="cert-download-btn"
                    onClick={() => showToast(`⬇️ Downloading "${cert.title.slice(0,30)}…"`, 'success')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
