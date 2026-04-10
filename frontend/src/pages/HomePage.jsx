// ============================================================
//  HomePage – Ticker, Domain Grid, Recommended, Continue
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch }  from '../hooks/useFetch.js';
import { useApp }    from '../context/AppContext.jsx';
import CourseCard    from '../components/CourseCard.jsx';

const TICKER_ITEMS = [
  { text: 'React 19 Server Components — New Session Added',   tag: 'New'      },
  { text: '10K+ enrolled in Python ML Bootcamp this week',    tag: 'Trending' },
  { text: 'System Design sold out — next batch 24 Apr',       tag: 'Alert'    },
  { text: 'Free SQL + MongoDB course now live',               tag: 'Free'     },
  { text: 'LangChain RAG workshop → 218 watching right now',  tag: 'Live'     },
  { text: 'New: Generative AI & LLM Engineering track',       tag: 'New'      },
  { text: 'Flutter Animations session — Today 9 PM IST',      tag: 'Upcoming' },
  { text: '50,000 certificates earned in March!',             tag: '🎉'       },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { showToast, user } = useApp();
  const [selectedDomain, setSelectedDomain] = useState(null);

  // Fetch domains and courses
  const domainsUrl = '/api/domains';
  const coursesUrl = selectedDomain
    ? `/api/courses?domain=${selectedDomain}&sort=popular`
    : '/api/courses?sort=popular';

  const { data: domainsData, loading: domainsLoading } = useFetch(domainsUrl);
  const { data: coursesData, loading: coursesLoading } = useFetch(coursesUrl);

  const domains = domainsData?.data || [];
  const allCourses = coursesData?.data || [];
  const recommended = allCourses.slice(0, 6);

  const inProgress = user?.inProgress || [
    { courseId:'c1', emoji:'⚛️', title:'React 19 & Next.js 15',      instructor:'Priya Sharma', progress:68 },
    { courseId:'c4', emoji:'🤖', title:'Generative AI & LLMs',       instructor:'Rahul Kapoor', progress:32 },
    { courseId:'c5', emoji:'☁️',  title:'Kubernetes & Docker on AWS', instructor:'Vikram Nair',  progress:15 },
  ];

  return (
    <section id="page-home" className="page active" aria-label="Home page">

      {/* ── Hero ── */}
      <div className="hero-section">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge">🇮🇳 Made for India's Next Million Learners</div>
          <h1 className="hero-title">
            Learn Skills That<br/>
            <span className="gradient-text">Actually Get You Hired</span>
          </h1>
          <p className="hero-sub">
            Expert-led courses in tech, design &amp; business — with live sessions, AI mentorship, and career support.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/courses')}>Explore Courses</button>
            <button className="btn btn-ghost btn-lg"   onClick={() => navigate('/live')}>Watch Live Demo</button>
          </div>
          <div className="hero-stats">
            {[['2.4M+','Learners'],['1,200+','Courses'],['96%','Job Rate']].map(([num,label],i,arr) => (
              <React.Fragment key={label}>
                <div className="stat-item">
                  <span className="stat-num">{num}</span>
                  <span className="stat-label">{label}</span>
                </div>
                {i < arr.length-1 && <div className="stat-divider"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-stack">
            <div className="floating-card card-1">
              <div className="fc-icon">🎯</div>
              <div className="fc-text"><strong>AI Mentorship</strong><span>24/7 doubt clearing</span></div>
            </div>
            <div className="floating-card card-2">
              <div className="fc-icon">🏆</div>
              <div className="fc-text"><strong>Certificate Earned!</strong><span>React Advanced</span></div>
            </div>
            <div className="floating-card card-3">
              <div className="fc-icon">🔴</div>
              <div className="fc-text"><strong>Live Now</strong><span>System Design — 342 watching</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ticker ── */}
      <Ticker items={TICKER_ITEMS} />

      {/* ── Domains ── */}
      <section className="section domain-section">
        <h2 className="section-title">Browse by Domain</h2>
        {domainsLoading ? (
          <LoadingGrid count={8} />
        ) : (
          <div className="domain-grid" role="list">
            {domains.map(d => (
              <div
                key={d.domainId}
                className={`domain-card${selectedDomain === d.domainId ? ' active' : ''}`}
                role="listitem" tabIndex={0}
                aria-label={`${d.name} — ${d.count} courses`}
                onClick={() => setSelectedDomain(prev => prev === d.domainId ? null : d.domainId)}
                onKeyDown={e => e.key === 'Enter' && setSelectedDomain(prev => prev === d.domainId ? null : d.domainId)}
              >
                <div className="domain-emoji">{d.emoji}</div>
                <div className="domain-name">{d.name}</div>
                <div className="domain-count">{d.count} courses</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Recommended ── */}
      <section className="section recommended-section">
        <div className="section-header">
          <h2 className="section-title">Recommended for You</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/courses')}>See all →</button>
        </div>
        {coursesLoading ? (
          <LoadingGrid count={6} />
        ) : (
          <div className="courses-grid" role="list">
            {recommended.map(c => <CourseCard key={c._id} course={c} />)}
          </div>
        )}
      </section>

      {/* ── Continue Learning ── */}
      <section className="section continue-section">
        <h2 className="section-title">Continue Learning</h2>
        <div className="continue-grid" role="list">
          {inProgress.map((c, i) => (
            <div
              key={i} className="continue-card" role="listitem" tabIndex={0}
              onClick={() => showToast(`▶️ Resuming ${c.title.slice(0,30)}…`, 'info')}
            >
              <div className="continue-thumb">{c.emoji}</div>
              <div className="continue-info">
                <div className="continue-title">{c.title}</div>
                <div className="continue-instructor">{c.instructor}</div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${c.progress}%` }}></div>
                  </div>
                  <span className="progress-pct">{c.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

/* ── Ticker ── */
function Ticker({ items }) {
  const doubled = [...items, ...items];
  return (
    <div className="ticker-wrapper">
      <div className="ticker-label">🔥 Trending:</div>
      <div className="ticker-track">
        <div className="ticker-inner">
          {doubled.map((item, i) => (
            <span key={i} className="ticker-item">
              {item.text}
              <span className="ticker-tag">{item.tag}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton loader ── */
function LoadingGrid({ count }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:'16px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          height: 120, background:'var(--bg-surface)',
          borderRadius:'var(--radius-lg)', border:'1px solid var(--border-subtle)',
          animation:'shimmer 1.5s ease-in-out infinite',
        }} />
      ))}
    </div>
  );
}
