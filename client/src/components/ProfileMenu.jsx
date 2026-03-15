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
  Stack,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : {
    name: "User",
    email: "user@example.com",
    role: "employee",
    department: "ADMIN",
    photo: "",
  };

  const { name, email, role, department, photo } = user;

  // Theme Colors
  const mainGradient = "linear-gradient(135deg, #2563eb 0%, #22c55e 100%)";
  
  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <Tooltip title="Account Settings">
        <IconButton onClick={handleOpen} sx={{ p: 0.5 }}>
          {/* Avatar Ring */}
          <Box sx={{
            p: '2px',
            borderRadius: '50%',
            background: mainGradient,
            display: 'flex',
          }}>
            <Avatar
              src={photo}
              sx={{
                width: 36,
                height: 36,
                border: '2px solid white',
                bgcolor: 'white',
                color: '#2563eb',
                fontWeight: 700
              }}
            >
              {!photo && name.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableScrollLock
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 290,
            mt: 1.5,
            borderRadius: '20px',
            // This creates the GRADIENT BORDER
            background: mainGradient, 
            padding: '3px', // The thickness of the border
            overflow: 'visible',
            filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.15))',
          },
        }}
      >
        {/* INNER CONTENT CONTAINER */}
        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: '17px', // Slightly less than outer to fit perfectly
          overflow: 'hidden' 
        }}>
          
          {/* Header */}
          <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(37, 99, 235, 0.04)' }}>
            <Avatar
              src={photo}
              sx={{
                width: 60,
                height: 60,
                mx: 'auto',
                mb: 1.5,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                border: '2px solid white',
                background: mainGradient
              }}
            >
              {!photo && name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle1" fontWeight={800} color="#1e293b">
              {name}
            </Typography>
            <Typography variant="caption" sx={{ 
              color: '#2563eb', 
              fontWeight: 700, 
              bgcolor: '#eff6ff', 
              px: 1.5, 
              py: 0.3, 
              borderRadius: '10px',
              textTransform: 'uppercase'
            }}>
              {role}
            </Typography>
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {/* Info Items */}
          <Box sx={{ p: 1 }}>
            <InfoItem icon={<EmailIcon />} label="Email" value={email} />
            <InfoItem icon={<BusinessIcon />} label="Dept" value={department} />
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {/* Footer Action */}
          <Box sx={{ p: 1.5 }}>
            <MenuItem
              onClick={handleLogout}
              sx={{
                borderRadius: '12px',
                py: 1.2,
                color: '#ef4444',
                fontWeight: 700,
                '&:hover': { bgcolor: '#fef2f2' },
                transition: '0.2s'
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

// Sub-component for clean rows
const InfoItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, gap: 2 }}>
    <Box sx={{ color: '#94a3b8', display: 'flex' }}>
      {React.cloneElement(icon, { fontSize: "small" })}
    </Box>
    <Box sx={{ overflow: 'hidden' }}>
      <Typography variant="caption" display="block" color="#94a3b8" fontWeight={600} sx={{ lineHeight: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} color="#334155" noWrap>
        {value}
      </Typography>
    </Box>
  </Box>
);

export default ProfileMenu;