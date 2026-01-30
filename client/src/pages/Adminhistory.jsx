import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import {   
  InputAdornment 
} from '@mui/material';
import { 
  Search,
  RestartAlt, 
  PictureAsPdf 
} from '@mui/icons-material';
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API =
  import.meta.env.MODE === "production"
    ? "https://gate-pass-system-drti.onrender.com"
    : "http://localhost:5000";

const AdminHistory = () => {
  const [passes, setPasses] = useState([]);
  const [filteredPasses, setFilteredPasses] = useState([]);

  const [filters, setFilters] = useState({
    name: "",
    department: "",
    status: "",
    date: "",
  });

  useEffect(() => {
    fetchPassHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, passes]);

  const fetchPassHistory = async () => {
    try {
      const res = await axios.get(`${API}/admin/pass`);
      setPasses(res.data);
      setFilteredPasses(res.data);
    } catch (error) {
      console.error("Failed to fetch pass history", error);
    }
  };

  /* ================= FILTER LOGIC ================= */
  const applyFilters = () => {
    let data = [...passes];

    if (filters.name) {
      data = data.filter((p) =>
        p.requesterName
          ?.toLowerCase()
          .includes(filters.name.toLowerCase())
      );
    }

    if (filters.department) {
      data = data.filter(
        (p) =>
          p.department?.toLowerCase() ===
          filters.department.toLowerCase()
      );
    }

    if (filters.status) {
      data = data.filter((p) => p.status === filters.status);
    }

    if (filters.date) {
      data = data.filter(
        (p) =>
          new Date(p.createdAt).toISOString().slice(0, 10) ===
          filters.date
      );
    }

    setFilteredPasses(data);
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      department: "",
      status: "",
      date: "",
    });
  };

  /* ================= PDF EXPORT ================= */
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Pass Request History", 14, 15);

    autoTable(doc, {
      startY: 22,
      head: [
        ["Pass ID", "Requester", "Department", "Purpose", "Status", "Date"],
      ],
      body: filteredPasses.map((p) => [
        p._id.slice(-6),
        p.requesterName,
        p.department,
        p.purpose,
        p.status,
        new Date(p.createdAt).toLocaleDateString(),
      ]),
    });

    doc.save("pass-history.pdf");
  };

  const getStatusChip = (status) => {
    const colors = {
      APPROVED: "success",
      PENDING: "warning",
      REJECTED: "error",
    };
    return <Chip label={status} color={colors[status]} size="small" />;
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Pass Request History
      </Typography>

      {/* ================= FILTER UI ================= */}
      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3 }}>
  <Stack 
    direction="row" 
    spacing={2} 
    flexWrap="wrap" 
    alignItems="center" 
    useFlexGap 
    sx={{ rowGap: 2 }}
  >
    {/* Requester Name with Search Icon */}
    <TextField
      label="Requester Name"
      name="name"
      placeholder="Search name..."
      value={filters.name}
      onChange={handleChange}
      size="small"
      sx={{ flexGrow: 1, minWidth: '200px' }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search fontSize="small" />
          </InputAdornment>
        ),
      }}
    />

    <TextField
      label="Department"
      name="department"
      value={filters.department}
      onChange={handleChange}
      size="small"
      sx={{ flexGrow: 1, minWidth: '180px' }}
    />

    <TextField
      select
      label="Status"
      name="status"
      value={filters.status}
      onChange={handleChange}
      size="small"
      sx={{ minWidth: 160 }}
    >
      <MenuItem value=""><em>All Statuses</em></MenuItem>
      <MenuItem value="APPROVED">Approved</MenuItem>
      <MenuItem value="PENDING">Pending</MenuItem>
      <MenuItem value="REJECTED">Rejected</MenuItem>
    </TextField>

    <TextField
      type="date"
      label="Date"
      name="date"
      value={filters.date}
      onChange={handleChange}
      size="small"
      InputLabelProps={{ shrink: true }}
      sx={{ minWidth: 160 }}
    />

    {/* Actions Group */}
    <Stack direction="row" spacing={1} sx={{ ml: { md: 'auto' } }}>
      <Button 
        variant="text" 
        color="inherit" 
        onClick={clearFilters}
        startIcon={<RestartAlt />}
      >
        Reset
      </Button>
      
      <Button
        variant="contained"
        disableElevation
        onClick={exportToPDF}
        startIcon={<PictureAsPdf />}
        sx={{ 
          bgcolor: 'primary.main',
          '&:hover': { bgcolor: 'primary.dark' },
          textTransform: 'none',
          fontWeight: 600,
          px: 3
        }}
      >
        Export PDF
      </Button>
    </Stack>
  </Stack>
</Paper>
      {/* ================= TABLE ================= */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Pass ID</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Department</b></TableCell>
              <TableCell><b>Purpose</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Date</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPasses.length ? (
              filteredPasses.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p._id.slice(-6)}</TableCell>
                  <TableCell>{p.requesterName}</TableCell>
                  <TableCell>{p.department}</TableCell>
                  <TableCell>{p.purpose}</TableCell>
                  <TableCell>{getStatusChip(p.status)}</TableCell>
                  <TableCell>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminHistory;
