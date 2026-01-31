import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  Alert,
  Stack,
  Chip,
  Container,
  Paper,
  Divider,
  Fade,
  Avatar,
  IconButton,
} from "@mui/material";
import { 
  QrCodeScanner, 
  CheckCircle, 
  Person, 
  Business, 
  Info, 
  AccessTime,
  CameraAlt,
  VerifiedUser
} from "@mui/icons-material";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import ProfileMenu from "../components/ProfileMenu";
const API = import.meta.env.MODE === "production"
    ? "https://gate-pass-system-drti.onrender.com"
    : "http://localhost:5000";

const SecurityDashboard = () => {
  const [passData, setPassData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannerStarted, setScannerStarted] = useState(false);

  useEffect(() => {
    if (!scannerStarted) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      async (decodedText) => {
        if (loading) return;
        setLoading(true);
        setError("");
        try {
          const res = await axios.post(`${API}/verify-qr`, { qrCode: decodedText });
          setPassData(res.data);
        } catch (err) {
          setPassData(null);
          setError(err.response?.data?.message || "Invalid or Expired Pass");
        } finally {
          setLoading(false);
        }
      },
      () => {}
    );

    return () => scanner.clear().catch(() => {});
  }, [scannerStarted, loading]);

  const markAsRead = async () => {
    try {
      await axios.put(`${API}/mark-used/${passData._id}`);
      setPassData({ ...passData, used: true });
    } catch {
      alert("Failed to mark as read");
    }
  };

  return (
    
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e1fffd 100%)", // Light Blue to Mint
        py: 6,
      }}
    >
      <Box sx={{
        minHeight: "2vh",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e1fffd 100%)", // Light Blue to Mint
        marginLeft:"95%"
      }}><ProfileMenu /></Box>

      <Container maxWidth="md">
        {/* Header Section */}
        <Box textAlign="center" mb={4}>
          <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={1}>
            <VerifiedUser sx={{ color: "#059669", fontSize: 32 }} />
            <Typography variant="h4" fontWeight={600} sx={{ color: "#1e293b", letterSpacing: -0.4 }}>
              SECURITY<span style={{ color: "#0ea5e9" }}>OFFICER</span>
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500 }}>
            Secure QR Entry Verification System
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          
          {/* LEFT: Scanner Area */}
          <Box flex={1}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 6,
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                border: "1px solid #176ee0ff",
                textAlign: "center"
              }}
            >
              {!scannerStarted ? (
                <Box py={4}>
                  <Avatar sx={{ width: 80, height: 80, bgcolor: "#ecfdf5", mx: "auto", mb: 3 }}>
                    <CameraAlt sx={{ fontSize: 40, color: "#10b981" }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Ready to scan?
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={4}>
                    Camera access is required to verify visitor gate passes.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setScannerStarted(true)}
                    sx={{
                      borderRadius: "16px",
                      px: 4,
                      py: 1.5,
                      textTransform: "none",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)",
                      boxShadow: "0 10px 20px -5px rgba(16, 185, 129, 0.4)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 15px 25px -5px rgba(16, 185, 129, 0.5)",
                      },
                      transition: "all 0.3s ease"
                    }}
                  >
                    Activate Camera
                  </Button>
                </Box>
              ) : (
                <Box id="qr-reader" sx={{ border: "none !important", borderRadius: 4, overflow: "hidden" }} />
              )}
            </Paper>
          </Box>

          {/* RIGHT: Results Area */}
          <Box flex={1.2}>
            {error && (
              <Alert severity="error" variant="filled" sx={{ mb: 2, borderRadius: 3, bgcolor: "#ef4444" }}>
                {error}
              </Alert>
            )}

            {passData ? (
              <Fade in={!!passData}>
                <Card sx={{ borderRadius: 6, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
                  <Box sx={{ p: 4 }}>
                    <Stack direction="row" justifyContent="space-between" mb={3}>
                      <Chip 
                        label="Visitor Pass" 
                        sx={{ bgcolor: "#f0f9ff", color: "#0369a1", fontWeight: 700 }} 
                      />
                      <Chip 
                        label={passData.status} 
                        color={passData.status === "APPROVED" ? "success" : "error"}
                        sx={{ fontWeight: 800 }}
                      />
                    </Stack>

                    <Stack spacing={3}>
                      <InfoItem icon={<Person color="primary"/>} label="Name" value={passData.requesterName} />
                      <InfoItem icon={<Business color="primary"/>} label="Department" value={passData.department} />
                      <InfoItem icon={<Info color="primary"/>} label="Purpose" value={passData.purpose} />
                      <InfoItem icon={<AccessTime color="primary"/>} label="Generated" value={new Date(passData.createdAt).toLocaleDateString()} />
                    </Stack>

                    <Box mt={4}>
                      {passData.used ? (
                        <Alert icon={<CheckCircle />} sx={{ borderRadius: 3, bgcolor: "#fff7ed", color: "#9a3412", border: "1px solid #ffedd5" }}>
                          This pass Verified.
                        </Alert>
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={markAsRead}
                          sx={{
                            py: 2,
                            borderRadius: 4,
                            fontWeight: 800,
                            fontSize: "1rem",
                            background: "#12d262ff", // Dark contrast button
                            "&:hover": { background: "#0f172a" }
                          }}
                        >
                           Mark as Read
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Card>
              </Fade>
            ) : (
              <Paper sx={{ 
                height: "100%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                borderRadius: 6, 
                bgcolor: "rgba(255,255,255,0.4)",
                border: "2px dashed #cbd5e1"
              }}>
                <Typography color="text.secondary">Scan a QR code to view details</Typography>
              </Paper>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

// Sub-component for clean rows
const InfoItem = ({ icon, label, value }) => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Box sx={{ bgcolor: "#f1f5f9", p: 1, borderRadius: 2, display: "flex" }}>{icon}</Box>
    <Box>
      <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={700} color="#1e293b">
        {value}
      </Typography>
    </Box>
  </Stack>
);

export default SecurityDashboard;