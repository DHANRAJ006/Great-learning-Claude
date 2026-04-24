// ============================================================
//  LearnFlow React App – Root
// ============================================================
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Header      from './components/Header.jsx';
import Toast       from './components/Toast.jsx';
import HomePage    from './pages/HomePage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import LivePage    from './pages/LivePage.jsx';
import CourseDetailsPage from './pages/CourseDetailsPage.jsx';
import AuthPage    from './pages/AuthPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import AIChatBot   from './components/AIChatBot.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
}

/**
 * ProtectedRoute - Redirects to /login if user is not authenticated.
 * Preserves the intended destination in location state.
 */
function ProtectedRoute({ children }) {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useApp();

  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/"        element={<HomePage    />} />
          <Route path="/courses" element={<CoursesPage />} />
          
          {/* Auth Route - Redirect to home if already logged in */}
          <Route path="/login"   element={user ? <Navigate to="/" replace /> : <AuthPage />} />
          
          <Route path="/course/:id" element={<ProtectedRoute><CourseDetailsPage /></ProtectedRoute>} />
          <Route path="/checkout/:id" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/live"       element={<ProtectedRoute><LivePage       /></ProtectedRoute>} />
          
          <Route path="*"           element={<NotFound    />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
      
      {/* Global AI Chatbot */}
      <GlobalChatBot />
    </>
  );
}

function GlobalChatBot() {
  const [show, setShow] = React.useState(false);
  
  React.useEffect(() => {
    const handleToggle = () => setShow(s => true);
    document.addEventListener('toggleAIChat', handleToggle);
    return () => document.removeEventListener('toggleAIChat', handleToggle);
  }, []);
  
  return (
    <>
      <button 
        onClick={() => setShow(prev => !prev)}
        aria-label="Toggle AI Mentor Chat"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--accent-1, #3b82f6)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          transition: 'transform 0.2s, background 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {show ? '✕' : (
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10" />
            <path d="M12 22a10 10 0 1 0-10-10" />
            <circle cx="12" cy="12" r="3" />
            <path d="m16 8-2.5 2.5" />
            <path d="m10.5 13.5-2.5 2.5" />
            <circle cx="17.5" cy="6.5" r="1.5" />
            <circle cx="6.5" cy="17.5" r="1.5" />
            <path d="m13.5 10.5 2.5-2.5" />
            <path d="m8 16 2.5-2.5" />
            <circle cx="6.5" cy="6.5" r="1.5" />
            <circle cx="17.5" cy="17.5" r="1.5" />
          </svg>
        )}
      </button>
      
      {show && (
        <div style={{ position: 'fixed', bottom: '100px', right: '24px', zIndex: 9999 }}>
          <AIChatBot onClose={() => setShow(false)} />
        </div>
      )}
    </>
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign:'center', padding:'120px 24px', color:'var(--text-secondary)' }}>
      <div style={{ fontSize:'4rem', marginBottom:'16px' }}>🔍</div>
      <h2 style={{ fontSize:'1.8rem', marginBottom:'8px' }}>Page not found</h2>
      <p style={{ marginBottom:'24px' }}>The page you're looking for doesn't exist.</p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a href="/" className="logo footer-logo" aria-label="LearnFlow">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M4 20 L14 4 L24 20 Z" fill="url(#footer-logo-grad)" opacity="0.9"/>
              <path d="M8 24 L14 14 L20 24 Z" fill="url(#footer-logo-grad2)"/>
              <defs>
                <linearGradient id="footer-logo-grad" x1="4" y1="4" x2="24" y2="20" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="var(--accent-1)"/>
                  <stop offset="100%" stopColor="var(--accent-2)"/>
                </linearGradient>
                <linearGradient id="footer-logo-grad2" x1="8" y1="14" x2="20" y2="24" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="var(--accent-2)"/>
                  <stop offset="100%" stopColor="var(--accent-3)"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="logo-text">LearnFlow</span>
          </a>
          <p className="footer-tagline">Empowering India's next billion learners with world-class education.</p>
          <div className="footer-socials">
            {['𝕏','in','▶','📸'].map((s,i) => <a key={i} href="#" className="social-link">{s}</a>)}
          </div>
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">Support</h4>
          <ul className="footer-links">
            {['Help Center','Contact Us','Community Forum','Report an Issue','System Status'].map(l => (
              <li key={l}><a href="#" className="footer-link">{l}</a></li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">Legal</h4>
          <ul className="footer-links">
            {['Terms & Conditions','Privacy Policy','Cookie Policy','Refund Policy','Accessibility'].map(l => (
              <li key={l}><a href="#" className="footer-link">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 LearnFlow Technologies Pvt. Ltd. All rights reserved.</p>
        <p>Made with ❤️ in Bengaluru, India</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
