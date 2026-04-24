// ============================================================
//  HomePage – Ticker, Domain Grid, Recommended, Continue
// ============================================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch }          from '../hooks/useFetch.js';
import { useApp }            from '../context/AppContext.jsx';
import CourseCard            from '../components/CourseCard.jsx';
import VideoPreviewModal     from '../components/VideoPreviewModal.jsx';
import AIChatBot             from '../components/AIChatBot.jsx';
import CertModal             from '../components/CertModal.jsx';
import { STATIC_DOMAINS, STATIC_COURSES } from '../data/staticData.js';

// Representative video URL per domain for Browse-by-Domain preview
const DOMAIN_VIDEOS = {
  webdev:      { url: 'https://www.youtube.com/watch?v=Sklc_fQBmcs', label: 'Web Dev Preview' },
  datascience: { url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI', label: 'Data Science Preview' },
  design:      { url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', label: 'UI/UX Design Preview' },
  mobile:      { url: 'https://www.youtube.com/watch?v=VPvVD8t02U8', label: 'Mobile Dev Preview' },
  devops:      { url: 'https://www.youtube.com/watch?v=X48VuDVv0do', label: 'DevOps & Cloud Preview' },
  ai:          { url: 'https://www.youtube.com/watch?v=ySus5ZS0b94', label: 'AI & ML Preview' },
  business:    { url: 'https://www.youtube.com/watch?v=64oxP6Klb20', label: 'Business Preview' },
  cybersec:    { url: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', label: 'Cyber Security Preview' },
};

const DOMAIN_IMAGES = {
  webdev:      '/images/domains/webdev.png?v=1',
  datascience: '/images/domains/datascience.png?v=2',
  design:      '/images/domains/design.png?v=1',
  mobile:      '/images/domains/mobile.png?v=1',
  devops:      '/images/domains/devops.png?v=1',
  ai:          '/images/domains/ai.png?v=2',
  business:    '/images/domains/business.png?v=1',
  cybersec:    '/images/domains/cybersec.png?v=1',
};

const TICKER_ITEMS = [
  { text: 'React 19 Server Components — New Session Added',   tag: 'New'      },
  { text: '10K+ enrolled in Python ML Bootcamp this week',    tag: 'Trending' },
  { text: 'System Design sold out — next batch 24 Apr',       tag: 'Alert'    },
  { text: 'Free SQL + MongoDB course now live',               tag: 'Free'     },
  { text: 'LangChain RAG workshop — join now',                tag: 'Live'     },
  { text: 'New: Generative AI & LLM Engineering track',       tag: 'New'      },
  { text: 'Flutter Animations session — Today 9 PM IST',      tag: 'Upcoming' },
  { text: '50,000 certificates earned in March!',             tag: '🎉'       },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { showToast, user, recentlyViewed } = useApp();
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [preview, setPreview] = useState(null); // { title, videoUrl, courseId, instructor }
  const [showChat, setShowChat] = useState(false);
  const [showCert, setShowCert] = useState(false);

  // Fetch domains and courses
  const { data: domainsData, loading: domainsLoading } = useFetch('/api/domains');
  const { data: coursesData, loading: coursesLoading } = useFetch('/api/courses?sort=popular');

  // Use API data if available, else fall back to static data
  const domains    = domainsData?.data?.length ? domainsData.data : STATIC_DOMAINS;
  const allCourses = coursesData?.data?.length ? coursesData.data : STATIC_COURSES;

  const recommended = allCourses.slice(0, 6);

  // Use real-time tracking for Continue Learning
  const inProgress = recentlyViewed.length > 0 ? recentlyViewed : [
    { _id:'c1', emoji:'⚛️', title:'React 19 & Next.js 15',      instructor:'Priya Sharma', progress:68, domain: 'webdev' },
    { _id:'c4', emoji:'🤖', title:'Generative AI & LLMs',        instructor:'Rahul Kapoor', progress:32, domain: 'ai' },
  ];

  const handleDomainClick = (domainId) => {
    navigate(`/courses?domain=${domainId}`);
  };

  return (
    <section id="page-home" className="page active" aria-label="Home page">

      {/* ── Hero ── */}
      <div className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <HeroCarousel />
        <div className="hero-glow"></div>
        <div className="hero-inner">
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
              <div className="floating-card card-1"
                 onClick={() => document.dispatchEvent(new Event('toggleAIChat'))}
                role="button" tabIndex={0} style={{cursor:'pointer'}}>
                <div className="fc-icon">🎯</div>
                <div className="fc-text"><strong>AI Mentorship</strong><span>24/7 doubt clearing</span></div>
              </div>
              <div className="floating-card card-2"
                onClick={() => {
                  if (!user) {
                    showToast('Please sign in to view certificates', 'error');
                    navigate('/login');
                    return;
                  }
                  setShowCert(true);
                }}
                role="button" tabIndex={0} style={{cursor:'pointer'}}>
                <div className="fc-icon">🏆</div>
                <div className="fc-text"><strong>Certificate Earned!</strong><span>React Advanced</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ticker ── */}
      <Ticker items={TICKER_ITEMS} />

      {/* ── Domains ── */}
      <section className="section domain-section">
        <h2 className="section-title">Browse by Domain</h2>
        <p style={{ fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'16px', marginTop:'-8px' }}>
          Explore our wide range of expert-led courses across all major domains
        </p>
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
                onClick={() => handleDomainClick(d.domainId)}
                onKeyDown={e => e.key === 'Enter' && handleDomainClick(d.domainId)}
                style={{ position: 'relative' }}
              >
                <div className="domain-thumb-wrap">
                  <img src={DOMAIN_IMAGES[d.domainId]} alt={d.name} className="domain-thumb" />
                  <div className="domain-overlay"></div>
                </div>
                <div className="domain-name-bar">
                  <span className="domain-name">{d.name}</span>
                </div>
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
        ) : recommended.length === 0 ? (
          <p style={{ color:'var(--text-secondary)', padding:'24px 0' }}>No courses found.</p>
        ) : (
          <div className="courses-grid" role="list">
            {recommended.map(c => <CourseCard key={c._id} course={c} />)}
          </div>
        )}
      </section>

      {/* ── Continue Learning ── */}
      {user && (
        <section className="section continue-section">
          <h2 className="section-title">Continue Learning</h2>
          <div className="continue-grid" role="list">
            {inProgress.map((c, i) => (
              <div
                key={i} className="continue-card" role="listitem" tabIndex={0}
                onClick={() => {
                  if (c.videoUrl) {
                    setPreview({ 
                      title: c.title, 
                      videoUrl: c.videoUrl, 
                      courseId: c._id || c.courseId, 
                      instructor: c.instructor 
                    });
                  } else {
                    navigate(`/course/${c._id || c.courseId}`);
                  }
                }}
              >
                <div className="continue-thumb-wrap">
                  <img src={DOMAIN_IMAGES[c.domain] || '/images/domains/webdev.png'} alt="" className="continue-thumb-img" />
                  <div className="continue-play-overlay">▶</div>
                </div>
                <div className="continue-info">
                  <div className="continue-title">{c.title}</div>
                  <div className="continue-instructor">{c.instructor}</div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${c.progress || 25}%` }}></div>
                    </div>
                    <span className="progress-pct">{c.progress || 25}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Video Preview Modal ── */}
      {preview && (
        <VideoPreviewModal
          title={preview.title}
          videoUrl={preview.videoUrl}
          courseId={preview.courseId}
          instructor={preview.instructor}
          onClose={() => setPreview(null)}
        />
      )}

      {/* ── AI ChatBot ── */}
      {showChat && <AIChatBot onClose={() => setShowChat(false)} />}

      {/* ── Certificate Modal ── */}
      {showCert && <CertModal onClose={() => setShowCert(false)} user={user} />}
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

/* ── Hero Background Carousel ── */
function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const images = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  ];

  useEffect(() => {
    const int = setInterval(() => {
      setIdx(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(int);
  }, [images.length]);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', background: '#0a0a1a' }}>
      {images.map((src, i) => (
        <div key={src} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: idx === i ? 0.35 : 0, 
          transition: 'opacity 1.5s ease-in-out',
          transform: idx === i ? 'scale(1.05)' : 'scale(1)', 
          animation: idx === i ? 'panImage 10s linear forwards' : 'none'
        }} />
      ))}
      <style>{`@keyframes panImage { 0% { background-position: center; } 100% { background-position: right center; } }`}</style>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--bg-main) 10%, transparent 60%, transparent 80%, var(--bg-main) 100%), linear-gradient(to bottom, var(--bg-main) 5%, transparent 30%, transparent 80%, var(--bg-main) 100%)' }} />
    </div>
  );
}
