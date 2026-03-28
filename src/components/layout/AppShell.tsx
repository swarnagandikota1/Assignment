'use client';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F4F6F9' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, overflow: 'auto', minHeight: '100vh' }}>
        {children}
      </Box>
    </Box>
  );
}
