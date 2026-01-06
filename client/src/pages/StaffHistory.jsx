import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import Sidebar from "../components/SideBar";

const API = "http://localhost:5000/api";

/* =========================
   STATUS CHIP
========================= */
const StatusChip = ({ status }) => {
  if (status === "APPROVED")
    return <Chip label="APPROVED" color="success" size="small" />;
  if (status === "REJECTED")
    return <Chip label="REJECTED" color="error" size="small" />;
  return <Chip label="PENDING" color="warning" size="small" />;
};

const History = () => {
  /* =========================
     SIDEBAR STATE
  ========================= */
  const [activeTab, setActiveTab] = useState("history");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const user = { role: localStorage.getItem("role") };

  /* =========================
     PASSES STATE
  ========================= */
  const [passes, setPasses] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/passes/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPasses(res.data);
    } catch (error) {
      console.error("Failed to fetch history", error);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        ml: { sm: collapsed ? "72px" : "260px" },
        transition: "margin 0.3s",
      }}
    >
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

      {/* PAGE CONTENT */}
      <Box p={3}>
        <Typography variant="h6" fontWeight={800} mb={2}>
          Gate Pass History
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Pass Type</b></TableCell>
                <TableCell><b>Asset Name</b></TableCell>
                <TableCell><b>Asset No</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Date</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {passes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No history available
                  </TableCell>
                </TableRow>
              ) : (
                passes.map((pass) => (
                  <TableRow key={pass._id}>
                    <TableCell>{pass.passType}</TableCell>
                    <TableCell>{pass.assetName}</TableCell>
                    <TableCell>{pass.assetNumber}</TableCell>
                    <TableCell>
                      <StatusChip status={pass.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(pass.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default History;
