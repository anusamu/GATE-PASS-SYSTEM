import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  InputBase,
  Avatar,
  Divider,
  Tooltip,
} from '@mui/material';

import {
  Logout,
  Notifications,
  Search,
  Person,
  Menu,
} from '@mui/icons-material';

const Navbar = ({ user, onLogout, onMenuToggle }) => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderBottom: '1px solid #e3f2fd',
        height: 80,
        justifyContent: 'center',
        zIndex: 1200,
      }}
    >
      <Toolbar
        sx={{
          px: { xs: 2, md: 4 },
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {/* ================= LEFT ================= */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* Mobile Menu Toggle */}
          <IconButton
            onClick={onMenuToggle}
            sx={{
              display: { lg: 'none' },
              color: 'text.secondary',
              '&:hover': { bgcolor: '#f5f5f5' },
            }}
          >
            <Menu />
          </IconButton>

          {/* Search (Desktop only) */}
          <Box
            sx={{
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              bgcolor: '#f9fafb',
              px: 2,
              py: 1,
              borderRadius: 3,
              width: 260,
            }}
          >
            <Search sx={{ color: '#9ca3af', mr: 1 }} />
            <InputBase
              placeholder="System search..."
              sx={{
                fontSize: 14,
                width: '100%',
              }}
            />
          </Box>
        </Box>

        {/* ================= RIGHT ================= */}
        {user && (
          <Box display="flex" alignItems="center" gap={{ xs: 1.5, md: 3 }}>
            {/* Notification */}
            <IconButton
              sx={{
                color: '#9ca3af',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: '#e3f2fd',
                },
                position: 'relative',
              }}
            >
              <Notifications />
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 8,
                  height: 8,
                  bgcolor: 'red',
                  borderRadius: '50%',
                  border: '2px solid white',
                }}
              />
            </IconButton>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: 'none', md: 'block' } }}
            />

            {/* User Info */}
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box textAlign="right" display={{ xs: 'none', sm: 'block' }}>
                <Typography
                  fontSize={14}
                  fontWeight={900}
                  color="text.primary"
                  lineHeight={1.1}
                >
                  {user.name}
                </Typography>
                <Typography
                  fontSize={9}
                  fontWeight={900}
                  color="primary.main"
                  letterSpacing={2}
                >
                  {user.role}
                </Typography>
              </Box>

              <Avatar
                sx={{
                  bgcolor: 'linear-gradient(135deg, #2563eb, #22c55e)',
                  background:
                    'linear-gradient(135deg, #2563eb, #22c55e)',
                  width: 36,
                  height: 36,
                  boxShadow: '0 6px 20px rgba(37,99,235,0.3)',
                }}
              >
                <Person fontSize="small" />
              </Avatar>
            </Box>

            {/* Logout */}
            <Tooltip title="Logout">
              <IconButton
                onClick={onLogout}
                sx={{
                  color: '#9ca3af',
                  bgcolor: '#f9fafb',
                  '&:hover': {
                    color: '#dc2626',
                    bgcolor: '#fee2e2',
                  },
                }}
              >
                <Logout />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
