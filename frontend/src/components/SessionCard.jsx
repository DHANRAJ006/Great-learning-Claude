// ============================================================
//  SessionCard Component
// ============================================================
import React from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function SessionCard({ session, selected, onSelect, onJoin }) {
  const { showToast } = useApp();
  const {
    _id, title, instructor, instructorInitial, topicLabel,
    level, status, startTime, duration, viewers, enrolled, tags,
  } = session;

  const handleJoinClick = (e) => {
    e.stopPropagation();
    if (onJoin) {
      onJoin(session);
    } else {
      if (status === 'live') {
        showToast(`🔴 Joining "${title.slice(0, 30)}…"`, 'success');
      } else {
        showToast(`✅ Registered for "${title.slice(0, 30)}…"`, 'success');
      }
    }
  };

  return (
    <div
      className={`session-card${selected ? ' selected' : ''}`}
      role="listitem"
      onClick={() => onSelect(session)}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(session)}
    >
      <div className="session-card-inner">
        <div className="session-avatar">{instructorInitial}</div>
        <div className="session-info">
          <div className="session-top">
            <span className={`session-status ${status === 'live' ? 'status-live' : 'status-upcoming'}`}>
              {status === 'live' ? '🔴 LIVE' : '⏰ Upcoming'}
            </span>
            <span className={`level-pill level-${level}`}>{level}</span>
          </div>
          <div className="session-title">{title}</div>
          <div className="session-instructor">by {instructor}</div>
          <div className="session-tags">
            {tags?.map(t => <span key={t} className="session-tag">{t}</span>)}
          </div>
        </div>
      </div>

      <div className="session-meta">
        <span className="session-meta-item">⏱ {duration}</span>
        <span className="session-meta-item">
          {status === 'live' ? `👁 ${viewers} watching` : `📅 ${enrolled?.toLocaleString('en-IN')} registered`}
        </span>
        <span className="session-meta-item">🕒 {startTime}</span>
      </div>

      <button className="join-session-btn" onClick={handleJoinClick}>
        {status === 'live' ? 'Join Live →' : 'Register →'}
      </button>
    </div>
  );
}
