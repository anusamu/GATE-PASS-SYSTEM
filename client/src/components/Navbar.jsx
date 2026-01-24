import React, { useState } from "react";
import {
  Stack,
  Card,
  Grid,
  Typography,
  IconButton,
  Button,
  Box,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

import { Shield, ShieldCheck, Plus } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import AddPass from "./AddPass";
import HodPassCreate from "./HodPasssCreate";
const API = "http://localhost:5000/api/auth";
const GRADIENT = "linear-gradient(90deg,#22c55e,#2563eb)";

/* =========================
   INTERNAL STAT CARD
========================= */
const StatBox = ({ title, value, icon }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card
      sx={{
        height: 150,
        borderRadius: 4,
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          height: "100%",
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography fontWeight={700} color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h3" fontWeight={900}>
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2.5,
            borderRadius: "50%",
            bgcolor: "#dcfce7",
            color: "#166534",
          }}
        >
          {icon}
        </Box>
      </Box>
    </Card>
  </Grid>
);

const Navbar = ({
  role,
  setMobileOpen,
  setOpenAddUser = () => {},   // ✅ safe default
  approvedCount = 0,
  users = [],
  pendingPasses = [],

  API,
  token,
  setPasses = () => {},       // ✅ safe default
}) => {
  const [showPassModal, setShowPassModal] = useState(false);

  /* =========================
     ADMIN NAVBAR
  ========================= */
  if (role === "admin") {
    return (
      <Stack spacing={4} maxWidth="1600px" mx="auto">
        <Card
          sx={{
            p: 4,
            borderRadius: 5,
            background: GRADIENT,
            color: "#fff",
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  sx={{ display: { sm: "none" }, color: "#fff" }}
                >
                  <MenuIcon />
                </IconButton>

                <AdminPanelSettingsIcon fontSize="large" />
                <Typography variant="h5" fontWeight={900}>
                  ADMIN DASHBOARD
                </Typography>
              </Stack>
              <Typography mt={1}>
                Manage users and system approvals
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button
                  startIcon={<PersonAddAltIcon />}
                  onClick={() => setOpenAddUser(true)}
                  sx={{
                    bgcolor: "#fff",
                    color: "#166534",
                    fontWeight: 900,
                    px: 4,
                    borderRadius: 3,
                  }}
                >
                  ADD USER
                </Button>
                <ProfileMenu />
              </Stack>
            </Grid>
          </Grid>
        </Card>

        <Grid container spacing={4}>
          <StatBox
            title="Approved Passes"
            value={approvedCount}
            icon={<CheckCircleIcon fontSize="large" />}
          />
          <StatBox
            title="Total Users"
            value={users.length}
            icon={<PeopleIcon fontSize="large" />}
          />
        </Grid>
      </Stack>
    );
  }

  /* =========================
     STAFF NAVBAR
  ========================= */
  if (role === "staff") {
    return (
      <Stack spacing={4} maxWidth="1400px" mx="auto">
        <Card
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 5,
            background: GRADIENT,
            color: "#fff",
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  sx={{ display: { sm: "none" }, color: "#fff" }}
                >
                  <MenuIcon />
                </IconButton>

                <Shield size={34} />
                <Typography variant="h5" fontWeight={900}>
                  STAFF GATE PASS
                </Typography>
              </Stack>
              <Typography mt={1} sx={{ opacity: 0.9 }}>
                Apply and track gate pass requests
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button
                  startIcon={<Plus />}
                  onClick={() => setShowPassModal(true)}
                  sx={{
                    bgcolor: "#fff",
                    color: "#2563eb",
                    px: 4,
                    py: 1.4,
                    fontWeight: 800,
                    borderRadius: 3,
                  }}
                >
                  APPLY PASS
                </Button>
                <ProfileMenu />
              </Stack>
            </Grid>
          </Grid>
        </Card>

        {/* ✅ Modal outside Card */}
        <AddPass
          open={showPassModal}
          onClose={() => setShowPassModal(false)}
          API={API}
          token={token}
          setPasses={setPasses}
        />
      </Stack>
    );
  }

  /* =========================
     HOD NAVBAR
  ========================= */
  if (role === "hod") {
    return (
      <Stack spacing={4} maxWidth="1500px" mx="auto">
        <Card
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 5,
            background: GRADIENT,
            color: "#fff",
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  sx={{ display: { sm: "none" }, color: "#fff" }}
                >
                  <MenuIcon />
                </IconButton>

                <ShieldCheck size={34} />
                <Typography variant="h5" fontWeight={900}>
                  HOD APPROVAL PANEL
                </Typography>
              </Stack>

              <Typography mt={1} sx={{ opacity: 0.9 }}>
                Review and approve staff gate pass requests
              </Typography>
            </Grid>
              <Button
                  startIcon={<Plus />}
                  onClick={() => setShowPassModal(true)}
                  sx={{
                    bgcolor: "#fff",
                    color: "#2563eb",
                    px: 4,
                    py: 1.4,
                    fontWeight: 800,
                    borderRadius: 3,
                  }}
                >
                  APPLY PASS
                </Button>

            <Grid item xs={12} md={4}>
              <Stack direction="row" justifyContent="flex-end">
                <ProfileMenu />
              </Stack>
            </Grid>
          </Grid>
        </Card>
<HodPassCreate
    open={showPassModal}
          onClose={() => setShowPassModal(false)}
          API={API}
          token={token}
          setPasses={setPasses}
          />
      
      </Stack>
    );
  }

  return null;
};

export default Navbar;
