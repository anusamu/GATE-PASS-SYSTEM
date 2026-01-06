import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

import {
  Shield,
  Plus,
  FileText,
  Users,
  AlertCircle,
  CheckCircle2,
  History,
} from "lucide-react";

import PassCard from "../components/PassCard";
import ProfileMenu from "../components/ProfileMenu";
import Sidebar from "../components/SideBar";

const API = "http://localhost:5000/api/auth";
const GRADIENT = "linear-gradient(135deg,#2563eb,#22c55e)";

const Dashboard = () => {
  const [passes, setPasses] = useState([]);
  const [showPassModal, setShowPassModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [formData, setFormData] = useState({
    externalPersonName: "",
    externalPersonEmail: "",
    assetName: "",
    assetSerialNo: "",
    passType: "",
    returnDateTime: "",
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "staff";
  const user = { role };

  useEffect(() => {
    if (token) fetchPasses();
  }, []);

  const fetchPasses = async () => {
    try {
      const endpoint =
        role === "hod"
          ? `${API}/hod/passes`
          : `${API}/staff/mypass`;

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPasses(res.data.reverse());
    } catch (err) {
      console.error(err.message);
    }
  };

  const recentPasses = passes.slice(0, 4);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmitPass = async () => {
    try {
      setLoading(true);

      const payload = {
        ...formData,
        returnDateTime:
          formData.passType === "RETURNABLE"
            ? formData.returnDateTime
            : null,
      };

      const res = await axios.post(`${API}/staff/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPasses((prev) => [res.data.pass || res.data, ...prev]);
      setShowPassModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        ml: { sm: collapsed ? "72px" : "260px" },
        transition: "margin 0.3s",
      }}
    >
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <Stack spacing={4} maxWidth="1400px" px={{ xs: 2, md: 4 }} mx="auto">
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

                <Shield size={34} />
                <Typography variant="h5" fontWeight={900}>
                  {role.toUpperCase()} GATE PASS
                </Typography>
              </Stack>
              <Typography mt={1} sx={{ opacity: 0.9 }}>
                Apply and track gate pass requests
              </Typography>
            </Grid>

            {role === "staff" && (
              <Grid item xs={12} md={4}>
                <Stack
                  direction="row"
                  justifyContent={{ xs: "flex-start", md: "flex-end" }}
                >
                  <Button
                    startIcon={<Plus />}
                    onClick={() => setShowPassModal(true)}
                    sx={{
                      bgcolor: "#fff",
                      color: "#2563eb",
                      px: 4,
                      py: 1.4,
                      fontWeight: 800,
                      borderRadius: 3,
                      marginLeft:70
                    }}
                  >
                    APPLY PASS
                  </Button>
                  <ProfileMenu  />
                </Stack>
              </Grid>
            )}
          </Grid>
        </Card>

        {/* STATS */}
        <Grid container spacing={3}>
          <StatCard title="Total Passes" value={passes.length} icon={<FileText />} />
          <StatCard title="Approved" value={passes.filter(p => p.status === "APPROVED").length} icon={<Users />} />
          <StatCard title="Pending" value={passes.filter(p => p.status === "PENDING").length} icon={<AlertCircle />} />
          <StatCard title="Completed" value={passes.filter(p => p.status === "COMPLETED").length} icon={<CheckCircle2 />} />
        </Grid>

        {/* RECENT PASSES */}
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Stack direction="row" spacing={1} mb={3} alignItems="center">
              <History size={20} />
              <Typography fontWeight={800}>
                Recent Gate Pass Activity
              </Typography>
            </Stack>

            <Grid container spacing={3}>
              {recentPasses.length === 0 ? (
                <Typography align="center" width="100%" py={6}>
                  No gate pass requests yet
                </Typography>
              ) : (
                recentPasses.map((pass) => (
                  <Grid key={pass._id} item xs={12} sm={6} lg={3}>
                    <PassCard pass={pass} role={role} />
                  </Grid>
                ))
              )}
            </Grid>
          </CardContent>
        </Card>
      </Stack>

      {/* APPLY PASS MODAL */}
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPassModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitPass} disabled={loading}>
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
    <Card sx={{ borderRadius: 4, p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={900}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ p: 2, borderRadius: "50%", bgcolor: "#e0f2fe", color: "#2563eb" }}>
          {icon}
        </Box>
      </Stack>
    </Card>
  </Grid>
);

export default Dashboard;
