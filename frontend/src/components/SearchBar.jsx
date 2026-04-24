// ============================================================
//  SearchBar Component
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { STATIC_COURSES } from '../data/staticData.js';

export default function SearchBar() {
  const [query,     setQuery]     = useState('');
  const [results,   setResults]   = useState([]);
  const [open,      setOpen]      = useState(false);
  const [loading,   setLoading]   = useState(false);
  const navigate  = useNavigate();
  const inputRef  = useRef(null);
  const timerRef  = useRef(null);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Debounced search
  const search = useCallback((q) => {
    clearTimeout(timerRef.current);
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    timerRef.current = setTimeout(() => {
      const lowerQ = q.toLowerCase();
      const filtered = STATIC_COURSES.filter(c => 
        c.title.toLowerCase().includes(lowerQ) || 
        c.instructor.toLowerCase().includes(lowerQ) ||
        c.domainLabel.toLowerCase().includes(lowerQ)
      ).slice(0, 6);

      const mappedResults = filtered.map(c => ({
        id: c._id, title: c.title, sub: `by ${c.instructor}`, type: 'course', page: `courses`, emoji: c.emoji
      }));

      setResults(mappedResults);
      setOpen(true);
      setLoading(false);
    }, 150);
  }, []);

  const handleSelect = (item) => {
    setOpen(false);
    setQuery('');
    navigate(`/${item.page}`);
  };

  const typeLabel = { course: 'Course', live: 'Live', domain: 'Domain' };

  return (
    <div className="search-wrapper" id="search-wrapper">
      <div className="search-box">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref={inputRef}
          type="search"
          id="global-search"
          className="search-input"
          placeholder="Search courses, topics, instructors…"
          value={query}
          autoComplete="off"
          aria-label="Search courses"
          onChange={e => { setQuery(e.target.value); search(e.target.value); }}
          onFocus={() => { if (results.length) setOpen(true); }}
        />
        {!loading && <kbd className="search-kbd">⌘K</kbd>}
        {loading  && <span style={{ fontSize:'.7rem', color:'var(--text-muted)' }}>…</span>}
      </div>

      {open && (
        <div className="search-dropdown open" id="search-dropdown" role="listbox">
          {results.length === 0 ? (
            <div className="search-empty">no data found</div>
          ) : (
            <>
              {['course','live','domain'].map(type => {
                const items = results.filter(r => r.type === type);
                if (!items.length) return null;
                const labels = { course:'📚 Courses', live:'🔴 Live Sessions', domain:'🗂 Domains' };
                return (
                  <div key={type}>
                    <div className="search-section-label">{labels[type]}</div>
                    {items.map(item => (
                      <div
                        key={item.id}
                        className="search-item"
                        role="option"
                        tabIndex={0}
                        onClick={() => handleSelect(item)}
                        onKeyDown={e => e.key === 'Enter' && handleSelect(item)}
                      >
                        <div className="search-item-icon">
                          {item.type === 'live'
                            ? <span style={{fontSize:'.75rem',fontWeight:700}}>{item.emoji}</span>
                            : item.emoji}
                        </div>
                        <div className="search-item-text">
                          <strong>{item.title}</strong>
                          <span>{item.sub}</span>
                        </div>
                        <span className="search-item-type">{typeLabel[type]}</span>
                      </div>
                    ))}
                    <div className="search-divider"/>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* Click-outside to close */}
      {open && (
        <div
          style={{ position:'fixed', inset:0, zIndex:99 }}
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
