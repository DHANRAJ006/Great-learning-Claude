// ============================================================
//  CourseCard Component – with video preview on click
// ============================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import VideoPreviewModal from './VideoPreviewModal.jsx';
import QuickInfoModal from './QuickInfoModal.jsx';

const DOMAIN_IMAGES = {
  webdev:      '/images/domains/webdev.png',
  datascience: '/images/domains/datascience.png',
  design:      '/images/domains/design.png',
  mobile:      '/images/domains/mobile.png',
  devops:      '/images/domains/devops.png',
  ai:          '/images/domains/ai.png',
  business:    '/images/domains/business.png',
  cybersec:    '/images/domains/cybersec.png',
};

function starRating(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const { showToast, user, addToRecentlyViewed } = useApp();
  const [showPreview, setShowPreview] = useState(false);
  const [showQuickInfo, setShowQuickInfo] = useState(false);

  const {
    _id, title, instructor, domainLabel, emoji, level,
    rating, reviews, students, duration, price, originalPrice, badge, tags,
    videoUrl,
  } = course;

  const discount = originalPrice && price > 0
    ? Math.round((1 - price / originalPrice) * 100) : 0;

  const handleCardClick = () => {
    addToRecentlyViewed(course); // Track as viewed
    if (!user) {
      showToast('Please sign in to watch previews', 'error');
      navigate('/login');
      return;
    }
    if (videoUrl) {
      setShowQuickInfo(true);
    } else {
      showToast(`▶ Opening "${title.slice(0, 30)}…"`, 'info');
    }
  };

  const handleEnroll = (e) => {
    e.stopPropagation();
    if (!user) {
      showToast('Please sign in to enroll', 'error');
      navigate('/login');
      return;
    }
    
    if (price === 0) {
      showToast(`🎉 Enrolled in "${title.slice(0, 40)}…"`, 'success');
      return;
    }
    
    navigate(`/checkout/${_id}`);
  };

  return (
    <>
      <div className="course-card" role="listitem" tabIndex={0}
           aria-label={title} onClick={handleCardClick}
           style={{ cursor: 'pointer' }}>

        <div style={{ position: 'relative' }}>
          {/* Thumbnail with play button overlay */}
          <div className="course-thumb-placeholder" style={{ 
            position: 'relative',
            backgroundImage: `url(${DOMAIN_IMAGES[course.domain] || DOMAIN_IMAGES['webdev']})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
            {videoUrl && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.35)',
                borderRadius: 'inherit',
                opacity: 0,
                transition: 'opacity 0.2s',
              }} className="play-overlay">
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: price > 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.92)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem',
                  border: price > 0 ? '1px solid rgba(255,255,255,0.3)' : 'none'
                }}>{price > 0 ? '🔒' : '▶'}</div>
              </div>
            )}
          </div>

          {badge && (
            <div className="course-badge-row">
              <span className={`course-badge badge-${badge}`}>
                {badge.charAt(0).toUpperCase() + badge.slice(1)}
              </span>
            </div>
          )}
          {discount > 0 && (
            <div style={{
              position:'absolute', top:'var(--space-3)', right:'var(--space-3)',
              background:'hsl(0,75%,58%)', color:'#fff',
              fontSize:'.7rem', fontWeight:700, padding:'2px 7px',
              borderRadius:'var(--radius-full)',
            }}>-{discount}%</div>
          )}
        </div>

        <div className="course-body">
          <div className="course-domain-tag">{domainLabel}</div>
          <div className="course-title">{title}</div>
          <div className="course-instructor">by {instructor}</div>
          <div className="course-meta">
            <div className="course-rating">
              <span className="stars">{starRating(rating)}</span>
              <span className="rating-val">{rating} ({(reviews/1000).toFixed(1)}K)</span>
            </div>
            <span className={`level-pill level-${level}`}>{level}</span>
          </div>
          <div className="course-meta">
            <span className="course-duration">⏱ {duration}</span>
            <span className="course-students">👥 {students} students</span>
          </div>
        </div>

        <div className="course-footer">
          <div>
            {price === 0 ? (
              <span className="course-price course-price-free">FREE</span>
            ) : (
              <>
                <span className="course-price">₹{price.toLocaleString('en-IN')}</span>
                {originalPrice && (
                  <span className="course-price-original">₹{originalPrice.toLocaleString('en-IN')}</span>
                )}
              </>
            )}
          </div>
          <button className="course-enroll-btn" onClick={handleEnroll}>
            {price === 0 ? 'Details & Video' : 'Enrol Now'}
          </button>
        </div>
      </div>

      {showPreview && (
        <VideoPreviewModal
          title={title}
          videoUrl={videoUrl}
          courseId={_id}
          instructor={instructor}
          whatYoullLearn={course.whatYoullLearn}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showQuickInfo && (
        <QuickInfoModal
          course={course}
          onClose={() => setShowQuickInfo(false)}
        />
      )}

      <style>{`
        .course-card:hover .play-overlay { opacity: 1 !important; }
      `}</style>
    </>
  );
}
