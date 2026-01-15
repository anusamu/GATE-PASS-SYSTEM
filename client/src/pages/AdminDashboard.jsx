import React, { useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

import Sidebar from "../components/SideBar";
import ProfileMenu from "../components/ProfileMenu";

/* ✅ CORRECT BASE */
const API = "http://localhost:5000/api/admin";

const AdminDashboard = () => {
  const role = "admin";
  const user = { role };

  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [users, setUsers] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [openAddUser, setOpenAddUser] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  /* =======================
     FETCH DATA
  ======================= */
  useEffect(() => {
    fetchUsers();
    fetchApprovedCount();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("User fetch failed", err);
    }
  };

  const fetchApprovedCount = async () => {
    try {
      const res = await axios.get(`${API}/passes/approved/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApprovedCount(res.data.count);
    } catch (err) {
      console.error("Approved count fetch failed", err);
    }
  };

  /* =======================
     ADD USER
  ======================= */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

      fetchUsers();
    } catch (err) {
      alert("Failed to create user");
    }
  };
const handleDeleteUser = async (id) => {
  const confirm = window.confirm("Are you sure you want to delete this user?");
  if (!confirm) return;

  try {
    await axios.delete(`${API}/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchUsers(); // refresh list
  } catch (err) {
    alert("Failed to delete user");
  }
};

  return (
    <Box
      component="main"
      sx={{
        ml: { sm: collapsed ? "72px" : "260px" },
        transition: "margin 0.3s",
        minHeight: "100vh",
        bgcolor: "#f0fdf4",
        p: 3,
      }}
    >
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <Stack spacing={4} maxWidth="1600px" mx="auto">

        {/* HEADER */}
        <Card
          sx={{
            p: 4,
            borderRadius: 5,
            background: "linear-gradient(90deg,#22c55e,#2563eb)",
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
              <Stack
                direction="row"
                justifyContent={{ xs: "flex-start", md: "flex-end" }}
                alignItems="center"
                spacing={2}
              >
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

        {/* STATS */}
        <Grid container spacing={4}>
          <StatCard
            title="Approved Passes"
            value={approvedCount}
            icon={<CheckCircleIcon fontSize="large" />}
          />
          <StatCard
            title="Total Users"
            value={users.length}
            icon={<PeopleIcon fontSize="large" />}
          />
        </Grid>

        {/* USER LIST */}
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography fontWeight={900} mb={2}>
              User Management
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell><b>Email</b></TableCell>
                    <TableCell><b>Role</b></TableCell>
                    <TableCell><b>Department</b></TableCell>
                    <TableCell><b>Action</b></TableCell>

                  </TableRow>
                </TableHead>

                <TableBody>
                  {users.map((u) => (
                   <TableRow key={u._id}>
  <TableCell>{u.name}</TableCell>
  <TableCell>{u.email}</TableCell>
  <TableCell sx={{ textTransform: "uppercase" }}>
    {u.role}
  </TableCell>
  <TableCell>{u.department || "-"}</TableCell>
  <TableCell>
    <Tooltip title="Delete User">
      <IconButton
        color="error"
        onClick={() => handleDeleteUser(u._id)}
        disabled={u.role === "admin"}
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  </TableCell>
</TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>

      {/* ADD USER DIALOG */}
      <Dialog
        open={openAddUser}
        onClose={() => setOpenAddUser(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle fontWeight={900}>Add New User</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} />
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} />

            <TextField select label="Role" name="role" value={formData.role} onChange={handleChange}>
              <MenuItem value="hod">HOD</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="security">Security</MenuItem>
            </TextField>

            {formData.role === "hod" && (
              <TextField select label="Department" name="department" value={formData.department} onChange={handleChange}>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Operations">Operations</MenuItem>
                <MenuItem value="Security">Security</MenuItem>
              </TextField>
            )}

            <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenAddUser(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleAddUser}
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.role ||
              !formData.password ||
              (formData.role === "hod" && !formData.department)
            }
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

/* =======================
   STAT CARD
======================= */
const StatCard = ({ title, value, icon }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ height: 170, borderRadius: 4, boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}>
      <CardContent
        sx={{
          height: "100%",
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

        <Box sx={{ p: 2.5, borderRadius: "50%", bgcolor: "#dcfce7", color: "#166534" }}>
          {icon}
        </Box>
      </CardContent>
    </Card>
  </Grid>
);

export default AdminDashboard;
