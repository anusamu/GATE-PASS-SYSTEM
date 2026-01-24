import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";

import {
  FileText,
  Users,
  AlertCircle,
  CheckCircle2,
  History,
} from "lucide-react";

import PassCard from "../components/PassCard";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";

const API = "https://gate-pass-system-drti.onrender.com" ;

/* ===========================
   HELPER
=========================== */
const normalizeStatus = (status = "") => status.toUpperCase();

const Dashboard = () => {
  const [passes, setPasses] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || { role: "staff" };
  const role = user.role;

  useEffect(() => {
    if (token) fetchPasses();
  }, [token]);

  const fetchPasses = async () => {
    try {
      const res = await axios.get(`${API}/staff/mypass`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ ALWAYS sort before storing
      const sorted = [...res.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setPasses(sorted);
    } catch (err) {
      console.error("FETCH PASSES ERROR:", err);
    }
  };

  /* ===========================
     RECENT ACTIVITY (FIXED)
  =========================== */
  const recentPasses = [...passes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <>
      {/* SIDEBAR */}
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* MAIN CONTENT */}
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
        {/* NAVBAR */}
        <Navbar role={role} setMobileOpen={setMobileOpen} />

        <Stack spacing={4}>
          {/* STATS */}
          <Grid container spacing={3}>
            <StatCard
              title="Total Passes"
              value={passes.length}
              icon={<FileText />}
            />
            <StatCard
              title="Approved"
              value={
                passes.filter(
                  (p) => normalizeStatus(p.status) === "APPROVED"
                ).length
              }
              icon={<Users />}
            />
            <StatCard
              title="Pending"
              value={
                passes.filter(
                  (p) => normalizeStatus(p.status) === "PENDING"
                ).length
              }
              icon={<AlertCircle />}
            />
            <StatCard
              title="Completed"
              value={
                passes.filter(
                  (p) => normalizeStatus(p.status) === "COMPLETED"
                ).length
              }
              icon={<CheckCircle2 />}
            />
          </Grid>

          {/* RECENT PASSES */}
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack direction="row" spacing={1} mb={3} alignItems="center">
                <History size={20} />
                <Typography fontWeight={800}>
                  Recent Gate Pass Activity
                </Typography>
              </Stack>

              <Grid container spacing={3}>
                {recentPasses.length === 0 ? (
                  <Typography align="center" width="100%" py={6}>
                    No gate pass requests yet
                  </Typography>
                ) : (
                  recentPasses.map((pass) => (
                    <Grid key={pass._id} item xs={12} sm={6} lg={3}>
                      <PassCard pass={pass} role={role} />
                    </Grid>
                  ))
                )}
              </Grid>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </>
  );
};

/* ===========================
   STAT CARD
=========================== */
const StatCard = ({ title, value, icon }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ borderRadius: 4, p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={900}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            borderRadius: "50%",
            bgcolor: "#e0f2fe",
            color: "#2563eb",
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Card>
  </Grid>
);

export default Dashboard;
