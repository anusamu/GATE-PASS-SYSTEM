import React, { useState } from "react";
import axios from "axios";
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
import AddUserDialog from "../components/AddUser";

const GRADIENT = "linear-gradient(135deg,#2563eb,#22c55e)";

/* ================= STAT CARD ================= */
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

/* ================= NAVBAR ================= */
const Navbar = ({
  role,
  setMobileOpen,
  approvedCount = 0,
  users = [],
  API,
  token,
  setPasses = () => {},
  onUserAdded = () => {}, // ✅ callback to refresh users
}) => {
  const [showPassModal, setShowPassModal] = useState(false);

  /* ================= ADD USER STATE ================= */
  const [openAddUser, setOpenAddUser] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async () => {
    try {
      await axios.post(`${API}/create-user`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOpenAddUser(false);
      setFormData({
        name: "",
        email: "",
        role: "",
        department: "",
        password: "",
      });

      onUserAdded(); // 🔥 refresh user list in parent
    } catch (err) {
      alert("Failed to create user");
    }
  };

  /* ================= ADMIN ================= */
  if (role === "admin") {
    return (
      <Stack spacing={4} maxWidth="1400px" mx="auto" width="100%">
        <Card
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 5,
            background: GRADIENT,
            color: "#fff",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent={{ xs: "center", md: "space-between" }}
            alignItems="center"
            spacing={2}
          >
            <Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  sx={{ display: { xs: "inline-flex", sm: "none" }, color: "#fff" }}
                >
                  <MenuIcon />
                </IconButton>
                <AdminPanelSettingsIcon fontSize="large" />
                <Typography variant="h5" fontWeight={900}>
                  ADMIN DASHBOARD
                </Typography>
              </Stack>
              <Typography mt={1} sx={{ opacity: 0.9 }}>
                Manage users and system approvals
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                startIcon={<PersonAddAltIcon />}
                onClick={() => setOpenAddUser(true)}
              sx={{ bgcolor: "#fff", color: "#166534", fontWeight: 900, px: 4, 
              marginLeft:70,
               py: 1.2,  borderRadius: 3, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#f0f0f0' } }}
              >
                ADD USER
              </Button>
              <ProfileMenu />
            </Stack>
          </Stack>
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

        <AddUserDialog
          open={openAddUser}
          onClose={() => setOpenAddUser(false)}
          formData={formData}
          handleChange={handleChange}
          handleAddUser={handleAddUser}
        />
      </Stack>
    );
  }

  /* ================= STAFF ================= */
  if (role === "staff") {
    return (
      <Stack spacing={2} maxWidth="1400px" mx="auto">
        <Card sx={{ p: 4, borderRadius: 5, background: GRADIENT, color: "#fff" }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5" fontWeight={900}>
              STAFF GATE PASS
            </Typography>
            <Button
              startIcon={<Plus />}
              onClick={() => setShowPassModal(true)}
              
            sx={{ bgcolor: "#fff", color: "#166534", fontWeight: 900, px: 4, 
              marginLeft:70,
               py: 1.2,  borderRadius: 3, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#f0f0f0' } }}
            >
              APPLY PASS
            </Button>
            <ProfileMenu />
          </Stack>
        </Card>

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

  /* ================= HOD ================= */
  if (role === "hod") {
    return (
      <Stack spacing={2} maxWidth="1400px" mx="auto">
        <Card sx={{ p: 4, borderRadius: 5, background: GRADIENT, color: "#fff" }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5" fontWeight={900}>
              HOD APPROVAL PANEL
            </Typography>
            <Button
              startIcon={<Plus />}
              onClick={() => setShowPassModal(true)}
               sx={{ bgcolor: "#fff", color: "#166534", fontWeight: 900, px: 4, 
              marginLeft:70,
               py: 1.2,  borderRadius: 3, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#f0f0f0' } }}
               >
              APPLY PASS
            </Button>
            <ProfileMenu />
          </Stack>
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
