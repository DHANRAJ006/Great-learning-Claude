// ============================================================
//  CourseCard Component
// ============================================================
import React from 'react';
import { useApp } from '../context/AppContext.jsx';

function starRating(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

export default function CourseCard({ course }) {
  const { showToast } = useApp();
  const {
    _id, title, instructor, domainLabel, emoji, level,
    rating, reviews, students, duration, price, originalPrice, badge, tags,
  } = course;

  const discount = originalPrice && price > 0
    ? Math.round((1 - price / originalPrice) * 100) : 0;

  const handleEnroll = (e) => {
    e.stopPropagation();
    showToast(`🎉 Enrolled in "${title.slice(0, 40)}…"`, 'success');
  };

  return (
    <div className="course-card" role="listitem" tabIndex={0}
         aria-label={title} onClick={handleEnroll}>

      <div style={{ position: 'relative' }}>
        <div className="course-thumb-placeholder">{emoji}</div>

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
          {price === 0 ? 'Enrol Free' : 'Enrol Now'}
        </button>
      </div>
    </div>
  );
}
