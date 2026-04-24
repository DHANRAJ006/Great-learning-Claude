// ============================================================
//  AppContext – Global state: theme, accent, user, toasts
// ============================================================
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

// ── Local user store helpers (used when backend is unavailable) ──
const LOCAL_USERS_KEY = 'lf-local-users';
const DEMO_USER = {
  _id: 'demo-user-001',
  name: 'Demo User',
  email: 'demo@learnflow.com',
  password: 'demo123',
  plan: 'pro',
  avatarSeed: 'learnflow',
  overallProgress: 62,
  certificates: [
    { emoji: '🤖', title: 'AI Fundamentals', instructor: 'Dr. Priya Sharma', date: '2026-01-15', credentialId: 'LF-AI-001' }
  ],
  inProgress: [
    { courseId: '1', emoji: '🐍', title: 'Python for Data Science', instructor: 'Dr. Priya Sharma', progress: 75 }
  ]
};

function getLocalUsers() {
  try { return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]'); }
  catch { return []; }
}
function saveLocalUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

export function AppProvider({ children }) {
  const [theme,  setTheme]  = useState(() => localStorage.getItem('lf-theme')  || 'dark');
  const [accent, setAccent] = useState(() => {
    const saved = localStorage.getItem('lf-accent');
    if (saved === 'purple') return 'blue';
    return saved || 'blue';
  });
  const [user,   setUser]   = useState(() => {
    const saved = localStorage.getItem('lf-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [toasts, setToasts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('lf-recently-viewed');
    return saved ? JSON.parse(saved) : [];
  });

  // Apply theme/accent to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme',  theme);
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem('lf-theme',  theme);
    localStorage.setItem('lf-accent', accent);
  }, [theme, accent]);

  // ── Local-only login (no backend needed) ────────────────────
  function localLogin(username, password) {
    const identifier = username.toLowerCase().trim();
    // Check demo credentials
    if ((identifier === 'demo@learnflow.com' || identifier === 'demo') && password === 'demo123') {
      return { success: true, data: DEMO_USER };
    }
    // Check locally registered users
    const users = getLocalUsers();
    const found = users.find(u => (u.email === identifier || u.name.toLowerCase() === identifier) && u.password === password);
    if (found) return { success: true, data: found };
    return { success: false, message: 'Invalid credentials. Try demo@learnflow.com / demo123' };
  }

  function localSignup(name, email, password) {
    const users = getLocalUsers();
    if (users.find(u => u.email === email.toLowerCase())) {
      return { success: false, message: 'Email already registered' };
    }
    const newUser = {
      _id: 'local-' + Date.now(),
      name, email: email.toLowerCase(), password,
      plan: 'free', avatarSeed: name.replace(/\s+/g, '').toLowerCase(),
      overallProgress: 0, certificates: [], inProgress: []
    };
    users.push(newUser);
    saveLocalUsers(users);
    return { success: true, data: newUser };
  }

  // Auth methods – try backend first, fall back to local store
  const login = async (username, password) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      const json = await res.json();
      if (json.success) {
        setUser(json.data);
        localStorage.setItem('lf-user', JSON.stringify(json.data));
        return { success: true };
      }
      return { success: false, message: json.message };
    } catch (err) {
      // Backend unavailable – use local auth
      const result = localLogin(username, password);
      if (result.success) {
        setUser(result.data);
        localStorage.setItem('lf-user', JSON.stringify(result.data));
      }
      return result;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch('http://localhost:5000/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      const json = await res.json();
      if (json.success) {
        setUser(json.data);
        localStorage.setItem('lf-user', JSON.stringify(json.data));
        return { success: true };
      }
      return { success: false, message: json.message };
    } catch (err) {
      // Backend unavailable – use local signup
      const result = localSignup(name, email, password);
      if (result.success) {
        setUser(result.data);
        localStorage.setItem('lf-user', JSON.stringify(result.data));
      }
      return result;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lf-user');
  };

  // Toast system
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2000);
  }, []);

  const removeToast = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToRecentlyViewed = useCallback((course) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(c => c._id !== course._id);
      const updated = [course, ...filtered].slice(0, 4); // Keep last 4
      localStorage.setItem('lf-recently-viewed', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateUserProgress = useCallback((courseId, progress) => {
    setUser(prev => {
      if (!prev) return prev;
      const inProgress = prev.inProgress || [];
      const existing = inProgress.find(c => c.courseId === courseId);
      let updatedInProgress;
      
      if (existing) {
        updatedInProgress = inProgress.map(c => 
          c.courseId === courseId ? { ...c, progress: Math.max(c.progress, progress) } : c
        );
      } else {
        // Find course details from recently viewed or elsewhere
        const courseDetails = recentlyViewed.find(c => c._id === courseId) || {};
        updatedInProgress = [...inProgress, { 
          courseId, 
          title: courseDetails.title || 'Course', 
          instructor: courseDetails.instructor || 'Expert',
          progress,
          emoji: courseDetails.emoji || '📚'
        }];
      }

      const updatedUser = { ...prev, inProgress: updatedInProgress };
      localStorage.setItem('lf-user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, [recentlyViewed]);

  const addCertificate = useCallback((course) => {
    setUser(prev => {
      if (!prev) return prev;
      const certs = prev.certificates || [];
      if (certs.find(c => c.courseId === course._id)) return prev;

      const newCert = {
        courseId: course._id,
        title: course.title,
        instructor: course.instructor,
        date: new Date().toISOString().split('T')[0],
        credentialId: `LF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        emoji: '🏆'
      };

      const updatedUser = { ...prev, certificates: [...certs, newCert] };
      localStorage.setItem('lf-user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  return (
    <AppContext.Provider value={{ 
      theme, setTheme, accent, setAccent, 
      user, login, signup, logout, 
      showToast, toasts, removeToast,
      recentlyViewed, addToRecentlyViewed,
      updateUserProgress, addCertificate
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
