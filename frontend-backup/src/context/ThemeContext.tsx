import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 'light';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>('light');

  const setTheme = (newTheme: AppTheme) => {
    setThemeState('light');
    localStorage.setItem('krishi_app_theme', 'light');
  };

  const toggleTheme = () => {
    setThemeState('light');
  };

  useEffect(() => {
    const root = document.documentElement;
    // Clear any obsolete dark/sapphire theme classes from previous sessions
    root.classList.remove('theme-obsidian-dark', 'theme-sapphire-light', 'theme-pristine-light');
    root.classList.add('theme-light');
    localStorage.setItem('krishi_app_theme', 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

