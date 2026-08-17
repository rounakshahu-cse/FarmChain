import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 'pristine-light' | 'obsidian-dark' | 'sapphire-light';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    return (localStorage.getItem('krishi_app_theme') as AppTheme) || 'pristine-light';
  });

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('krishi_app_theme', newTheme);
  };

  const themeList: AppTheme[] = ['pristine-light', 'obsidian-dark', 'sapphire-light'];

  const toggleTheme = () => {
    const currentIndex = themeList.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeList.length;
    setTheme(themeList[nextIndex]);
  };

  useEffect(() => {
    const root = document.documentElement;
    themeList.forEach((t) => root.classList.remove(`theme-${t}`));
    root.classList.add(`theme-${theme}`);
    localStorage.setItem('krishi_app_theme', theme);
  }, [theme]);

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
