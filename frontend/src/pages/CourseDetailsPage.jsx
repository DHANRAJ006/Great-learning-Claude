// ============================================================
//  CourseDetailsPage – Detailed view with Live AI Summary
// ============================================================
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch.js';
import CourseCard from '../components/CourseCard.jsx';
import VideoPreviewModal from '../components/VideoPreviewModal.jsx';
import { useApp } from '../context/AppContext.jsx';
import { STATIC_COURSES } from '../data/staticData.js';
import { useLocation } from 'react-router-dom';

function PaymentModal({ course, onClose, onComplete }) {
  const [method, setMethod] = React.useState('card');
  const [loading, setLoading] = React.useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onComplete();
    }, 2000);
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 10001 }}>
      <div className="modal-content" style={{ maxWidth: '450px', padding: 'var(--space-8)' }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>💳</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Complete Payment</h2>
          <p style={{ color: 'var(--text-secondary)' }}>You are enrolling in: <br/><strong>{course.title}</strong></p>
        </div>

        <div style={{ background: 'var(--bg-surface-2)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Course Price:</span>
            <span>₹{course.price.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent-1)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
            <span>Total Payable:</span>
            <span>₹{course.price.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--space-6)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Payment Method</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button 
              className={`btn ${method === 'card' ? 'btn-primary' : 'btn-ghost'}`} 
              onClick={() => setMethod('card')}
              style={{ fontSize: '0.9rem' }}
            >
              Credit/Debit Card
            </button>
            <button 
              className={`btn ${method === 'upi' ? 'btn-primary' : 'btn-ghost'}`} 
              onClick={() => setMethod('upi')}
              style={{ fontSize: '0.9rem' }}
            >
              UPI / QR Code
            </button>
          </div>
        </div>

        {method === 'card' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 'var(--space-6)' }}>
            <input type="text" placeholder="Card Number" className="input-field" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input type="text" placeholder="MM/YY" className="input-field" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }} />
              <input type="text" placeholder="CVV" className="input-field" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }} />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)', padding: 'var(--space-4)', background: '#fff', borderRadius: '12px', border: '1px solid #ddd' }}>
             <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=LearnFlowPayment" alt="QR Code" style={{ width: '150px', height: '150px' }} />
             <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '8px' }}>Scan with any UPI App (GPay, PhonePe, etc.)</p>
          </div>
        )}

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', padding: 'var(--space-3)', fontSize: '1.1rem' }}
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? 'Processing Payment...' : `Pay ₹${course.price.toLocaleString('en-IN')}`}
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-4)' }}>
          Secure 256-bit SSL Encrypted Payment
        </p>
      </div>
    </div>
  );
}

