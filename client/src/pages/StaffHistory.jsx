import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import PassDetails from "../components/PassDetailsDialog";

const StaffHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);

  const [showPassModal, setShowPassModal] = useState(false);
  const [activeTab, setActiveTab] = useState("history");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // ✅ FORCE USER ROLE
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : {};

  const user = {
    ...parsedUser,
    role: parsedUser?.role || "staff",
  };

  const token = localStorage.getItem("token");
  const API = "https://gate-pass-system-drti.onrender.com";
  const role = user.role;

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory(res.data.data || []);
    } catch (err) {
      console.error("History error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "APPROVED") return "success";
    if (status === "REJECTED") return "error";
    return "warning";
  };

  const handleRowClick = (pass) => {
    setSelectedPass(pass);
    setOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

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
        <Navbar
          role={role}
          setMobileOpen={setMobileOpen}
          setShowPassModal={setShowPassModal}
        />

        <Typography variant="h6" mb={2}>
          Staff Pass History
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><b>Pass ID</b></TableCell>
                <TableCell><b>Purpose</b></TableCell>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Status</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No history available
                  </TableCell>
                </TableRow>
              ) : (
                history.map((pass) => (
                  <TableRow
                    key={pass._id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(pass)}
                  >
                    <TableCell>{pass._id.slice(-6)}</TableCell>
                    <TableCell>{pass.purpose || "-"}</TableCell>
                    <TableCell>
                      {new Date(pass.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={pass.status}
                        color={getStatusColor(pass.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <PassDetails
        open={open}
        onClose={() => setOpen(false)}
        pass={selectedPass}
      />
    </>
  );
};

export default StaffHistory;
