// ============================================================
//  QuickInfoModal – Short box for "What you'll learn"
// ============================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickInfoModal({ course, onClose }) {
  const navigate = useNavigate();
  const { title, instructor, whatYoullLearn, _id } = course;

  return (
    <div className="modal-overlay" style={{ zIndex: 10000 }}>
      <div className="modal" style={{ maxWidth: '450px', padding: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Quick Preview</h2>
          <button onClick={onClose} style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>&times;</button>
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 'var(--space-6)' }}>by {instructor}</p>

        <div style={{ 
          background: 'var(--bg-surface)', 
          padding: 'var(--space-5)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          marginBottom: 'var(--space-8)'
        }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>What you'll learn:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(whatYoullLearn || [
              'Key concepts and industry standards',
              'Real-world implementation strategies',
              'Practical projects and assignments'
            ]).slice(0, 3).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--accent-1)', fontWeight: 'bold' }}>✓</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button 
            className="btn btn-primary" 
            style={{ flex: 1 }}
            onClick={() => navigate(`/course/${_id}`)}
          >
            Course Details & Video
          </button>
          <button 
            className="btn btn-ghost" 
            style={{ flex: 1 }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
