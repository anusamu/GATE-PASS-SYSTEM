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
import PassDetails from "../components/PassDetailsDialog";

const API =
  import.meta.env.MODE === "production"
    ? "https://gate-pass-system-drti.onrender.com"
    : "http://localhost:5000";

const HodHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [open, setOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchHistory();
  }, [token]);

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
    <Box>
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
                <TableRow
                  key={pass._id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(pass)}
                >
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

      {/* Pass Details Dialog */}
      <PassDetails
        open={open}
        onClose={() => setOpen(false)}
        pass={selectedPass}
      />
    </Box>
  );
};

export default HodHistory;
