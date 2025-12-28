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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Divider,
} from "@mui/material";

import {
  Shield,
  Plus,
  FileText,
  Users,
  AlertCircle,
  CheckCircle2,
  History,
  Mail,
  User,
  Package,
  Calendar,
} from "lucide-react";

/* ===========================
   API CONFIG
=========================== */
const API = "http://localhost:5000/api/auth";

const Dashboard = () => {
  const [passes, setPasses] = useState([]);
  const [showPassModal, setShowPassModal] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state

  const [formData, setFormData] = useState({
    externalPersonName: "",
    externalPersonEmail: "",
    assetName: "",
    assetSerialNo: "",
    passType: "",
    returnDateTime: "",
  });

  const token = localStorage.getItem("token");

  // Fetch passes on component mount
  useEffect(() => {
    fetchMyPasses();
  }, []);

  const fetchMyPasses = async () => {
    try {
      const res = await axios.get(`${API}/staff/mypass`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Use spread to avoid mutation and handle possible nulls
      setPasses([...res.data].reverse());
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ===========================
     SUBMIT PASS (Corrected)
  =========================== */
  const handleSubmitPass = async () => {
    try {
      setLoading(true);
      
      const payload = {
        ...formData,
        // Only send date if it's returnable
        returnDateTime: formData.passType === "RETURNABLE" ? formData.returnDateTime : null,
      };

      // FIX: Use template literals for the URL
      const res = await axios.post(`${API}/staff/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ ADD TO LIST (Ensure we grab the pass object from response)
      const createdPass = res.data.pass || res.data;
      setPasses((prev) => [createdPass, ...prev]);

      // RESET FORM
      setFormData({
        externalPersonName: "",
        externalPersonEmail: "",
        assetName: "",
        assetSerialNo: "",
        passType: "",
        returnDateTime: "",
      });

      setShowPassModal(false);
    } catch (err) {
      console.error("Submission Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create pass");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#e9fdf6", p: 3 }}>
      <Stack spacing={4} maxWidth="1600px" mx="auto">

        {/* ================= HEADER ================= */}
        <Card
          sx={{
            p: 4,
            borderRadius: 5,
            background:
              "linear-gradient(90deg, #7dd3fc 0%, #86efac 100%)",
            color: "#fff",
          }}
        >
          <Grid container alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Shield size={34} />
                <Typography variant="h5" fontWeight={900}>
                  STAFF GATE PASS
                </Typography>
              </Stack>
              <Typography mt={1}>
                Apply and track your gate pass requests
              </Typography>
            </Grid>

            <Grid item xs={12} md={4} textAlign="right">
              <Button
                startIcon={<Plus />}
                onClick={() => setShowPassModal(true)}
                sx={{
                  bgcolor: "#fff",
                  color: "#166534",
                  px: 4,
                  py: 1.6,
                  fontWeight: 900,
                  borderRadius: 3,
                }}
              >
                APPLY PASS
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* ================= STATS ================= */}
        <Grid container spacing={3}>
          <StatCard title="My Passes" value={passes.length} icon={<FileText />} />
          <StatCard
            title="Approved"
            value={passes.filter(p => p.status === "APPROVED").length}
            icon={<Users />}
          />
          <StatCard
            title="Pending"
            value={passes.filter(p => p.status === "PENDING").length}
            icon={<AlertCircle />}
          />
          <StatCard
            title="Completed"
            value={passes.filter(p => p.status === "COMPLETED").length}
            icon={<CheckCircle2 />}
          />
        </Grid>

        {/* ================= RECENT ACTIVITY ================= */}
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Stack direction="row" spacing={1} mb={3} alignItems="center">
              <History size={20} />
              <Typography fontWeight={800}>
                Recent Gate Pass Activity
              </Typography>
            </Stack>

            {passes.length === 0 ? (
              <Typography align="center" py={6}>
                No gate pass requests yet
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {passes.map((pass) => (
                  <PassCard key={pass._id} pass={pass} />
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Stack>

      {/* ================= APPLY PASS MODAL ================= */}
      <Dialog open={showPassModal} onClose={() => setShowPassModal(false)} fullWidth maxWidth="sm">
        <DialogTitle fontWeight={900}>Apply Gate Pass</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField name="externalPersonName" label="External Person Name" onChange={handleChange} />
            <TextField name="externalPersonEmail" label="External Person Email" onChange={handleChange} />
            <TextField name="assetName" label="Asset Name" onChange={handleChange} />
            <TextField name="assetSerialNo" label="Asset Serial Number" onChange={handleChange} />

            <TextField select name="passType" label="Pass Type" onChange={handleChange}>
              <MenuItem value="RETURNABLE">Returnable</MenuItem>
              <MenuItem value="NON_RETURNABLE">Non-Returnable</MenuItem>
            </TextField>

            {formData.passType === "RETURNABLE" && (
              <TextField
                name="returnDateTime"
                type="datetime-local"
                label="Return Date & Time"
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPassModal(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleSubmitPass}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

/* ===========================
   STAT CARD
=========================== */
const StatCard = ({ title, value, icon }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ borderRadius: 4 }}>
      <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="caption">{title}</Typography>
          <Typography variant="h5" fontWeight={900}>{value}</Typography>
        </Box>
        <Box sx={{ p: 1.5, bgcolor: "#e0f2f1", borderRadius: 2 }}>
          {icon}
        </Box>
      </CardContent>
    </Card>
  </Grid>
);

/* ===========================
   PASS CARD
=========================== */
const PassCard = ({ pass }) => (
  <Grid item xs={12} md={6} lg={4}>
    <Card
      sx={{
        borderRadius: 4,
        background: "linear-gradient(135deg, #e8f5e9, #e0f7fa)",
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontWeight={900}>Gate Pass</Typography>
          <Chip label={pass.status} size="small" />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <InfoRow icon={<User size={16} />} label="Requester" value={pass.requesterName} />
        <InfoRow icon={<Mail size={16} />} label="Email" value={pass.requesterEmail} />
        <InfoRow icon={<Package size={16} />} label="Asset" value={pass.assetName} />

        {pass.passType === "RETURNABLE" && (
          <InfoRow
            icon={<Calendar size={16} />}
            label="Return Date"
            value={pass.returnDateTime}
            highlight
          />
        )}
      </CardContent>
    </Card>
  </Grid>
);

const InfoRow = ({ icon, label, value, highlight }) => (
  <Box sx={{ display: "flex", gap: 1, p: highlight ? 1 : 0 }}>
    {icon}
    <Typography fontWeight={700}>{label}:</Typography>
    <Typography>{value || "-"}</Typography>
  </Box>
);

export default Dashboard;
