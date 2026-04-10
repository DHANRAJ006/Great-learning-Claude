// ============================================================
//  Toast Component – renders all active toasts from context
// ============================================================
import React from 'react';
import { useApp } from '../context/AppContext.jsx';

const ICONS = { success: '✅', error: '❌', info: 'ℹ️' };

export default function Toast() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="toast-container" id="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map(({ id, message, type }) => (
        <div
          key={id}
          className={`toast toast-${type}`}
          onClick={() => removeToast(id)}
          style={{ cursor: 'pointer' }}
        >
          <span className="toast-icon">{ICONS[type] || 'ℹ️'}</span>
          <span>{message}</span>
        </div>
      ))}
    </div>
  );
}
