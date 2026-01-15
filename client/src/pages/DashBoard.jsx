import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
   InputAdornment 
} from '@mui/material';
import { 
  CloudUpload as UploadIcon, 
  Close as CloseIcon, 
  InfoOutlined as InfoIcon 
} from '@mui/icons-material';
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
      assetImage:"",
externalPersonPhone:"",

  });

  //  Cloudnary code 
  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "your_preset");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
    { method: "POST", body: data }
  );

  const json = await res.json();
  setFormData(prev => ({ ...prev, assetImage: json.secure_url }));
};


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
const sorted = res.data.sort(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
);
setPasses(sorted);
    } catch (err) {
      console.error(err.message);
    }
  };

  const recentPasses = passes.slice(0, 3);

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
      <Dialog 
  open={showPassModal} 
  onClose={() => setShowPassModal(false)} 
  fullWidth 
  maxWidth="sm"
  PaperProps={{
    sx: { borderRadius: 3, p: 1 } // Softer corners and inner padding
  }}
>
  <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
      Apply Gate Pass
    </Typography>
    <IconButton onClick={() => setShowPassModal(false)} size="small">
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent sx={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', py: 3 }}>
    <Stack spacing={3}>
      
      {/* Asset Information Section */}
      <Box>
        <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 1, display: 'block' }}>
          Asset Details
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField fullWidth name="assetName" label="Asset Name" variant="outlined" onChange={handleChange} required />
          <TextField fullWidth name="assetSerialNo" label="Serial Number" variant="outlined" onChange={handleChange} required />
        </Stack>
      </Box>

      {/* External Person Section */}
      <Box>
        <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 1, display: 'block' }}>
          Recipient Information
        </Typography>
        <Stack spacing={2}>
          <TextField fullWidth name="externalPersonName" label="External Person Name" onChange={handleChange} required />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField fullWidth name="externalPersonEmail" label="Email Address" onChange={handleChange} required />
            <TextField fullWidth name="externalPersonPhone" label="Phone Number" onChange={handleChange} />
          </Stack>
        </Stack>
      </Box>

      {/* Configuration Section */}
      <Box>
        <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 1, display: 'block' }}>
          Pass Configuration
        </Typography>
        <Stack spacing={2}>
          <TextField select fullWidth name="passType" label="Pass Type" onChange={handleChange} required defaultValue="">
            <MenuItem value="RETURNABLE">Returnable</MenuItem>
            <MenuItem value="NON_RETURNABLE">Non-Returnable</MenuItem>
          </TextField>

          {formData.passType === "RETURNABLE" && (
            <TextField
              fullWidth
              type="datetime-local"
              name="returnDateTime"
              label="Expected Return Date & Time"
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
              required
            />
          )}

          {/* Upload Area Refactored */}
          <Button
            variant="dashed" // If you use a custom theme, otherwise "outlined"
            component="label"
            sx={{ 
              py: 2, 
              borderStyle: 'dashed', 
              borderWidth: 2, 
              backgroundColor: 'action.hover',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <UploadIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              {formData.imageName || "Click to upload asset image (Optional)"}
            </Typography>
            <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
          </Button>
        </Stack>
      </Box>
    </Stack>
  </DialogContent>

  <DialogActions sx={{ p: 2.5 }}>
    <Button 
      onClick={() => setShowPassModal(false)} 
      sx={{ color: 'text.secondary', fontWeight: 600 }}
    >
      Cancel
    </Button>
    <Button 
      variant="contained" 
      onClick={handleSubmitPass} 
      disabled={loading}
      disableElevation
      sx={{ 
        px: 4, 
        py: 1, 
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 700
      }}
    >
      {loading ? "Processing..." : "Create Pass"}
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
