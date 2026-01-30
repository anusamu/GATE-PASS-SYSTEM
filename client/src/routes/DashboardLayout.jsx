import { Outlet, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import axios from "axios";

const API =
  import.meta.env.MODE === "production"
    ? "https://gate-pass-system-drti.onrender.com"
    : "http://localhost:5000";

const DashboardLayout = () => {
  /* ================= AUTH CHECK ================= */
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!storedUser || !token) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(storedUser);
  const role = user.role?.toLowerCase();

  /* ================= UI STATE ================= */
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  /* ================= NAVBAR DATA ================= */
  const [users, setUsers] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);

  /* ================= FETCH NAVBAR DATA ================= */
  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        // ADMIN → Users list
        if (role === "admin") {
          const res = await axios.get(`${API}/users`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsers(res.data || []);
        }

        // ADMIN & HOD → Approved pass count
        if (role === "admin" || role === "hod") {
          const passRes = await axios.get(
            `${API}/passes/approved/count`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setApprovedCount(passRes.data.count || 0);
        }
      } catch (error) {
        console.error("Navbar data error:", error);
      }
    };

    fetchNavbarData();
  }, [role, token]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* ================= SIDEBAR ================= */}
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* ================= MAIN CONTENT ================= */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,

          /* Responsive sidebar spacing */
          ml: {
            xs: 0,
            md: collapsed ? "72px" : "260px",
          },

          transition: "margin 0.3s ease",
          px: { xs: 1, sm: 2, md: 3 },
          pb: 4,
        }}
      >
        {/* ================= NAVBAR ================= */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1200,
            bgcolor: "#f8fafc",
            pb: 3,
          }}
        >
          <Navbar
            role={role}
            setMobileOpen={setMobileOpen}
            API={API}
            token={token}
            approvedCount={approvedCount}
            users={users}
          />
        </Box>

        {/* ================= PAGE CONTENT ================= */}
        <Box
          sx={{
            maxWidth: "1400px",
            mx: "auto",
            width: "100%",
          }}
        >
          <Outlet context={{ user, token, API }} />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
