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
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Package,
  Calendar,
} from "lucide-react";

import ProfileMenu from "../components/ProfileMenu";
import Sidebar from "../components/SideBar";

const API = "http://localhost:5000/api/auth";
const GRADIENT = "linear-gradient(135deg,#2563eb,#22c55e)";

const HodDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [pendingPasses, setPendingPasses] = useState([]);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedPassId, setSelectedPassId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const user = { role };

  useEffect(() => {
    if (!token || role !== "hod") return;
    fetchPendingPasses();
  }, [token, role]);

  const fetchPendingPasses = async () => {
    try {
      const res = await axios.get(`${API}/hod/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingPasses(res.data);
    } catch (err) {
      console.error(err);
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

      <Stack spacing={4} maxWidth="1500px" mx="auto">

        {/* HEADER */}
        <Card
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 5,
            background: GRADIENT,
            color: "#fff",
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  sx={{ display: { sm: "none" }, color: "#fff" }}
                >
                  <MenuIcon />
                </IconButton>

                <ShieldCheck size={34} />
                <Typography variant="h5" fontWeight={900}>
                  HOD APPROVAL PANEL
                </Typography>
              </Stack>

              <Typography mt={1} sx={{ opacity: 0.9 }}>
                Review and approve staff gate pass requests
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack
                direction="row"
                justifyContent={{ xs: "flex-start", md: "flex-end" }}
              marginLeft={85}
              >
                <ProfileMenu />
              </Stack>
            </Grid>
          </Grid>
        </Card>

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
                  }}
                >
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography fontWeight={900}>
                        Gate Pass
                      </Typography>
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
                        variant="contained"
                        sx={{ bgcolor: "#22c55e" }}
                        onClick={() => approvePass(pass._id)}
                      >
                        Approve
                      </Button>

                      <Button
                        fullWidth
                        startIcon={<XCircle />}
                        variant="outlined"
                        color="error"
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

      {/* REJECT DIALOG */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle fontWeight={900}>
          Reject Gate Pass
        </DialogTitle>

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
          <Button onClick={() => setRejectDialogOpen(false)}>
            Cancel
          </Button>
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
