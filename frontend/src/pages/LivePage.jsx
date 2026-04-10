// ============================================================
//  LivePage – 3-column: Filters / Sessions / AI Summary
// ============================================================
import React, { useState, useMemo } from 'react';
import { useFetch }   from '../hooks/useFetch.js';
import { useApp }     from '../context/AppContext.jsx';
import SessionCard    from '../components/SessionCard.jsx';

const TOPICS = ['System Design','Generative AI','Frontend','Mobile Dev','DevOps & Cloud','Data Science'];
const LEVELS = ['beginner','intermediate','advanced'];

export default function LivePage() {
  const { showToast } = useApp();
  const [topicFilter, setTopicFilter] = useState([]);
  const [levelFilter, setLevelFilter] = useState([]);
  const [selected,    setSelected]    = useState(null);

  const { data, loading } = useFetch('/api/live');
  const allSessions = data?.data || [];

  const sessions = useMemo(() => {
    return allSessions.filter(s => {
      if (topicFilter.length && !topicFilter.includes(s.topicLabel)) return false;
      if (levelFilter.length && !levelFilter.includes(s.level))      return false;
      return true;
    });
  }, [allSessions, topicFilter, levelFilter]);

  // Auto-select first session
  const displayedSelected = selected || sessions[0] || null;

  const toggleFilter = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const resetFilters = () => { setTopicFilter([]); setLevelFilter([]); };

  return (
    <section id="page-live" className="page active" aria-label="Live courses">
      <div className="live-page-layout">

        {/* ── LEFT: Filters ── */}
        <aside className="live-filters" aria-label="Live session filters">
          <h3 className="filter-heading">Filters</h3>

          <div className="filter-group">
            <h4 className="filter-group-title">Topic</h4>
            <div className="filter-options" role="group" aria-label="Topic filters">
              {TOPICS.map(t => (
                <label key={t} className="filter-chip">
                  <input
                    type="checkbox"
                    checked={topicFilter.includes(t)}
                    onChange={() => toggleFilter(topicFilter, setTopicFilter, t)}
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-group-title">Level</h4>
            <div className="filter-options" role="group" aria-label="Level filters">
              {LEVELS.map(l => (
                <label key={l} className="filter-chip">
                  <input
                    type="checkbox"
                    checked={levelFilter.includes(l)}
                    onChange={() => toggleFilter(levelFilter, setLevelFilter, l)}
                  />
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <button className="btn btn-ghost btn-sm reset-filters-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </aside>

        {/* ── CENTRE: Sessions ── */}
        <div className="live-sessions-column">
          <div className="live-page-header">
            <h1 className="page-title">Live Sessions</h1>
            <div className="live-count-badge" id="live-count-badge">
              {loading ? '…' : `${sessions.length} session${sessions.length !== 1 ? 's' : ''}`}
            </div>
          </div>

          <div className="live-sessions-list" id="live-sessions-list" role="list">
            {loading ? (
              Array.from({length:4}).map((_,i) => (
                <div key={i} style={{
                  height:160, background:'var(--bg-surface)',
                  borderRadius:'var(--radius-lg)', border:'1px solid var(--border-subtle)',
                  marginBottom:16,
                }}/>
              ))
            ) : sessions.length === 0 ? (
              <div style={{ textAlign:'center', padding:'var(--space-16)', color:'var(--text-muted)' }}>
                <div style={{ fontSize:'3rem', marginBottom:16 }}>📭</div>
                <p style={{ fontWeight:600 }}>No sessions match your filters</p>
                <button className="btn btn-ghost btn-sm" style={{ marginTop:12 }} onClick={resetFilters}>
                  Reset Filters
                </button>
              </div>
            ) : (
              sessions.map(s => (
                <SessionCard
                  key={s._id}
                  session={s}
                  selected={displayedSelected?._id === s._id}
                  onSelect={setSelected}
                />
              ))
            )}
          </div>
        </div>

        {/* ── RIGHT: AI Summary ── */}
        <aside className="live-ai-sidebar" aria-label="AI session summary">
          <div className="ai-sidebar-header">
            <div className="ai-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/>
                <circle cx="19" cy="5" r="3" fill="var(--accent-1)"/>
              </svg>
            </div>
            <h3>AI Session Summary</h3>
          </div>

          <div className="ai-sidebar-body">
            {!displayedSelected ? (
              <p className="ai-placeholder">
                Select a live session to see the AI-generated summary, key topics, and instructor insights.
              </p>
            ) : (
              <AISummary session={displayedSelected} onJoin={(s) => {
                showToast(
                  s.status === 'live'
                    ? `🔴 Joining "${s.title.slice(0,30)}…"`
                    : `✅ Registered for "${s.title.slice(0,30)}…"`,
                  'success'
                );
              }} />
            )}
          </div>
        </aside>

      </div>
    </section>
  );
}

/* ── AI Summary Panel ── */
function AISummary({ session, onJoin }) {
  return (
    <div className="ai-summary-card">
      <div className="ai-summary-title-row">
        <div className="ai-session-avatar">{session.instructorInitial}</div>
        <div>
          <div className="ai-session-name">{session.title}</div>
          <div className="ai-session-by">by {session.instructor}</div>
        </div>
      </div>

      <div className="ai-section-label">AI Overview</div>
      <div className="ai-overview-text">{session.overview}</div>

      <div className="ai-section-label">Key Topics Covered</div>
      <div className="ai-topics-list">
        {session.topics?.map((t,i) => (
          <div key={i} className="ai-topic-item">
            <div className="ai-topic-dot"></div>
            {t}
          </div>
        ))}
      </div>

      <div className="ai-section-label">Instructor Insights</div>
      <div className="ai-insights-list">
        {session.insights?.map((ins,i) => (
          <div key={i} className="ai-insight-item">
            <div className="ai-insight-num">{i+1}</div>
            <span>{ins}</span>
          </div>
        ))}
      </div>

      <button className="ai-join-btn" onClick={() => onJoin(session)}>
        {session.status === 'live' ? 'Join Live Session →' : 'Register for Session →'}
      </button>
    </div>
  );
}
