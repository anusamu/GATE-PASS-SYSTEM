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

const API =
  import.meta.env.MODE === "production"
    ? "https://gate-pass-system-drti.onrender.com"
    : "http://localhost:5000";

/* ===========================
   HELPER
=========================== */

const normalizeStatus = (status = "") => status.toUpperCase();

const Dashboard = () => {
  const [passes, setPasses] = useState([]);

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

      const sorted = [...res.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setPasses(sorted);
    } catch (err) {
      console.error("FETCH PASSES ERROR:", err);
    }
  };

  const recentPasses = passes.slice(0, 3);

  return (
    <Box>
      <Stack spacing={4}>
        {/* STATS */}
        <Grid container spacing={3}>
          <StatCard
            title="Total Passes"
            value={passes.length}
            icon={<FileText />}
            bg="#cbefe6ff"
            iconColor="#4338CA"
          />

          <StatCard
            title="Approved"
            value={passes.filter(
              (p) => normalizeStatus(p.status) === "APPROVED"
            ).length}
            icon={<Users />}
            bg="#cbefe6ff"
            iconColor="#15803D"
          />

          <StatCard
            title="Pending"
            value={passes.filter(
              (p) => normalizeStatus(p.status) === "PENDING"
            ).length}
            icon={<AlertCircle />}
            bg="#cbefe6ff"
            iconColor="#C2410C"
          />

          <StatCard
            title="Completed"
            value={passes.filter(
              (p) => normalizeStatus(p.status) === "COMPLETED"
            ).length}
            icon={<CheckCircle2 />}
            bg="#cbefe6ff"
            iconColor="#166534"
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
  );
};

/* ===========================
   STAT CARD (UNCHANGED UI)
=========================== */
const StatCard = ({ title, value, icon, bg, iconColor }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card
      sx={{
        height: 120,
        width: 270,
        borderRadius: 4,
        backgroundColor: bg,
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ height: "100%", p: 1.5 }}
      >
        <Box>
          <Typography fontSize={14} fontWeight={600} color="text.secondary">
            {title}
          </Typography>
          <Typography fontSize={34} fontWeight={900}>
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 50,
            height: 52,
            borderRadius: "50%",
            bgcolor: "#eef7f6ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: iconColor,
            boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
            ml: 2,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Card>
  </Grid>
);

export default Dashboard;
