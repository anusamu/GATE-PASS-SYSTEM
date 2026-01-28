import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import AddUserDialog from "../components/AddUser";

const API =
  import.meta.env.MODE === "production"
    ? "https://gate-pass-system-drti.onrender.com"
    : "http://localhost:5000";

const AdminDashboard = () => {
  /* =======================
     AUTH
  ======================= */
  const token = localStorage.getItem("token");

  /* =======================
     DATA STATE
  ======================= */
  const [users, setUsers] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);

  /* =======================
     ADD USER STATE
  ======================= */
  const [openAddUser, setOpenAddUser] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    password: "",
  });

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
      setUsers(res.data || []);
    } catch (err) {
      console.error("User fetch failed", err);
    }
  };

  const fetchApprovedCount = async () => {
    try {
      const res = await axios.get(`${API}/passes/approved/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApprovedCount(res.data.count || 0);
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

  /* =======================
     DELETE USER
  ======================= */
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API}/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <Box>
      {/* USER TABLE */}
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

      {/* ADD USER DIALOG */}
      <AddUserDialog
        open={openAddUser}
        onClose={() => setOpenAddUser(false)}
        formData={formData}
        handleChange={handleChange}
        handleAddUser={handleAddUser}
        approvedCount={approvedCount}
        users={users}
      />
    </Box>
  );
};

export default AdminDashboard;
