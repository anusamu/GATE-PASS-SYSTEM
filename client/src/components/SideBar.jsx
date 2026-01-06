import React from "react";
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Backdrop,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import {
  Dashboard,
  Assignment,
  History,
  People,
  CheckCircle,
  Cancel,
  QrCodeScanner,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

const FULL_WIDTH = 260;
const MINI_WIDTH = 72;
const GRADIENT = "linear-gradient(135deg,#2563eb,#22c55e)";

const Sidebar = ({
  user,
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  collapsed,
  setCollapsed,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const role = user?.role;
  const navigate = useNavigate();

  /* ===== ROLE BASED MENU ===== */
  const menuByRole = {
    staff: [
      { id: "dashboard", label: "Dashboard", icon: <Dashboard /> },
      { id: "my-passes", label: "My Passes", icon: <Assignment /> },
      { id: "history", label: "History", icon: <History /> },
    ],
    hod: [
      { id: "dashboard", label: "Dashboard", icon: <Dashboard /> },
      { id: "approved", label: "Approved", icon: <CheckCircle /> },
      { id: "rejected", label: "Rejected", icon: <Cancel /> },
      { id: "history", label: "History", icon: <History /> },
    ],
    admin: [
      { id: "dashboard", label: "Dashboard", icon: <Dashboard /> },
      { id: "users", label: "Users", icon: <People /> },
      { id: "approved", label: "Approved", icon: <CheckCircle /> },
      { id: "history", label: "History", icon: <History /> },
    ],
    security: [
      { id: "dashboard", label: "Dashboard", icon: <Dashboard /> },
      { id: "verified", label: "Verified", icon: <QrCodeScanner /> },
      { id: "rejected", label: "Rejected", icon: <Cancel /> },
    ],
  };

  /* ===== ROUTES ===== */
  const routeMap = {
    dashboard: "/dashboard",
    "my-passes": "/dashboard/mypass",
    history: "/dashboard/history",
  };

  const menuItems = menuByRole[role] || [];
  const drawerWidth = collapsed ? MINI_WIDTH : FULL_WIDTH;

  const content = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(16px)",
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: GRADIENT,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        {!collapsed && (
          <Typography fontWeight={900} color="#fff">
            GatePass Pro
          </Typography>
        )}

        {!isMobile && (
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              bgcolor: "#fff",
              boxShadow: 2,
              "&:hover": { bgcolor: "#f1f5f9" },
            }}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        )}
      </Box>

      {/* MENU */}
      <List sx={{ px: 1.5, mt: 2 }}>
        {menuItems.map((item) => {
          const selected = activeTab === item.id;

          return (
            <Tooltip
              key={item.id}
              title={collapsed ? item.label : ""}
              placement="right"
            >
              <ListItemButton
                selected={selected}
                onClick={() => {
                  setActiveTab(item.id);
                  if (routeMap[item.id]) navigate(routeMap[item.id]);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 999,
                  mb: 1,
                  px: collapsed ? 1.5 : 2.5,
                  justifyContent: collapsed ? "center" : "flex-start",
                  color: selected ? "#fff" : "text.primary",
                  background: selected ? GRADIENT : "transparent",
                  "&:hover": {
                    background: selected ? GRADIENT : "rgba(0,0,0,0.04)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    color: selected ? "#fff" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: selected ? 800 : 600,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ mt: "auto" }} />

      {!collapsed && (
        <Box p={2}>
          <Typography fontSize={12} color="success.main">
            ● Live & Secure
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* BACKDROP */}
      {mobileOpen && isMobile && (
        <Backdrop open onClick={() => setMobileOpen(false)} />
      )}

      {/* MOBILE */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        {content}
      </Drawer>

      {/* DESKTOP */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            transition: "width 0.3s",
            overflowX: "hidden",
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
};

export default Sidebar;
