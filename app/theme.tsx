'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode, createContext, useContext, useState, useEffect } from 'react';

type ColorMode = 'light' | 'dark' | 'system';

interface ColorModeContextType {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  resolvedMode: 'light' | 'dark';
}

const ColorModeContext = createContext<ColorModeContextType>({
  mode: 'system',
  setMode: () => {},
  resolvedMode: 'light',
});

export const useColorMode = () => useContext(ColorModeContext);

// Create a theme wrapper component
export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ColorMode>('system');
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('light');
  
  // Get the resolved mode (either direct selection or system preference)
  const resolvedMode = mode === 'system' ? systemPreference : mode as 'light' | 'dark';
  
  // Create basic theme
  const theme = createTheme({
    palette: {
      mode: resolvedMode,
      ...(resolvedMode === 'light' 
        ? {
            // Light mode colors
            primary: { main: '#1976d2' },
            secondary: { main: '#dc004e' },
            background: { default: '#f5f5f5', paper: '#ffffff' },
            success: { main: '#4caf50' },
            info: { main: '#2196f3' },
            text: { primary: '#212121', secondary: '#757575' },
          }
        : {
            // Dark mode colors
            primary: { main: '#90caf9' },
            secondary: { main: '#f48fb1' },
            background: { default: '#121212', paper: '#1e1e1e' },
            success: { main: '#66bb6a' },
            info: { main: '#64b5f6' },
            text: { primary: '#f5f5f5', secondary: '#aaaaaa' },
          }),
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
    },
  });
  
  // Add typography and component customizations to theme
  theme.typography.h4 = { fontWeight: 600 };
  theme.typography.h5 = { fontWeight: 600 };
  theme.typography.h6 = { fontWeight: 600 };
  theme.typography.subtitle2 = { fontWeight: 500 };
  
  // Add component customizations
  theme.components = {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          flexGrow: 1,
        },
      },
    },
  };
  
  // Detect system preference change using client-side effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setSystemPreference(mediaQuery.matches ? 'dark' : 'light');
      
      const handler = (e: MediaQueryListEvent) => {
        setSystemPreference(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
    return undefined;
  }, []);
  
  // Check for saved preference in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('color-mode') as ColorMode | null;
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        setMode(savedMode as ColorMode);
      }
    }
  }, []);
  
  // Save preference to localStorage
  const handleSetMode = (newMode: ColorMode) => {
    setMode(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('color-mode', newMode);
    }
  };
  
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ColorModeContext.Provider value={{ mode, setMode: handleSetMode, resolvedMode }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AppRouterCacheProvider>
  );
} 