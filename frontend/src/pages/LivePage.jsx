// ============================================================
//  LivePage – 3-column: Filters / Sessions / AI Summary
// ============================================================
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch }        from '../hooks/useFetch.js';
import { useApp }          from '../context/AppContext.jsx';
import SessionCard         from '../components/SessionCard.jsx';
import VideoPreviewModal   from '../components/VideoPreviewModal.jsx';

const TOPICS = ['System Design','Generative AI','Frontend','Mobile Dev','DevOps & Cloud','Data Science','Cyber Security','Business'];
const LEVELS = ['beginner','intermediate','advanced'];

// Static live sessions with realistic (low-to-medium) viewer counts
const STATIC_SESSIONS = [
  {
    _id: 'ls1',
    title: 'System Design: Designing Twitter/X at Scale',
    instructor: 'Kiran Bose', instructorInitial: 'KB',
    topic: 'webdev', topicLabel: 'System Design', level: 'advanced',
    status: 'live', startTime: 'Live now', duration: '90 min',
    viewers: 47, enrolled: 312,
    tags: ['System Design', 'Microservices', 'CAP Theorem'],
    videoUrl: 'https://www.youtube.com/watch?v=i53Gi_K3o7I',
    overview: 'Kiran breaks down how Twitter handles 500M+ tweets per day. Covers timeline generation with fanout, sharding strategies, Kafka streaming and CDN for media.',
    topics: ['Fanout-on-write vs fanout-on-read','Database sharding & consistent hashing','Redis cache for hot timelines','Kafka event streaming','Global CDN for media'],
    insights: ['Twitter uses a hybrid fanout model.','Read replicas and WAL are critical for consistency.','Tweet ID encodes timestamp, shard ID, and sequence.'],
  },
  {
    _id: 'ls2',
    title: 'LangChain + RAG: Build a Production PDF QnA Bot',
    instructor: 'Rahul Kapoor', instructorInitial: 'RK',
    topic: 'ai', topicLabel: 'Generative AI', level: 'intermediate',
    status: 'live', startTime: 'Live now', duration: '120 min',
    viewers: 23, enrolled: 198,
    tags: ['LangChain', 'RAG', 'ChromaDB', 'OpenAI'],
    videoUrl: 'https://www.youtube.com/watch?v=ySus5ZS0b94',
    overview: 'Rahul demonstrates how to build a production-grade RAG pipeline to answer questions from PDFs. Covers chunking, vector embeddings, retrieval ranking and FastAPI deployment.',
    topics: ['Document ingestion & text chunking','Embeddings with OpenAI Ada-002','ChromaDB vector store','Chain-of-thought retrieval','FastAPI + Docker deploy'],
    insights: ['Chunk size of 512 tokens with 50-token overlap is ideal.','HyDE can improve recall by 30%.','Combine BM25 sparse with dense embeddings.'],
  },
  {
    _id: 'ls3',
    title: 'React 19 Deep Dive: Server Components & Actions',
    instructor: 'Priya Sharma', instructorInitial: 'PS',
    topic: 'webdev', topicLabel: 'Frontend', level: 'intermediate',
    status: 'upcoming', startTime: 'Today 7:00 PM', duration: '75 min',
    viewers: 0, enrolled: 284,
    tags: ['React 19', 'Server Components', 'Next.js 15'],
    videoUrl: 'https://www.youtube.com/watch?v=Sklc_fQBmcs',
    overview: 'Priya walks through the new mental model in React 19 — server components, server actions, and the transition from client-centric to server-centric rendering.',
    topics: ['Server vs Client components','Server Actions: mutations without API routes','Streaming and Suspense','Next.js 15 caching strategies','Migration from React 18'],
    insights: ['Server components reduce bundle size dramatically.','Forms can call server actions with the action prop.','The new use hook unifies promises and context.'],
  },
  {
    _id: 'ls4',
    title: 'Flutter Animations: Lottie, Hero & Custom Painters',
    instructor: 'Divya Reddy', instructorInitial: 'DR',
    topic: 'mobile', topicLabel: 'Mobile Dev', level: 'intermediate',
    status: 'upcoming', startTime: 'Today 9:00 PM', duration: '60 min',
    viewers: 0, enrolled: 119,
    tags: ['Flutter', 'Animations', 'CustomPainter', 'Lottie'],
    videoUrl: 'https://www.youtube.com/watch?v=VPvVD8t02U8',
    overview: 'Divya demonstrates three levels of Flutter animations — Hero transitions, Lottie JSON animations, and low-level CustomPainter for pixel-perfect effects.',
    topics: ['Implicit vs explicit animations','Hero & page route transitions','Lottie JSON-based animations','CustomPainter & Canvas API','Performance: jank detection'],
    insights: ['Use RepaintBoundary to isolate heavy animation widgets.','Lottie files are 95% smaller than GIFs.','The Ticker class is the heartbeat of all animations.'],
  },
  {
    _id: 'ls5',
    title: 'Kubernetes Troubleshooting: Real Production Incidents',
    instructor: 'Vikram Nair', instructorInitial: 'VN',
    topic: 'devops', topicLabel: 'DevOps & Cloud', level: 'advanced',
    status: 'upcoming', startTime: 'Tomorrow 11:00 AM', duration: '90 min',
    viewers: 0, enrolled: 156,
    tags: ['Kubernetes', 'Debugging', 'Observability', 'Helm'],
    videoUrl: 'https://www.youtube.com/watch?v=X48VuDVv0do',
    overview: 'Vikram replays five real Kubernetes production incidents and walks through kubectl commands, log analysis, and Prometheus queries to diagnose each.',
    topics: ['CrashLoopBackOff: common causes','OOMKilled: tuning memory limits','Pod pending: taints & tolerations','DNS resolution failures','Prometheus + Grafana dashboards'],
    insights: ['80% of K8s issues trace to misconfigured resource limits.','Always set liveness and readiness probes.','Use kubectl debug for distroless images.'],
  },
  {
    _id: 'ls6',
    title: 'Data Visualization with Plotly & Dash: Interactive Dashboards',
    instructor: 'Ananya Das', instructorInitial: 'AD',
    topic: 'datascience', topicLabel: 'Data Science', level: 'beginner',
    status: 'upcoming', startTime: 'Tomorrow 6:00 PM', duration: '75 min',
    viewers: 0, enrolled: 93,
    tags: ['Plotly', 'Dash', 'Python', 'Data Viz'],
    videoUrl: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
    overview: 'Ananya builds a complete real-time analytics dashboard from scratch using Plotly Express and Dash, then deploys it to heroku in under 10 minutes.',
    topics: ['Plotly Express vs Graph Objects','Dash layout components','Callbacks: linking inputs to charts','Interval component for live polling','One-click deploy to Heroku'],
    insights: ['Plotly outputs interactive HTML natively.','Use dcc.Store to share state between callbacks.','Aggregate data server-side before sending to browser.'],
  },
  {
    _id: 'ls7',
    title: 'Ethical Hacking 101: OWASP Top 10 Explained',
    instructor: 'Suresh Kumar', instructorInitial: 'SK',
    topic: 'cybersec', topicLabel: 'Cyber Security', level: 'beginner',
    status: 'live', startTime: 'Live now', duration: '60 min',
    viewers: 18, enrolled: 241,
    tags: ['OWASP', 'Security', 'Penetration Testing'],
    videoUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
    overview: 'Suresh walks through the OWASP Top 10 vulnerabilities with live demonstrations, showing how attackers exploit them and how to defend your applications.',
    topics: ['SQL Injection & XSS','Broken Authentication','Security Misconfiguration','Using tools: Burp Suite','Defensive coding patterns'],
    insights: ['70% of web breaches involve OWASP Top 10 flaws.','Input validation prevents most injection attacks.','Always use parameterized queries.'],
  },
  {
    _id: 'ls8',
    title: 'Product Strategy: From Idea to Roadmap',
    instructor: 'Meera Joshi', instructorInitial: 'MJ',
    topic: 'business', topicLabel: 'Business', level: 'beginner',
    status: 'upcoming', startTime: 'Tomorrow 4:00 PM', duration: '45 min',
    viewers: 0, enrolled: 62,
    tags: ['Product Management', 'Roadmap', 'Agile'],
    videoUrl: 'https://www.youtube.com/watch?v=64oxP6Klb20',
    overview: 'Meera takes you from raw idea to a structured product roadmap using Jobs-to-be-Done and OKR frameworks. Practical templates included.',
    topics: ['Jobs-to-be-Done framework','Priority matrices','OKR goal setting','Writing user stories','Stakeholder alignment'],
    insights: ['Start with the problem, not the solution.','OKRs align teams around outcomes, not outputs.','User stories without acceptance criteria fail 60% of time.'],
  },
];

