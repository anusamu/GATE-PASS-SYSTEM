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
  ShieldCheck,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Package,
  Calendar,
} from "lucide-react";

const API = "http://localhost:5000/api/auth";

const HodDashboard = () => {
  const [pendingPasses, setPendingPasses] = useState([]);

  // ✅ REJECTION STATES (MUST BE INSIDE COMPONENT)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedPassId, setSelectedPassId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  /* ===========================
     FETCH PENDING PASSES
  =========================== */
  useEffect(() => {
    fetchPendingPasses();
  }, []);

  const fetchPendingPasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/hod/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingPasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ===========================
     APPROVE PASS
  =========================== */
  const approvePass = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPendingPasses((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  /* ===========================
     REJECT PASS (FINAL)
  =========================== */
  const rejectPass = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API}/reject/${selectedPassId}`,
        { reason: rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPendingPasses((prev) =>
        prev.filter((p) => p._id !== selectedPassId)
      );

      // reset dialog
      setRejectDialogOpen(false);
      setSelectedPassId(null);
      setRejectionReason("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#ecfdf5", p: 4 }}>
      <Stack spacing={4} maxWidth="1600px" mx="auto">

        {/* ================= HEADER ================= */}
        <Card
          sx={{
            p: 4,
            borderRadius: 5,
            background:
              "linear-gradient(90deg, #34d399 0%, #60a5fa 100%)",
            color: "#fff",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <ShieldCheck size={34} />
            <Typography variant="h5" fontWeight={900}>
              HOD APPROVAL PANEL
            </Typography>
          </Stack>
          <Typography mt={1}>
            Review and approve staff gate pass requests
          </Typography>
        </Card>

        {/* ================= PASS LIST ================= */}
        {pendingPasses.length === 0 ? (
          <Typography align="center" py={6}>
            No pending approvals 🎉
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {pendingPasses.map((pass) => (
              <Grid item xs={12} md={6} lg={4} key={pass._id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    background:
                      "linear-gradient(135deg, #e0f2fe, #dcfce7)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  }}
                >
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography fontWeight={900}>Gate Pass</Typography>
                      <Chip label="PENDING" color="warning" size="small" />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <InfoRow icon={<User size={16} />} label="Requester" value={pass.requesterName} />
                    <InfoRow icon={<Mail size={16} />} label="Email" value={pass.requesterEmail} />
                    <InfoRow icon={<Package size={16} />} label="Asset" value={pass.assetName} />
                    <InfoRow label="Serial No" value={pass.assetSerialNo} />

                    <Divider sx={{ my: 2 }} />

                    <InfoRow label="External Person" value={pass.externalPersonName} />
                    <InfoRow label="External Email" value={pass.externalPersonEmail} />

                    {pass.passType === "RETURNABLE" && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <InfoRow
                          icon={<Calendar size={16} />}
                          label="Return Date"
                          value={pass.returnDateTime}
                          highlight
                        />
                      </>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Stack direction="row" spacing={2}>
                      <Button
                        fullWidth
                        startIcon={<CheckCircle />}
                        color="success"
                        variant="contained"
                        onClick={() => approvePass(pass._id)}
                      >
                        Approve
                      </Button>

                      <Button
                        fullWidth
                        startIcon={<XCircle />}
                        color="error"
                        variant="outlined"
                        onClick={() => {
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

      {/* ================= REJECT DIALOG (GLOBAL) ================= */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle fontWeight={900}>Reject Gate Pass</DialogTitle>

        <DialogContent dividers>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Reason for rejection"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={rejectPass}
            disabled={!rejectionReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

/* ===========================
   INFO ROW
=========================== */
const InfoRow = ({ icon, label, value, highlight }) => (
  <Box
    sx={{
      display: "flex",
      gap: 1,
      mb: 0.8,
      p: highlight ? 1 : 0,
      borderRadius: 2,
      bgcolor: highlight ? "#dcfce7" : "transparent",
    }}
  >
    {icon}
    <Typography fontWeight={700}>{label}:</Typography>
    <Typography>{value || "-"}</Typography>
  </Box>
);

export default HodDashboard;
