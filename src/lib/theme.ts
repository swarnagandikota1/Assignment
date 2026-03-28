'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1B3A6B', light: '#2d5a9e', dark: '#0f2444', contrastText: '#fff' },
    secondary: { main: '#E8571A', light: '#f07a47', dark: '#b03e0f', contrastText: '#fff' },
    success: { main: '#2E7D32' },
    warning: { main: '#ED6C02' },
    error: { main: '#D32F2F' },
    background: { default: '#F4F6F9', paper: '#FFFFFF' },
    text: { primary: '#1A2332', secondary: '#5A6A7E' },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
        containedPrimary: { boxShadow: '0 2px 8px rgba(27,58,107,0.25)' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: '0 2px 12px rgba(0,0,0,0.08)', borderRadius: 12 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: { '& th': { backgroundColor: '#F0F4FA', fontWeight: 700, color: '#1B3A6B' } },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
  },
});

export default theme;
