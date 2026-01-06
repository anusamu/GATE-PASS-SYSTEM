import React, { useState } from "react";
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const photo = localStorage.getItem("photo");

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      {/* Profile Icon */}
      <IconButton onClick={handleOpen}>
        <Avatar src={photo} alt={name}>
          {name?.charAt(0)}
        </Avatar>
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 280,
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <Box px={2} py={1}>
          <Typography fontWeight={700}>{name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {email}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              bgcolor: "#e3f2fd",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              display: "inline-block",
              mt: 1,
            }}
          >
            {role?.toUpperCase()}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;
