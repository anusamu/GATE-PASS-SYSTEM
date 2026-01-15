import React, { useState } from "react";
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Divider,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
} from "@mui/icons-material";

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "user@example.com";
  const role = localStorage.getItem("role") || "Employee";
  const department = localStorage.getItem("department") || "Operations";
  const photo = localStorage.getItem("photo") || "";

  // Gradient Theme Colors
  const mainGradient = "linear-gradient(135deg, #007cf0 0%, #09f08cff 100%)";

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton 
          onClick={handleOpen} 
          sx={{ 
            p: '2px', 
            background: mainGradient,
            '&:hover': { opacity: 0.9 }
          }}
        >
          <Avatar 
            src={photo} 
            alt={name} 
            sx={{ 
              width: 36, 
              height: 36, 
              border: '2px solid white',
              background: '#fff',
              color: '#007cf0',
              fontWeight: 'bold'
            }}
          >
            {!photo && name.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableScrollLock
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 4,
          sx: {
            width: 300,
            mt: 1.5,
            borderRadius: 4,
            overflow: 'visible',
            filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.1))',
            '&:before': { // The little arrow on top
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 18,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        {/* Header Section with Gradient Background */}
        <Box sx={{ 
          background: mainGradient, 
          m: 1, 
          p: 3, 
          borderRadius: 3, 
          textAlign: 'center',
          color: 'white'
        }}>
          <Avatar 
            src={photo} 
            sx={{ 
              width: 60, 
              height: 60, 
              mx: 'auto', 
              mb: 1.5, 
              border: '3px solid rgba(255,255,255,0.4)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
            }} 
          />
          <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.2 }}>
            {name}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500 }}>
            {role.toUpperCase()}
          </Typography>
        </Box>

        {/* Info Section */}
        <Box sx={{ py: 1 }}>
          <MenuItem disabled sx={{ opacity: "1 !important", py: 0.5 }}>
            <ListItemIcon><EmailIcon fontSize="small" /></ListItemIcon>
            <Typography variant="body2" color="text.primary">{email}</Typography>
          </MenuItem>
          <MenuItem disabled sx={{ opacity: "1 !important", py: 0.5 }}>
            <ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>
            <Typography variant="body2" color="text.primary">{department}</Typography>
          </MenuItem>
        </Box>

        <Divider sx={{ my: 1, borderStyle: 'dashed' }} />

        {/* Action Section */}
        <MenuItem 
          onClick={handleLogout} 
          sx={{ 
            mx: 1, 
            borderRadius: 2,
            color: 'error.main',
            fontWeight: 600,
            '&:hover': { bgcolor: '#fff5f5' }
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;