export default function LivePage() {
  const navigate = useNavigate();
  const { showToast, user } = useApp();
  const [topicFilter, setTopicFilter] = useState([]);
  const [levelFilter, setLevelFilter] = useState([]);
  const [selected,    setSelected]    = useState(null);
  const [preview,     setPreview]     = useState(null); // { title, videoUrl }
  const [showSurvey,  setShowSurvey]  = useState(false);
  const [pendingSession, setPendingSession] = useState(null);
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(false);

  const { data, loading } = useFetch('/api/live');
  const fetchedSessions = data?.data || [];

  const handleJoinRequest = (s) => {
    if (!user) {
      showToast('Please sign in to join or watch previews', 'error');
      navigate('/login');
      return;
    }

    if (!hasCompletedSurvey) {
      setPendingSession(s);
      setShowSurvey(true);
    } else {
      proceedToSession(s);
    }
  };

  const proceedToSession = (s) => {
    if (s.videoUrl) {
      setPreview({ title: s.title, videoUrl: s.videoUrl });
    } else {
      showToast(
        s.status === 'live'
          ? `🔴 Joining "${s.title.slice(0,30)}…"`
          : `✅ Registered for "${s.title.slice(0,30)}…"`,
        'success'
      );
    }
  };

  // Use API data if available, else static
  const allSessions = fetchedSessions.length > 0 ? fetchedSessions : STATIC_SESSIONS;

  const sessions = useMemo(() => {
    return allSessions.filter(s => {
      if (topicFilter.length && !topicFilter.includes(s.topicLabel)) return false;
      if (levelFilter.length && !levelFilter.includes(s.level))      return false;
      return true;
    });
  }, [allSessions, topicFilter, levelFilter]);

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
                <div
                  key={s._id}
                  onClick={() => setSelected(s)}
                  style={{ cursor: 'pointer' }}
                >
                  <SessionCard
                    session={s}
                    selected={displayedSelected?._id === s._id}
                    onSelect={setSelected}
                    onJoin={handleJoinRequest}
                  />
                </div>
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
              <AISummary session={displayedSelected} onJoin={handleJoinRequest} />
            )}
          </div>
        </aside>

      </div>

      {/* Live Session Survey Modal */}
      {showSurvey && (
        <SurveyModal 
          user={user}
          onCancel={() => setShowSurvey(false)}
          onComplete={(data) => {
            setHasCompletedSurvey(true);
            setShowSurvey(false);
            if (pendingSession) proceedToSession(pendingSession);
          }}
        />
      )}

      {/* Video preview modal */}
      {preview && (
        <VideoPreviewModal
          title={preview.title}
          videoUrl={preview.videoUrl}
          onClose={() => setPreview(null)}
        />
      )}
    </section>
  );
}

