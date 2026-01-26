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
  Stack
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
  user = {},
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  collapsed,
  setCollapsed,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  /* =========================
     SAFE ROLE
  ========================= */
  const role = String(user?.role || "").toLowerCase();

  /* =========================
     ROLE BASED MENU
  ========================= */
  const menuByRole = {
    staff: [
      { id: "dashboard", label: "Dashboard", icon: <Dashboard /> },
      { id: "my-passes", label: "My Passes", icon: <Assignment /> },
      { id: "history", label: "History", icon: <History /> },
    ],
    hod: [
      { id: "dashboard", label: "HOD Dashboard", icon: <Dashboard /> },
      { id: "history", label: "History", icon: <History /> },
    ],
    admin: [
      { id: "dashboard", label: "Admin Dashboard", icon: <Dashboard /> },
      // { id: "users", label: "Users", icon: <People /> },
      // { id: "approved", label: "Approved Passes", icon: <CheckCircle /> },
    ],
    security: [
      { id: "dashboard", label: "Security Dashboard", icon: <Dashboard /> },
      { id: "verified", label: "Verified", icon: <QrCodeScanner /> },
      { id: "rejected", label: "Rejected", icon: <Cancel /> },
    ],
  };

  /* =========================
     ROUTES
  ========================= */
  const dashboardRouteByRole = {
    staff: "/dashboard",
    hod: "/hod/dashboard",
    admin: "/admin/dashboard",
    security: "/security/dashboard",
  };

  const historyRouteByRole = {
    staff: "/dashboard/history",
    hod: "/hod/history",
  };

  const routeMap = {
    dashboard: dashboardRouteByRole[role],
    "my-passes": role === "staff" ? "/dashboard/mypass" : null,
    history: historyRouteByRole[role],
    approved: "/dashboard/approved",
    rejected: "/dashboard/rejected",
    verified: "/dashboard/verified",
    users: "/admin/users",
  };

  const menuItems = menuByRole[role] || [];
  const drawerWidth = collapsed ? MINI_WIDTH : FULL_WIDTH;

  /* =========================
     SIDEBAR CONTENT
  ========================= */
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
  <Stack spacing={0} alignItems="flex-start">
    <Typography fontWeight={900} color="#fff" fontSize={18}>
      Technopark
    </Typography>
    <Typography fontWeight={600} color="#fff" fontSize={14}>
      Gate Pass System
    </Typography>
  </Stack>
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
          const route = routeMap[item.id];

          return (
            <Tooltip
              key={item.id}
              title={collapsed ? item.label : ""}
              placement="right"
            >
              <ListItemButton
                selected={selected}
                disabled={!route}
                onClick={() => {
                  setActiveTab(item.id);
                  if (route) navigate(route);
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
          <Box
  component="img"
  src="/tp-logo.png"
  alt="Technopark"
  sx={{
    height: 28,
    width: "auto",
  }}
/>
        </Box>
      )}
    </Box>
  );

  return (
    <>
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
