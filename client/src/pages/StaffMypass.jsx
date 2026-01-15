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

const API = "http://localhost:5000/api/auth";

const MyPass = () => {
  /* =========================
     SIDEBAR STATE
  ========================= */
  const [activeTab, setActiveTab] = useState("my-passes");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const user = { role: localStorage.getItem("role") };

  /* =========================
     PASSES STATE
  ========================= */
  const [passes, setPasses] = useState([]);

  useEffect(() => {
    fetchPasses();
  }, []);

  const fetchPasses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/staff/mypass`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Only APPROVED passes
      const approved = res.data.filter(
        (pass) => pass.status === "APPROVED"
      );

      setPasses(approved);
    } catch (error) {
      console.error("Failed to fetch passes", error);
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
          My Approved Passes
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Pass Type</b></TableCell>
                <TableCell><b>Asset Name</b></TableCell>
                <TableCell><b>Asset No</b></TableCell>
                  <TableCell><b>External Person</b></TableCell>
                    <TableCell><b>Email</b></TableCell>
                     <TableCell><b>Phone</b></TableCell>
                <TableCell><b>Approved By</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Date</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {passes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No approved passes found
                  </TableCell>
                </TableRow>
              ) : (
                passes.map((pass) => (
                  <TableRow key={pass._id}>
                    <TableCell>{pass.passType}</TableCell>
                    <TableCell>{pass.assetName}</TableCell>
                    <TableCell>{pass.assetSerialNo}</TableCell>
                     <TableCell>{pass.externalPersonName}</TableCell>
                    <TableCell>{pass.externalPersonEmail}</TableCell>
                    <TableCell>{pass.externalPersonPhone}</TableCell>
                    <TableCell>{pass.hod?.name || "-"}</TableCell>

                    <TableCell>
                      <Chip
                        label="APPROVED"
                        color="success"
                        size="small"
                      />
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

export default MyPass;
