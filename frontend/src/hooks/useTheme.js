// ── useTheme – convenience hook for settings modal ─────────
import { useApp } from '../context/AppContext';

export function useTheme() {
  const { theme, setTheme, accent, setAccent } = useApp();

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const applyAccent = (a) => setAccent(a);
  const applyTheme  = (t) => setTheme(t);

  return { theme, accent, toggleTheme, applyTheme, applyAccent };
}
