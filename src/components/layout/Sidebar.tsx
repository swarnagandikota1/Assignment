'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Avatar, Chip, Tooltip, IconButton,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';

const DRAWER_WIDTH = 252;
const COLLAPSED_WIDTH = 68;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Master Setup', icon: <SettingsIcon />, path: '/masters' },
  { label: 'Seat Matrix', icon: <EventSeatIcon />, path: '/seat-matrix' },
  { label: 'Applicants', icon: <PeopleIcon />, path: '/applicants' },
  { label: 'Admissions', icon: <AssignmentTurnedInIcon />, path: '/admissions' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const width = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          backgroundColor: '#1B3A6B',
          color: '#fff',
          borderRight: 'none',
          transition: 'width 0.2s ease',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ px: collapsed ? 1 : 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 72 }}>
        <Avatar sx={{ bgcolor: '#E8571A', width: 38, height: 38, flexShrink: 0 }}>
          <SchoolIcon sx={{ fontSize: 22 }} />
        </Avatar>
        {!collapsed && (
          <Box>
            <Typography variant="subtitle1" fontWeight={800} lineHeight={1.2} color="#fff">
              edumerge
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>
              Admission CRM
            </Typography>
          </Box>
        )}
        <Box sx={{ ml: 'auto' }}>
          <IconButton size="small" onClick={() => setCollapsed(!collapsed)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Role badge */}
      {!collapsed && (
        <Box sx={{ px: 2.5, py: 1.5 }}>
          <Chip label="Admin" size="small" sx={{ bgcolor: 'rgba(232,87,26,0.2)', color: '#f9a97c', fontSize: 11, fontWeight: 700 }} />
        </Box>
      )}

      {/* Nav Links */}
      <List sx={{ px: collapsed ? 0.5 : 1, pt: 0.5 }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.path);
          return (
            <Tooltip title={collapsed ? item.label : ''} placement="right" key={item.path}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => router.push(item.path)}
                  sx={{
                    borderRadius: 2,
                    minHeight: 46,
                    px: collapsed ? 1.5 : 1.5,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                    borderLeft: active ? '3px solid #E8571A' : '3px solid transparent',
                  }}
                >
                  <ListItemIcon sx={{ color: active ? '#fff' : 'rgba(255,255,255,0.6)', minWidth: collapsed ? 0 : 38 }}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? '#fff' : 'rgba(255,255,255,0.75)' }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', px: collapsed ? 1 : 2, py: 2 }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#2d5a9e', fontSize: 13 }}>A</Avatar>
            <Box>
              <Typography variant="caption" fontWeight={700} color="#fff" display="block">Admin User</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>admin@edumerge.com</Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
