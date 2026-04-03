'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  resolvedTheme: string;
}

// Theme provider context
const ThemeProviderContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'manzil-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<string>(defaultTheme);

  useEffect(() => {
    // Get theme from localStorage on client
    const storedTheme = localStorage.getItem(storageKey);
    if (storedTheme && storedTheme !== theme) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setThemeState(storedTheme);
    }
  }, [storageKey]); // Remove theme from dependencies to avoid cascading renders

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme: theme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    // Return default values when not inside a provider
    return {
      theme: 'dark',
      setTheme: () => {},
      resolvedTheme: 'dark',
    };
  }

  return context;
};