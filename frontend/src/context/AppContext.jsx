// ============================================================
//  AppContext – Global state: theme, accent, user, toasts
// ============================================================
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme,  setTheme]  = useState(() => localStorage.getItem('lf-theme')  || 'dark');
  const [accent, setAccent] = useState(() => localStorage.getItem('lf-accent') || 'violet');
  const [user,   setUser]   = useState(null);
  const [toasts, setToasts] = useState([]);

  // Apply theme/accent to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme',  theme);
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem('lf-theme',  theme);
    localStorage.setItem('lf-accent', accent);

    // Sync theme icon
    const sun  = document.getElementById('theme-icon-sun');
    const moon = document.getElementById('theme-icon-moon');
    if (sun && moon) {
      sun.style.display  = theme === 'dark'  ? 'block' : 'none';
      moon.style.display = theme === 'light' ? 'block' : 'none';
    }
  }, [theme, accent]);

  // Fetch logged-in user
  useEffect(() => {
    fetch('/api/user/me')
      .then(r => r.json())
      .then(json => { if (json.success) setUser(json.data); })
      .catch(() => {}); // fail silently, show mock
  }, []);

  // Toast system
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{ theme, setTheme, accent, setAccent, user, showToast, toasts, removeToast }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
