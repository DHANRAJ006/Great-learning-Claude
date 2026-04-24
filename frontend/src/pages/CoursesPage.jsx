// ============================================================
//  CoursesPage – Sidebar Tree + Course Display
// ============================================================
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch.js';
import CourseCard   from '../components/CourseCard.jsx';
import { STATIC_COURSES } from '../data/staticData.js';

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

const COURSE_TREE = [
  { id:'webdev',      label:'Web Development',       count:3, children:[{id:'frontend',label:'Frontend',count:2},{id:'backend',label:'Backend',count:1},{id:'fullstack',label:'Full Stack',count:1},{id:'sysdesign',label:'System Design',count:1}] },
  { id:'datascience', label:'Data Science',           count:3, children:[{id:'python-ds',label:'Python & Analytics',count:1},{id:'sql-db',label:'Databases',count:1},{id:'bi-tools',label:'BI & Visualization',count:1},{id:'stats',label:'Statistics',count:1}] },
  { id:'ai',          label:'AI & Machine Learning',  count:3, children:[{id:'deep-learning',label:'Deep Learning',count:1},{id:'nlp',label:'NLP',count:1},{id:'gen-ai',label:'Generative AI',count:1},{id:'mlops',label:'MLOps',count:1}] },
  { id:'design',      label:'UI/UX Design',           count:2, children:[{id:'figma',label:'Figma',count:1},{id:'ux-research',label:'UX Research',count:1},{id:'motion',label:'Motion Design',count:1}] },
  { id:'mobile',      label:'Mobile Development',     count:2, children:[{id:'flutter',label:'Flutter',count:1},{id:'react-native',label:'React Native',count:1},{id:'ios-swift',label:'iOS / Swift',count:1}] },
  { id:'devops',      label:'DevOps & Cloud',         count:2, children:[{id:'docker-k8s',label:'Docker & Kubernetes',count:1},{id:'aws',label:'AWS',count:1},{id:'cicd',label:'CI/CD Pipelines',count:1}] },
  { id:'cybersec',    label:'Cyber Security',         count:2, children:[{id:'ethical-hack',label:'Ethical Hacking',count:1},{id:'network-sec',label:'Network Security',count:1},{id:'cloud-sec',label:'Cloud Security',count:1}] },
  { id:'business',    label:'Business & Leadership',  count:2, children:[{id:'product-mgmt',label:'Product Management',count:1},{id:'startup',label:'Startup & Growth',count:1},{id:'finance',label:'Finance Basics',count:1}] },
];

