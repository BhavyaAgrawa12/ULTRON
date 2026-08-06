import React, { createContext, useContext, ReactNode } from 'react';
import { darkTheme, Theme } from './dark';

const ThemeContext = createContext<Theme>(darkTheme);

export interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme = darkTheme,
}) => {
  return (
    <ThemeContext.Provider value={theme}>
      <div className="dark min-h-screen bg-[#05070A] text-[#F8FAFC]">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  return useContext(ThemeContext);
};
