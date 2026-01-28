import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useState } from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";

const DashboardLayout = () => {
  // ✅ SAFE USER FETCH
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { role: "staff" };

  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <Box
        component="main"
        sx={{
          ml: { sm: collapsed ? "72px" : "260px" },
          transition: "margin 0.3s",
          minHeight: "100vh",
          bgcolor: "#f8fafc",
          p: 3,
        }}
      >
        {/* ✅ SAFE ACCESS */}
        <Navbar role={user.role} setMobileOpen={setMobileOpen} />

        {/* 🔥 ONLY PAGE CONTENT CHANGES */}
        <Outlet />
      </Box>
    </>
  );
};

export default DashboardLayout;
