// ============================================================
//  VideoPreviewModal – Video + Achievement Tracking + Certificate UI
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.jsx';
import CertModal from './CertModal.jsx';

export default function VideoPreviewModal({ title, videoUrl, onClose, courseId, instructor, whatYoullLearn }) {
  const { user, updateUserProgress, recentlyViewed } = useApp();
  const [showCertificate, setShowCertificate] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isEligible, setIsEligible] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSurveyComplete, setIsSurveyComplete] = useState(!!user?.name);
  
  // YouTube API State
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);

  // 1. Initialize Progress from recentlyViewed if available
  useEffect(() => {
    const saved = recentlyViewed.find(c => (c._id || c.courseId) === courseId);
    if (saved?.progress) {
      setProgress(saved.progress);
      if (saved.progress >= 85) setIsEligible(true);
    }
  }, [courseId, recentlyViewed]);

  // 2. Handle YouTube API
  useEffect(() => {
    // Load YouTube API script if not present
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    let interval;

    window.onYouTubeIframeAPIReady = () => {
      createPlayer();
    };

    const createPlayer = () => {
      const videoId = extractYoutubeId(videoUrl);
      if (!videoId) return;

      playerRef.current = new window.YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: (event) => {
            setPlayerReady(true);
            startTracking();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              startTracking();
            } else {
              clearInterval(interval);
            }
          }
        }
      });
    };

    const startTracking = () => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (playerRef.current && playerRef.current.getDuration) {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          if (duration > 0) {
            const p = Math.floor((currentTime / duration) * 100);
            setProgress(prev => {
              const newProgress = Math.max(prev, p);
              if (newProgress >= 85) setIsEligible(true);
              return newProgress;
            });
          }
        }
      }, 2000);
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    }

    return () => {
      clearInterval(interval);
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoUrl]);

  // 3. Sync Progress to Context
  useEffect(() => {
    if (progress > 0) {
      updateUserProgress(courseId, progress);
    }
  }, [progress, courseId, updateUserProgress]);

  const extractYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSurveySubmit = (e) => {
    e.preventDefault();
    if (name.trim()) setIsSurveyComplete(true);
  };

  return (
    <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.95)', zIndex: 9999 }}>
      <div className="modal-content video-modal" style={{ maxWidth: '1100px', width: '95%', padding: 0, overflow: 'hidden', background: '#0a0a0a' }}>
        <button className="modal-close" onClick={onClose} style={{ top: '15px', right: '15px', color: '#fff', fontSize: '2rem' }}>&times;</button>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', height: '100%' }}>
          {/* Main Video Area */}
          <div style={{ flex: '1 1 700px', minHeight: '400px', background: '#000', position: 'relative' }}>
            <div id="yt-player" style={{ width: '100%', height: '100%' }}></div>
            
            {/* Progress Bar Overlay */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.1)' }}>
              <div style={{ 
                width: `${progress}%`, height: '100%', 
                background: isEligible ? '#10b981' : 'var(--accent-1)', 
                transition: 'width 0.5s ease' 
              }}></div>
            </div>
          </div>

          {/* Achievement Sidebar */}
          <div style={{ 
            flex: '1 1 300px', padding: 'var(--space-8)', 
            background: 'linear-gradient(180deg, #111827 0%, #000 100%)',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', flexDirection: 'column'
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 'var(--space-2)', color: '#fff' }}>{title}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-4)' }}>Instructor: {instructor}</p>

            {/* ── Detailed 'What you'll learn' ── */}
            <div style={{ 
              marginBottom: 'var(--space-6)', 
              padding: 'var(--space-4)', 
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>What you'll learn</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(whatYoullLearn || [
                  'Master core concepts and advanced techniques',
                  'Build real-world projects for your portfolio',
                  'Learn best practices from industry experts'
                ]).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent-1)', fontSize: '0.9rem' }}>✓</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {!isSurveyComplete ? (
              <form onSubmit={handleSurveySubmit} style={{ marginBottom: 'var(--space-8)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                  Enter your name as you'd like it to appear on your certificate:
                </p>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  style={{ 
                    width: '100%', padding: '12px', borderRadius: '8px', 
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', marginBottom: '12px', outline: 'none'
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Name</button>
              </form>
            ) : (
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span>Course Progress</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: isEligible ? '#10b981' : 'var(--accent-1)', transition: 'width 0.5s ease' }}></div>
                </div>
              </div>
            )}

            <div style={{ 
              marginTop: 'auto', padding: 'var(--space-6)', borderRadius: '16px',
              background: isEligible ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isEligible ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.1)'}`,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{isEligible ? '🏆' : '🔒'}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>
                {isEligible ? 'Certificate Unlocked!' : 'Certificate Locked'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                {isEligible 
                  ? 'Congratulations! You have completed more than 85% of the session.' 
                  : 'Watch at least 85% of the video to unlock your official course certificate.'}
              </p>
              <button 
                disabled={!isEligible}
                onClick={() => setShowCertificate(true)}
                className={`btn ${isEligible ? 'btn-primary' : 'btn-ghost'}`}
                style={{ width: '100%', opacity: isEligible ? 1 : 0.5 }}
              >
                {isEligible ? 'Download Certificate' : `${85 - progress}% More to Go`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCertificate && (
        <CertModal 
          onClose={() => setShowCertificate(false)} 
          user={{ ...user, name: name }} 
          courseTitle={title}
          instructor={instructor}
        />
      )}
    </div>
  );
}