export default function CoursesPage() {
  const [searchParams] = useSearchParams();
  const domainParam = searchParams.get('domain');

  const [openCat,   setOpenCat]   = useState(domainParam || null);
  const [activeCat, setActiveCat] = useState(domainParam || null);

  // If domainParam changes, update active category
  useEffect(() => {
    if (domainParam) {
      setOpenCat(domainParam);
      setActiveCat(domainParam);
    }
  }, [domainParam]);
  const [sort,      setSort]      = useState('popular');
  const [viewMode,  setViewMode]  = useState('grid');
  const [treeQuery, setTreeQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');

  const coursesUrl = activeCat
    ? `/api/courses?domain=${activeCat}&sort=${sort}`
    : `/api/courses?sort=${sort}`;

  const { data, loading } = useFetch(coursesUrl);
  const fetchedCourses = data?.data || [];

  // Use API data if available, fall back to static data
  const baseCourses = fetchedCourses.length > 0 ? fetchedCourses : STATIC_COURSES;

  // Filter by selected category
  const categoryCourses = activeCat
    ? baseCourses.filter(c => c.domain === activeCat)
    : baseCourses;

  // Filter by price
  const courses = categoryCourses.filter(c => {
    if (priceFilter === 'free') return c.price === 0;
    if (priceFilter === 'paid') return c.price > 0;
    return true;
  });

  // Sort
  const sortedCourses = useMemo(() => {
    const arr = [...courses];
    if (sort === 'rating')     return arr.sort((a,b) => b.rating - a.rating);
    if (sort === 'price-low')  return arr.sort((a,b) => a.price - b.price);
    if (sort === 'newest')     return arr.sort((a,b) => (b._id > a._id ? 1 : -1));
    return arr; // popular — default order
  }, [courses, sort]);

  const filteredTree = useMemo(() =>
    treeQuery
      ? COURSE_TREE.filter(c =>
          c.label.toLowerCase().includes(treeQuery.toLowerCase()) ||
          c.children.some(s => s.label.toLowerCase().includes(treeQuery.toLowerCase()))
        )
      : COURSE_TREE,
    [treeQuery]
  );

  const toggleCat = (catId) => {
    setOpenCat(prev => prev === catId ? null : catId);
    setActiveCat(prev => prev === catId ? null : catId);
  };

  return (
    <section id="page-courses" className="page active" aria-label="All courses">
      <div className="page-header">
        <h1 className="page-title">All Courses</h1>
        <p className="page-subtitle">Explore our complete library — <span>{sortedCourses.length}</span> courses {activeCat ? `in "${COURSE_TREE.find(c=>c.id===activeCat)?.label}"` : 'across all domains'}</p>
      </div>

      <div className="courses-page-layout">

        {/* ── Sidebar ── */}
        <aside className="courses-sidebar" aria-label="Course categories">
          <div className="sidebar-search">
            <input
              type="search"
              className="sidebar-search-input"
              placeholder="Filter topics…"
              value={treeQuery}
              onChange={e => setTreeQuery(e.target.value)}
              aria-label="Filter topics"
            />
          </div>

          <div className="sidebar-tree" role="tree">
            {filteredTree.map(cat => (
              <div key={cat.id} className="tree-category">
                <div
                  className={`tree-category-header${openCat === cat.id ? ' open' : ''}${activeCat === cat.id ? ' active' : ''}`}
                  role="treeitem"
                  aria-expanded={openCat === cat.id}
                  tabIndex={0}
                  onClick={() => toggleCat(cat.id)}
                  onKeyDown={e => e.key === 'Enter' && toggleCat(cat.id)}
                >
                  <span>
                    <div className="tree-category-thumb">
                      <img src={DOMAIN_IMAGES[cat.id]} alt="" />
                    </div>
                    {cat.label}
                  </span>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span className="tree-count">{cat.count}</span>
                    <svg className="tree-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </div>

                <div className={`tree-subcategories${openCat === cat.id ? ' open' : ''}`} id={`sub-${cat.id}`}>
                  {cat.children.map(sub => (
                    <div
                      key={sub.id}
                      className="tree-subitem"
                      role="treeitem" tabIndex={-1}
                      onClick={() => setActiveCat(cat.id)}
                    >
                      <span>{sub.label}</span>
                      <span className="tree-subitem-count">{sub.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="courses-main-content">
          <div className="courses-toolbar">
            <div className="toolbar-left">
              <span className="results-count">
                Showing <strong>{sortedCourses.length}</strong> courses
              </span>
            </div>
            <div className="toolbar-right">
              <div className="view-toggle" role="group" aria-label="Price Filter" style={{ marginRight: '16px' }}>
                <button className={`view-btn${priceFilter==='all'?' active':''}`} onClick={()=>setPriceFilter('all')}>All</button>
                <button className={`view-btn${priceFilter==='free'?' active':''}`} onClick={()=>setPriceFilter('free')}>Free</button>
                <button className={`view-btn${priceFilter==='paid'?' active':''}`} onClick={()=>setPriceFilter('paid')}>Paid</button>
              </div>
              <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort courses">
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
              </select>

              <div className="view-toggle" role="group" aria-label="View mode">
                <button className={`view-btn${viewMode==='grid'?' active':''}`} onClick={()=>setViewMode('grid')} title="Grid view" aria-pressed={viewMode==='grid'}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                </button>
                <button className={`view-btn${viewMode==='list'?' active':''}`} onClick={()=>setViewMode('list')} title="List view" aria-pressed={viewMode==='list'}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="3" rx="1"/><rect x="3" y="10.5" width="18" height="3" rx="1"/><rect x="3" y="17" width="18" height="3" rx="1"/></svg>
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'20px' }}>
              {Array.from({length:6}).map((_,i) => (
                <div key={i} style={{ height:340, background:'var(--bg-surface)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border-subtle)' }} />
              ))}
            </div>
          ) : sortedCourses.length === 0 ? (
            <div style={{ textAlign:'center', padding:'var(--space-16)', color:'var(--text-muted)' }}>
              <div style={{ fontSize:'3rem', marginBottom:'16px' }}>🔍</div>
              <p style={{ fontWeight:600, fontSize:'1.1rem' }}>No courses found</p>
              <p>Try selecting a different category.</p>
            </div>
          ) : (
            <div className={`courses-display ${viewMode === 'grid' ? 'grid-mode' : 'list-mode'}`} role="list">
              {sortedCourses.map(c => <CourseCard key={c._id} course={c} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
