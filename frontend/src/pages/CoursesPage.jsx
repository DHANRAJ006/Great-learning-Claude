// ============================================================
//  CoursesPage – Sidebar Tree + Course Display
// ============================================================
import React, { useState, useMemo } from 'react';
import { useFetch } from '../hooks/useFetch.js';
import CourseCard   from '../components/CourseCard.jsx';

const COURSE_TREE = [
  { id:'webdev',      label:'Web Development',       emoji:'🌐', count:248, children:[{id:'frontend',label:'Frontend',count:98},{id:'backend',label:'Backend',count:74},{id:'fullstack',label:'Full Stack',count:48},{id:'sysdesign',label:'System Design',count:28}] },
  { id:'datascience', label:'Data Science',           emoji:'📊', count:186, children:[{id:'python-ds',label:'Python & Analytics',count:64},{id:'sql-db',label:'Databases',count:42},{id:'bi-tools',label:'BI & Visualization',count:38},{id:'stats',label:'Statistics',count:42}] },
  { id:'ai',          label:'AI & Machine Learning',  emoji:'🤖', count:164, children:[{id:'deep-learning',label:'Deep Learning',count:52},{id:'nlp',label:'NLP',count:44},{id:'gen-ai',label:'Generative AI',count:38},{id:'mlops',label:'MLOps',count:30}] },
  { id:'design',      label:'UI/UX Design',           emoji:'🎨', count:134, children:[{id:'figma',label:'Figma',count:56},{id:'ux-research',label:'UX Research',count:38},{id:'motion',label:'Motion Design',count:40}] },
  { id:'mobile',      label:'Mobile Development',     emoji:'📱', count:112, children:[{id:'flutter',label:'Flutter',count:46},{id:'react-native',label:'React Native',count:38},{id:'ios-swift',label:'iOS / Swift',count:28}] },
  { id:'devops',      label:'DevOps & Cloud',         emoji:'☁️', count:98,  children:[{id:'docker-k8s',label:'Docker & Kubernetes',count:42},{id:'aws',label:'AWS',count:32},{id:'cicd',label:'CI/CD Pipelines',count:24}] },
  { id:'cybersec',    label:'Cyber Security',         emoji:'🔐', count:76,  children:[{id:'ethical-hack',label:'Ethical Hacking',count:34},{id:'network-sec',label:'Network Security',count:24},{id:'cloud-sec',label:'Cloud Security',count:18}] },
  { id:'business',    label:'Business & Leadership',  emoji:'💼', count:89,  children:[{id:'product-mgmt',label:'Product Management',count:32},{id:'startup',label:'Startup & Growth',count:28},{id:'finance',label:'Finance Basics',count:29}] },
];

export default function CoursesPage() {
  const [openCat,   setOpenCat]   = useState(null);
  const [activeCat, setActiveCat] = useState(null);
  const [sort,      setSort]      = useState('popular');
  const [viewMode,  setViewMode]  = useState('grid');
  const [treeQuery, setTreeQuery] = useState('');

  const coursesUrl = activeCat
    ? `/api/courses?domain=${activeCat}&sort=${sort}`
    : `/api/courses?sort=${sort}`;

  const { data, loading } = useFetch(coursesUrl);
  const courses = data?.data || [];

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
        <p className="page-subtitle">Explore our complete library — <span>{courses.length}</span> courses {activeCat ? `in "${COURSE_TREE.find(c=>c.id===activeCat)?.label}"` : 'across all domains'}</p>
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
                    <span className="tree-category-icon">{cat.emoji}</span>
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
                Showing <strong>{courses.length}</strong> courses
              </span>
            </div>
            <div className="toolbar-right">
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
          ) : courses.length === 0 ? (
            <div style={{ textAlign:'center', padding:'var(--space-16)', color:'var(--text-muted)' }}>
              <div style={{ fontSize:'3rem', marginBottom:'16px' }}>🔍</div>
              <p style={{ fontWeight:600, fontSize:'1.1rem' }}>No courses found</p>
              <p>Try selecting a different category.</p>
            </div>
          ) : (
            <div className={`courses-display ${viewMode === 'grid' ? 'grid-mode' : 'list-mode'}`} role="list">
              {courses.map(c => <CourseCard key={c._id} course={c} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
