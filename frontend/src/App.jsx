// ============================================================
//  LearnFlow React App – Root
// ============================================================
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import Header      from './components/Header.jsx';
import Toast       from './components/Toast.jsx';
import HomePage    from './pages/HomePage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import LivePage    from './pages/LivePage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="main-content">
        <Routes>
          <Route path="/"        element={<HomePage    />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/live"    element={<LivePage    />} />
          <Route path="*"        element={<NotFound    />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
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
            <div className="logo-icon">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <path d="M4 20 L14 4 L24 20 Z" fill="url(#fl2)" opacity="0.9"/>
                <path d="M8 24 L14 14 L20 24 Z" fill="url(#fl3)"/>
                <defs>
                  <linearGradient id="fl2" x1="4" y1="4" x2="24" y2="20" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="var(--accent-1)"/><stop offset="100%" stopColor="var(--accent-2)"/></linearGradient>
                  <linearGradient id="fl3" x1="8" y1="14" x2="20" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="var(--accent-2)"/><stop offset="100%" stopColor="var(--accent-3)"/></linearGradient>
                </defs>
              </svg>
            </div>
            <span className="logo-text">Learn<span className="logo-flow">Flow</span></span>
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
        <div className="footer-col">
          <h4 className="footer-col-title">Region</h4>
          <div className="region-badge">
            <span className="region-flag">🇮🇳</span>
            <div><strong>India</strong><span>Prices in ₹ INR</span></div>
          </div>
          <p className="footer-gst">GST Invoice available. GSTIN: 27AAAAA0000A1Z5</p>
          <div className="payment-icons">
            {['UPI','Visa','MC','EMI'].map(p => <span key={p} className="pay-icon">{p}</span>)}
          </div>
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
