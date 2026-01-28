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
import PassDetails from "../components/PassDetailsDialog";

const API =
  import.meta.env.MODE === "production"
    ? "https://gate-pass-system-drti.onrender.com"
    : "http://localhost:5000";

const MyPass = () => {
  // PASS DETAILS DIALOG
  const [open, setOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);

  // PASSES STATE
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

      const approved = res.data.filter(
        (pass) => pass.status === "APPROVED"
      );

      setPasses(approved);
    } catch (error) {
      console.error("Failed to fetch passes", error);
    }
  };

  const handleRowClick = (pass) => {
    setSelectedPass(pass);
    setOpen(true);
  };

  return (
    <Box>
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
                <TableCell colSpan={9} align="center">
                  No approved passes found
                </TableCell>
              </TableRow>
            ) : (
              passes.map((pass) => (
                <TableRow
                  key={pass._id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(pass)}
                >
                  <TableCell>{pass.passType}</TableCell>
                  <TableCell>{pass.assetName}</TableCell>
                  <TableCell>{pass.assetSerialNo}</TableCell>
                  <TableCell>{pass.externalPersonName}</TableCell>
                  <TableCell>{pass.externalPersonEmail}</TableCell>
                  <TableCell>{pass.externalPersonPhone}</TableCell>
                  <TableCell>{pass.hod?.name || "-"}</TableCell>
                  <TableCell>
                    <Chip label="APPROVED" color="success" size="small" />
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

      <PassDetails
        open={open}
        onClose={() => setOpen(false)}
        pass={selectedPass}
      />
    </Box>
  );
};

export default MyPass;
