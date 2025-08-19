
"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  spectrumVisualEffects: boolean;
  setSpectrumVisualEffects: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState('theme-default');
  const [spectrumVisualEffects, setSpectrumVisualEffects] = useState(true);

  useEffect(() => {
    // You could potentially load saved settings from localStorage here
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, spectrumVisualEffects, setSpectrumVisualEffects }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