/* ── Live Survey Modal ── */
function SurveyModal({ user, onCancel, onComplete }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: '',
    email: user?.email || ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError('Name is required');
    if (!/^\d{10}$/.test(formData.mobile)) return setError('Please enter a valid 10-digit mobile number');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return setError('Please enter a valid email address');
    
    onComplete(formData);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        background: 'var(--bg-card)', padding: '32px', borderRadius: '24px',
        width: '100%', maxWidth: '440px', border: '1px solid var(--border-subtle)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)', position: 'relative'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📝</div>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>Quick Survey</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Please provide your details to join the live session.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>FULL NAME</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Enter your name"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#fff', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>MOBILE NUMBER (10 DIGITS)</label>
            <input 
              type="tel" 
              maxLength="10"
              value={formData.mobile}
              onChange={e => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})}
              placeholder="e.g. 9876543210"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#fff', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="your@email.com"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#fff', outline: 'none' }}
            />
          </div>

          {error && <div style={{ color: '#ff4d4d', fontSize: '0.85rem', textAlign: 'center' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button 
              type="button"
              onClick={onCancel}
              style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'transparent', border: '1px solid var(--border-subtle)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
            >Cancel</button>
            <button 
              type="submit"
              style={{ flex: 2, padding: '12px', borderRadius: '10px', background: 'var(--accent-1)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px var(--accent-glow)' }}
            >Submit & Join</button>
          </div>
        </form>
      </div>
    </div>
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

      {/* Viewer count badge */}
      {session.status === 'live' && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          marginBottom: 12, padding: '4px 10px',
          background: 'rgba(239,68,68,0.12)', borderRadius: '999px',
          fontSize: '0.78rem', fontWeight: 600, color: 'hsl(0,75%,60%)',
        }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'hsl(0,75%,60%)', display:'inline-block', animation:'pulse 1.5s infinite' }}/>
          {session.viewers} watching now
        </div>
      )}

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
        {session.status === 'live' ? '▶ Watch Preview →' : 'Register for Session →'}
      </button>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
