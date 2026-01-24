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
const HodHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sidebar states
  const [activeTab, setActiveTab] = useState("history");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // ✅ SAFE USER (force hod role)
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : {};

  const user = {
    ...parsedUser,
    role: parsedUser?.role || "hod",
  };

  const token = localStorage.getItem("token");

  const API = "http://localhost:5000/api/auth";

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
    } catch (error) {
      console.error("HOD history fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "APPROVED") return "success";
    if (status === "REJECTED") return "error";
    return "warning"; // PENDING
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
        user={user}                 // ✅ always has role
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
          transition: "margin 0.3s ease",
          minHeight: "100vh",
          bgcolor: "#f0fdfa",
          p: { xs: 2, md: 3 },
        }}
      >
        {/* NAVBAR (REPLACED HEADER) */}
        <Navbar role="hod" setMobileOpen={setMobileOpen} />
        <Typography variant="h6" mb={2}>
          HOD Pass History
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><b>Pass ID</b></TableCell>
                <TableCell><b>Staff Name</b></TableCell>
                <TableCell><b>Purpose</b></TableCell>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Status</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No history available
                  </TableCell>
                </TableRow>
              ) : (
                history.map((pass) => (
                  <TableRow key={pass._id}>
                    <TableCell>{pass._id.slice(-6)}</TableCell>
                    <TableCell>{pass.requester?.name || "-"}</TableCell>
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
      
    </>
  );
};

export default HodHistory;
