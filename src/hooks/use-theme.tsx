
"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface CustomColors {
  primary: string;
  background: string;
  accent: string;
}
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  spectrumVisualEffects: boolean;
  setSpectrumVisualEffects: (enabled: boolean) => void;
  customColors: CustomColors;
  setCustomColors: (colors: CustomColors) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState('theme-default');
  const [spectrumVisualEffects, setSpectrumVisualEffects] = useState(true);
  const [customColors, setCustomColors] = useState<CustomColors>({
    primary: '#673AB7',
    background: '#1F1F1F',
    accent: '#00BCD4',
  });

  useEffect(() => {
    // You could potentially load saved settings from localStorage here
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, spectrumVisualEffects, setSpectrumVisualEffects, customColors, setCustomColors }}>
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
