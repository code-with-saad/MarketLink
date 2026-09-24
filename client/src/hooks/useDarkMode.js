import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ml-theme';

const getSystemPreference = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch (_) {}
  return getSystemPreference();
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

const useDarkMode = () => {
  const [theme, setTheme] = useState(() => {
    const initial = getInitialTheme();
    applyTheme(initial);
    return initial;
  });

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {}
  }, [theme]);

  const toggle = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return { theme, toggle, isDark: theme === 'dark' };
};

export default useDarkMode;
