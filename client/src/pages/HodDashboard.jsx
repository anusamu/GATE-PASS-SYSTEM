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
  FileText,
} from "lucide-react";

import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import PassDetails from "../components/PassDetailsDialog";

const API = "http://localhost:5000/api/auth";

const HodDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [pendingPasses, setPendingPasses] = useState([]);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedPassId, setSelectedPassId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || { role: "hod" };

  useEffect(() => {
    if (!token || user.role !== "hod") return;
    fetchPendingPasses();
  }, [token]);

  const fetchPendingPasses = async () => {
    try {
      const res = await axios.get(`${API}/hod/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingPasses(res.data || []);
    } catch (err) {
      console.error("FETCH PENDING ERROR:", err);
    }
  };

  const approvePass = async (id) => {
    await axios.put(
      `${API}/hod/approve/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPendingPasses((prev) => prev.filter((p) => p._id !== id));
  };

  const rejectPass = async () => {
    await axios.put(
      `${API}/hod/reject/${selectedPassId}`,
      { reason: rejectionReason },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setPendingPasses((prev) =>
      prev.filter((p) => p._id !== selectedPassId)
    );

    setRejectDialogOpen(false);
    setSelectedPassId(null);
    setRejectionReason("");
  };

  return (
    <>
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

      {/* MAIN CONTENT */}
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

        <Stack spacing={4} maxWidth="1500px" mx="auto">
          {/* PASS LIST */}
          {pendingPasses.length === 0 ? (
            <Typography align="center" py={6} fontWeight={700}>
              No pending approvals 🎉
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {pendingPasses.map((pass) => (
                <Grid item xs={12} md={6} lg={4} key={pass._id}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      bgcolor: "#ffffff",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedPass(pass);
                      setOpen(true);
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
                      <InfoRow icon={<FileText size={16} />} label="Purpose" value={pass.purpose} />
                      <InfoRow label="Serial No" value={pass.assetSerialNo} />

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
                          variant="contained"
                          sx={{ bgcolor: "#22c55e" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            approvePass(pass._id);
                          }}
                        >
                          Approve
                        </Button>

                        <Button
                          fullWidth
                          startIcon={<XCircle />}
                          variant="outlined"
                          color="error"
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

        {/* REJECT DIALOG */}
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

      {/* PASS DETAILS DIALOG */}
      <PassDetails
        open={open}
        onClose={() => setOpen(false)}
        pass={selectedPass}
      />
    </>
  );
};

/* ================= INFO ROW ================= */
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
