import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function AuthPage() {
  const { login, signup, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        showToast('👋 Welcome back!', 'success');
        navigate(from, { replace: true });
      } else {
        showToast(res.message || 'Login failed', 'error');
      }
    } else {
      if (!name) {
        showToast('Please enter your name', 'error');
        setLoading(false);
        return;
      }
      const res = await signup(name, email, password);
      if (res.success) {
        showToast('✨ Account created!', 'success');
        navigate(from, { replace: true });
      } else {
        showToast(res.message || 'Signup failed', 'error');
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side: Visual / Info */}
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="auth-logo">
              <svg width="40" height="40" viewBox="0 0 28 28" fill="none">
                <path d="M4 20 L14 4 L24 20 Z" fill="url(#auth-grad)" opacity="0.9" />
                <path d="M8 24 L14 14 L20 24 Z" fill="url(#auth-grad2)" />
                <defs>
                  <linearGradient id="auth-grad" x1="4" y1="4" x2="24" y2="20" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#fff" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
                  </linearGradient>
                  <linearGradient id="auth-grad2" x1="8" y1="14" x2="20" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                    <stop offset="100%" stopColor="#fff" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="auth-logo-text">LearnFlow</span>
            </div>
            <h1>Empowering the next generation of creators.</h1>
            <p>Join over 100,000+ professionals learning world-class skills in AI, Web Dev, and Design.</p>

            <div className="auth-features">
              <div className="auth-feature-item">
                <span className="feat-icon">🚀</span>
                <div>
                  <strong>Expert-Led Courses</strong>
                  <span>Learn from industry veterans and domain experts.</span>
                </div>
              </div>
              <div className="auth-feature-item">
                <span className="feat-icon">🎓</span>
                <div>
                  <strong>Industry Certificates</strong>
                  <span>Earn credentials recognized by top global companies.</span>
                </div>
              </div>
              <div className="auth-feature-item">
                <span className="feat-icon">💻</span>
                <div>
                  <strong>Hands-on Projects</strong>
                  <span>Build your portfolio with real-world case studies.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Forms */}
        <div className="auth-form-side">
          <div className="auth-form-box">
            <div className="auth-header">
              <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
              <p>{isLogin ? 'Welcome back! Please enter your details.' : 'Start your learning journey today.'}</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="e.g. Hari"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">{isLogin ? 'Username or Email' : 'Email Address'}</label>
                <input
                  type={isLogin ? 'text' : 'email'}
                  id="email"
                  placeholder=""
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      className="forgot-link"
                      onClick={() => showToast('🔒 Reset link sent to your email', 'info')}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="password-input-wrap">
                  <input
                    type={showPass ? 'text' : 'password'}
                    id="password"
                    placeholder=""
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>
            </form>

            {isLogin && (
              <div style={{
                marginTop: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(var(--accent-rgb, 59,130,246),0.08)',
                border: '1px solid rgba(var(--accent-rgb, 59,130,246),0.2)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                <strong style={{color:'var(--text-primary)'}}>🔑 Demo credentials:</strong>&nbsp;
                Email: <code style={{color:'var(--accent-1)'}}>demo@learnflow.com</code>&nbsp;
                Password: <code style={{color:'var(--accent-1)'}}>demo123</code>
                <button
                  type="button"
                  style={{marginLeft:'8px', fontSize:'0.75rem', color:'var(--accent-1)', background:'none', border:'none', cursor:'pointer', textDecoration:'underline', padding:0}}
                  onClick={() => { setEmail('demo@learnflow.com'); setPassword('demo123'); }}
                >Auto-fill</button>
              </div>
            )}

            <div className="auth-footer">
              <p>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  className="toggle-auth"
                  onClick={() => { setIsLogin(!isLogin); setEmail(''); setPassword(''); setName(''); }}
                >
                  {isLogin ? 'Sign up for free' : 'Log in instead'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