export default function CourseDetailsPage() {
  // ── 1. Hooks (Must be at top level) ───────────────────────
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast, user, addToRecentlyViewed } = useApp();
  const [showVideo, setShowVideo] = React.useState(false);
  const [showPayment, setShowPayment] = React.useState(false);
  const [isPlayingInline, setIsPlayingInline] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const playerRef = React.useRef(null);
  
  const { data: courseData, loading: courseLoading } = useFetch(`/api/courses/${id}`);
  
  // Try to get course from API, fallback to static data if not found
  const course = courseData?.data || STATIC_COURSES.find(c => c._id === id);

  // Fetch related courses
  const { data: relatedData, loading: relatedLoading } = useFetch(
    course ? `/api/courses?domain=${course.domain}&sort=popular` : null
  );

  // YouTube API Tracking Effect
  React.useEffect(() => {
    if (isPlayingInline && course) {
      let interval;
      
      const initPlayer = () => {
        if (window.YT && window.YT.Player) {
          playerRef.current = new window.YT.Player('inline-player', {
            events: {
              onReady: () => {
                interval = setInterval(() => {
                  if (playerRef.current?.getCurrentTime) {
                    setCurrentTime(playerRef.current.getCurrentTime());
                  }
                }, 1000);
              }
            }
          });
        }
      };

      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        window.onYouTubeIframeAPIReady = initPlayer;
      }

      return () => {
        if (interval) clearInterval(interval);
        if (playerRef.current?.destroy) playerRef.current.destroy();
      };
    }
  }, [isPlayingInline, course]);

  // Track as recently viewed
  React.useEffect(() => {
    if (course) addToRecentlyViewed(course);
  }, [course, addToRecentlyViewed]);

  // ── 2. Conditional Returns ────────────────────────────────
  if (courseLoading) return <div style={{ padding: '100px', textAlign: 'center' }}><h2>Loading...</h2></div>;
  if (!course) return <div style={{ padding: '100px', textAlign: 'center' }}><h2>Course not found</h2></div>;

  // ── 3. Helper Functions & Derived Data ───────────────────
  const extractYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleEnroll = () => {
    addToRecentlyViewed(course);
    if (!user) {
      showToast('Please sign in to enroll', 'info');
      navigate('/login', { state: { from: location } });
      return;
    }
    
    if (course.price > 0) {
      setShowPayment(true);
      return;
    }
    
    showToast(`🎉 Enrolled in "${course.title.slice(0, 40)}…"`, 'success');
    setIsPlayingInline(true);
  };

  const handlePaymentComplete = () => {
    setShowPayment(false);
    showToast(`✅ Payment Successful! Enrolled in "${course.title.slice(0, 30)}…"`, 'success');
    setIsPlayingInline(true);
  };

  const getAIInsight = () => {
    if (currentTime < 10) return `Introduction: Setting the stage for ${course.title}.`;
    if (currentTime < 30) return "Core Concepts: Explaining the architectural patterns used in this domain.";
    if (currentTime < 60) return "Practical Example: Demonstrating a real-world use case for maximum clarity.";
    return "Next Steps: How to apply these learnings in your upcoming projects.";
  };

  const relatedCourses = (relatedData?.data || []).filter(c => c._id !== id).slice(0, 4);

  // ── 4. Render ──────────────────────────────────────────────
  return (
    <section className="page active" style={{ padding: 'var(--space-8)' }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 'var(--space-4)' }}>
        ← Back
      </button>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
        {/* Left side: Demo Video */}
        <div style={{ flex: '1 1 600px', backgroundColor: 'var(--bg-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
          <div 
            style={{ 
              position: 'relative', width: '100%', paddingTop: '56.25%', 
              backgroundColor: '#000', borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden', marginBottom: 'var(--space-4)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {isPlayingInline && course.price === 0 ? (
              <iframe 
                id="inline-player"
                src={`https://www.youtube.com/embed/${extractYoutubeId(course.videoUrl)}?enablejsapi=1&autoplay=1`}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            ) : (
              <div 
                onClick={() => {
                  if (course.price > 0) {
                    showToast('🔒 Enrol now to unlock this course video!', 'info');
                    return;
                  }
                  setIsPlayingInline(true);
                }}
                style={{ 
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(/images/domains/${course.domain}.png)`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  cursor: course.price > 0 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  background: course.price > 0 ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {course.price > 0 ? (
                    <div style={{
                      width: 70, height: 70, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '2rem', border: '2px solid rgba(255,255,255,0.3)'
                    }}>🔒</div>
                  ) : (
                    <div style={{
                      width: 70, height: 70, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.8rem', color: '#000', paddingLeft: '5px'
                    }}>▶</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>{course.title}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>by {course.instructor} • {course.domainLabel}</p>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <span style={{ marginRight: '16px' }}>⭐ {course.rating} ({course.reviews} reviews)</span>
            <span style={{ marginRight: '16px' }}>👥 {course.students} students</span>
          </div>

          {/* ── What you'll learn ── */}
          <div style={{ 
            marginTop: 'var(--space-8)', 
            padding: 'var(--space-6)', 
            backgroundColor: 'rgba(255,255,255,0.03)', 
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 'var(--space-4)' }}>What you'll learn</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
              gap: 'var(--space-3)' 
            }}>
              {(course.whatYoullLearn || [
                'Master core concepts and advanced techniques',
                'Build real-world projects for your portfolio',
                'Learn best practices from industry experts',
                'Gain hands-on experience with modern tools'
              ]).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent-1)', fontSize: '1rem' }}>✓</span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side: AI Summary */}
        <div style={{ 
          flex: '1 1 300px',
          backgroundColor: 'var(--bg-surface-2)', 
          padding: 'var(--space-6)', 
          borderRadius: 'var(--radius-xl)', 
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
            <span style={{ fontSize: '1.5rem' }}>✨</span>
            <h3 style={{ margin: 0, background: 'linear-gradient(90deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Summary (Live)
            </h3>
          </div>
          <div style={{ 
            padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', 
            borderLeft: '4px solid var(--accent-1)', marginBottom: '16px'
          }}>
            <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>
              Current Insight:
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {getAIInsight()}
            </p>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, fontSize: '0.88rem' }}>
            Based on live tracking, you are exploring the curriculum effectively. This intensive course helps you master <strong>{course.title.split(':')[0]}</strong> quickly.
          </p>
          
          <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span>Difficulty:</span> <strong style={{textTransform: 'capitalize'}}>{course.level}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span>Duration:</span> <strong>{course.duration}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', fontSize: '1.2rem' }}>
              <span>Price:</span> <strong>{course.price === 0 ? 'FREE' : `₹${course.price.toLocaleString('en-IN')}`}</strong>
            </div>
          </div>

          {course.price > 0 && (
            <button 
              onClick={handleEnroll}
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: 'var(--space-6)', padding: 'var(--space-3)', fontSize: '1.1rem' }}
            >
              Enrol Now
            </button>
          )}
          {course.price === 0 && (
            <div style={{ 
              marginTop: 'var(--space-6)', 
              padding: 'var(--space-4)', 
              textAlign: 'center', 
              background: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              fontWeight: 700
            }}>
              ✓ This course is currently FREE
            </div>
          )}
        </div>
      </div>

      {/* ── Detailed Timeline / Curriculum ── */}
      <div style={{ marginBottom: 'var(--space-12)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--space-6)' }}>Course Timeline & Curriculum</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {[
            { title: 'Module 1: Introduction & Fundamentals', duration: '2h 15m', lessons: 5 },
            { title: 'Module 2: Core Implementation & Deep Dive', duration: '5h 40m', lessons: 12 },
            { title: 'Module 3: Advanced Techniques & Optimization', duration: '4h 20m', lessons: 8 },
            { title: 'Module 4: Real-world Projects & Case Studies', duration: '8h 10m', lessons: 15 }
          ].map((mod, i) => (
            <div key={i} style={{ 
              backgroundColor: 'var(--bg-surface)', 
              padding: 'var(--space-5)', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateX(8px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
            onClick={() => {
              if (course.price > 0) {
                showToast('🔒 This module is locked. Enrol to unlock!', 'info');
                return;
              }
              setIsPlayingInline(true);
              showToast(`▶ Loading ${mod.title}...`, 'info');
            }}
          >
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>{mod.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{mod.lessons} lessons • {mod.duration}</p>
              </div>
              <div style={{ color: 'var(--accent-1)', fontSize: '1.2rem' }}>⌄</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Courses */}
      <h2 className="section-title">Related Courses in {course.domainLabel}</h2>
      {relatedLoading ? (
        <p>Loading recommendations...</p>
      ) : (
        <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
          {relatedCourses.map(c => <CourseCard key={c._id} course={c} />)}
        </div>
      )}

      {showVideo && (
        <VideoPreviewModal
          title={course.title}
          videoUrl={course.videoUrl}
          courseId={course._id}
          instructor={course.instructor}
          whatYoullLearn={course.whatYoullLearn}
          onClose={() => setShowVideo(false)}
        />
      )}
      {showPayment && (
        <PaymentModal 
          course={course} 
          onClose={() => setShowPayment(false)} 
          onComplete={handlePaymentComplete}
        />
      )}
    </section>
  );
}
