import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import {
  CheckCircle,
  XCircle,
  User,
  Package,
  ShieldCheck,
  Building2,
  Clock,
} from "lucide-react";

import { useOutletContext, Navigate } from "react-router-dom";
import PassDetails from "../components/PassDetailsDialog";

const CSODashboard = () => {
  const { token, API, user } = useOutletContext();

  /* =======================
     STATE MANAGEMENT
  ======================= */
  const [allPasses, setAllPasses] = useState([]); // Used for Stats
  const [pendingPasses, setPendingPasses] = useState([]); // Used for Live Queue
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedPassId, setSelectedPassId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);

  // ⛔ Role Guard: Ensure only CSO can access
  if (user.role?.toLowerCase() !== "cso") {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/admin/pass`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data || [];
      setAllPasses(data);
      
      // STRICT FILTER: Only show what needs action right now
      const onlyPending = data.filter((p) => p.status === "PENDING");
      setPendingPasses(onlyPending);
    } catch (err) {
      console.error("FETCH CSO DATA ERROR:", err);
    }
  };

  const approvePass = async (id) => {
    try {
      await axios.put(
        `${API}/approve/${id}`,
        { approvedBy: user.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh both stats and list
      fetchData();
    } catch (err) {
      alert("Approval action failed.");
    }
  };

  const rejectPass = async () => {
    try {
      await axios.put(
        `${API}/reject/${selectedPassId}`,
        { reason: rejectionReason, rejectedBy: user.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRejectDialogOpen(false);
      setSelectedPassId(null);
      setRejectionReason("");
      fetchData();
    } catch (err) {
      alert("Rejection action failed.");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={4}>
        
        {/* =======================
            HEADER & STATS SECTION
        ======================== */}
        <Stack spacing={3}>
          

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 3, bgcolor: "#eff6ff", border: "1px solid #dbeafe", boxShadow: 'none' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="#1e40af" fontWeight={700}>PENDING REQUESTS</Typography>
                  <Typography variant="h4" fontWeight={900} color="#1e40af">
                    {pendingPasses.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 3, bgcolor: "#f0fdf4", border: "1px solid #dcfce7", boxShadow: 'none' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="#15803d" fontWeight={700}>TOTAL APPROVED</Typography>
                  <Typography variant="h4" fontWeight={900} color="#15803d">
                    {allPasses.filter(p => p.status === "APPROVED").length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 3, bgcolor: "#fef2f2", border: "1px solid #fee2e2", boxShadow: 'none' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="#b91c1c" fontWeight={700}>TOTAL REJECTED</Typography>
                  <Typography variant="h4" fontWeight={900} color="#b91c1c">
                    {allPasses.filter(p => p.status === "REJECTED").length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>

        <Divider />

        <Typography variant="h6" fontWeight={800} color="text.primary">
          Live Pending Queue
        </Typography>

        {/* =======================
            LIVE QUEUE SECTION
        ======================== */}
        {pendingPasses.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10, bgcolor: 'white', borderRadius: 4, border: '2px dashed #e2e8f0' }}>
            <Clock size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
            <Typography variant="h6" color="text.secondary" fontWeight={700}>
              No Pending Requests
            </Typography>
            <Typography variant="body2" color="text.disabled">
              All requests have been processed and moved to History.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {pendingPasses.map((pass) => (
              <Grid item xs={12} md={6} lg={4} key={pass._id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                    "&:hover": { transform: "translateY(-4px)", cursor: "pointer" },
                    transition: "all 0.2s"
                  }}
                  onClick={() => {
                    setSelectedPass(pass);
                    setOpen(true);
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" mb={2}>
                      <Chip
                        icon={<Building2 size={14} />}
                        label={pass.department}
                        size="small"
                        sx={{ fontWeight: 800, bgcolor: "#eff6ff", color: "#1e40af" }}
                      />
                      <Chip label="PENDING" color="warning" size="small" sx={{ fontWeight: 900 }} />
                    </Stack>

                    <InfoRow icon={<User size={18} />} label="Staff" value={pass.requesterName} />
                    <InfoRow icon={<Package size={18} />} label="Asset" value={pass.assetName} />
                    
                    <Divider sx={{ my: 2 }} />

                    <Stack direction="row" spacing={2}>
                      <Button
                        fullWidth
                        startIcon={<CheckCircle size={18} />}
                        variant="contained"
                        sx={{ bgcolor: "#22c55e", fontWeight: 700, borderRadius: 2, "&:hover": { bgcolor: "#16a34a" } }}
                        onClick={(e) => {
                          e.stopPropagation();
                          approvePass(pass._id);
                        }}
                      >
                        Approve
                      </Button>

                      <Button
                        fullWidth
                        startIcon={<XCircle size={18} />}
                        variant="outlined"
                        color="error"
                        sx={{ fontWeight: 700, borderRadius: 2 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPassId(pass._id);
                          setRejectDialogOpen(true);
                        }}
                      >
                        Reject
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>

      {/* REJECTION DIALOG */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle fontWeight={900}>Confirm Rejection</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Please provide a reason for rejecting this pass..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={rejectPass}
            disabled={!rejectionReason.trim()}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>

      {/* PASS DETAILS DIALOG */}
      <PassDetails open={open} onClose={() => setOpen(false)} pass={selectedPass} />
    </Box>
  );
};

/* REUSABLE INFO ROW COMPONENT */
const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
    <Box sx={{ color: "text.secondary", display: "flex" }}>{icon}</Box>
    <Typography variant="body2" fontWeight={800} sx={{ minWidth: "70px" }}>{label}:</Typography>
    <Typography variant="body2">{value || "N/A"}</Typography>
  </Box>
);

export default CSODashboard;