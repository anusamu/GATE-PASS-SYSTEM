import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Stack,
  Chip,
} from "@mui/material";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

const API =
  import.meta.env.MODE === "production"
    ? "https://gate-pass-system-drti.onrender.com"
    : "http://localhost:5000";

const SecurityDashboard = () => {
  const [passData, setPassData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= QR SCANNER ================= */
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        if (loading) return;

        setLoading(true);
        setError("");
        setPassData(null);

        try {
          const res = await axios.post(`${API}/verify-qr`, {
            qrCode: decodedText,
          });

          setPassData(res.data);
        } catch (err) {
          setError(err.response?.data?.message || "Invalid or Expired Pass");
        } finally {
          setLoading(false);
        }
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [loading]);

  /* ================= MARK AS READ ================= */
  const markAsRead = async () => {
    try {
      await axios.put(`${API}/mark-used/${passData._id}`);
      setPassData({ ...passData, used: true });
    } catch {
      alert("Failed to mark as read");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Security QR Verification Dashboard
      </Typography>

      {/* ================= QR SCANNER ================= */}
      <Card sx={{ maxWidth: 400, mb: 3 }}>
        <CardContent>
          <div id="qr-reader" />
        </CardContent>
      </Card>

      {/* ================= ERROR ================= */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* ================= PASS DETAILS ================= */}
      {passData && (
        <Card sx={{ maxWidth: 500 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pass Details
            </Typography>

            <Stack spacing={1}>
              <Typography><b>Name:</b> {passData.requesterName}</Typography>
              <Typography><b>Department:</b> {passData.department}</Typography>
              <Typography><b>Purpose:</b> {passData.purpose}</Typography>
              <Typography>
                <b>Date:</b>{" "}
                {new Date(passData.createdAt).toLocaleDateString()}
              </Typography>

              <Chip
                label={passData.status}
                color={passData.status === "APPROVED" ? "success" : "error"}
              />

              {passData.used ? (
                <Alert severity="warning">Already Checked In</Alert>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={markAsRead}
                >
                  Mark as Read
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default SecurityDashboard;