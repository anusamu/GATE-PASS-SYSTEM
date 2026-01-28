import React, { useEffect } from "react";
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
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Dashboard,
  Assignment,
  History,
  QrCodeScanner,
  Cancel,
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
  const location = useLocation();

  /* =========================
     SAFE ROLE
  ========================= */
  const role = String(user?.role || "").toLowerCase();
// 
  /* =========================
     ROLE BASED MENU (UI SAME)
  ========================= */
  const menuByRole = {
    staff: [
      { id: "dashboard", label: "Dashboard", icon: <Dashboard /> },
      { id: "my-passes", label: "My Passes", icon: <Assignment /> },
      { id: "staffhistory", label: "History", icon: <History /> },
    ],
    hod: [
      { id: "dashboard", label: "HOD Dashboard", icon: <Dashboard /> },
      { id: "hodhistory", label: "History", icon: <History /> },
    ],
    admin: [
      { id: "dashboard", label: "Admin Dashboard", icon: <Dashboard /> },
    ],
    security: [
      { id: "dashboard", label: "Security Dashboard", icon: <Dashboard /> },
      { id: "verified", label: "Verified", icon: <QrCodeScanner /> },
      { id: "rejected", label: "Rejected", icon: <Cancel /> },
    ],
  };

  /* =========================
     ROUTES (LOGIC ONLY)
  ========================= */
  const routeMap = {
    dashboard:
      role === "staff"
        ? "/dashboard"
        : role === "hod"
        ? "/hod/"
        : role === "admin"
        ? "/admin/"
        : "/security/dashboard",

    "my-passes": "/dashboard/mypass",
    staffhistory: "/dashboard/history",
    hodhistory: "/hod/history",
    verified: "/security/verified",
    rejected: "/security/rejected",
  };

  const menuItems = menuByRole[role] || [];
  const drawerWidth = collapsed ? MINI_WIDTH : FULL_WIDTH;

  /* =========================
     ACTIVE TAB SYNC (NO UI CHANGE)
  ========================= */
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/dashboard/history")) {
      setActiveTab("staffhistory");
    } else if (path.startsWith("/hod/history")) {
      setActiveTab("hodhistory");
    } else if (path.includes("/mypass")) {
      setActiveTab("my-passes");
    } else {
      setActiveTab("dashboard");
    }
  }, [location.pathname, setActiveTab]);

  /* =========================
     SIDEBAR CONTENT (UI SAME)
  ========================= */
  const content = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(16px)",
        borderTopRightRadius: 22,
        borderBottomRightRadius: 22,
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
          borderRadius: 4,
        }}
      >
        {!collapsed && (
          <Stack spacing={0}>
            <Typography fontWeight={900} color="#fff" fontSize={19}>
              TECHNOPARK
            </Typography>
            <Typography fontWeight={600} color="#fff" fontSize={15}>
              GATE PASS SYSTEM
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
        <Box p={4}>
          <Box
            component="img"
            src="/tp-logo.png"
            alt="Technopark"
            sx={{ height: 28, width: 200 }}
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
