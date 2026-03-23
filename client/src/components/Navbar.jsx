import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Stack,
  Card,
  Grid,
  Typography,
  IconButton,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import SettingsIcon from "@mui/icons-material/Settings"; // Import Gear Icon
import DeleteIcon from "@mui/icons-material/Delete";



import { Plus } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import AddPass from "./AddPass";
import HodPassCreate from "./HodPasssCreate";
import AddUserDialog from "../components/AddUser";

const GRADIENT = "linear-gradient(135deg,#2563eb,#22c55e)";

/* ================= STAT CARD ================= */
const StatBox = ({ title, value, icon, onClick }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card
      onClick={onClick}
      sx={{
        height: 150,
        borderRadius: 4,
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s",
        "&:hover": onClick ? { transform: "translateY(-5px)" } : {},
      }}
    >
      <Box
        sx={{
          height: "100%",
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography fontWeight={700} color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={900}>
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2.5,
            borderRadius: "50%",
            bgcolor: "#dcfce7",
            color: "#166534",
          }}
        >
          {icon}
        </Box>
      </Box>
    </Card>
  </Grid>
);

/* ================= NAVBAR ================= */
const Navbar = ({
  role,
  setMobileOpen,
  approvedCount = 0,
  users = [],
  API,
  token,
  setPasses = () => {},
  onUserAdded = () => {},
}) => {
  const [showPassModal, setShowPassModal] = useState(false);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openSettings, setOpenSettings] = useState(false); // Settings Modal State
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    password: "",
  });

  // Fetch CC emails when settings open
  useEffect(() => {
    if (openSettings) {
      axios.get(`${API}/settings/cc`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setEmails(res.data))
      .catch(() => console.error("Failed to fetch CC list"));
    }
  }, [openSettings, API, token]);

  const handleSaveSettings = async () => {
    try {
      await axios.post(`${API}/settings/cc`, { emails }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Settings Saved!");
      setOpenSettings(false);
    } catch {
      alert("Failed to save settings");
    }
  };

  const addEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setNewEmail("");
    }
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddUser = async () => {
    try {
      await axios.post(`${API}/create-user`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpenAddUser(false);
      setFormData({ name: "", email: "", role: "", department: "", password: "", });
      onUserAdded();
    } catch {
      alert("Failed to create user");
    }
  };

  /* ================= ADMIN ================= */
  if (role === "admin") {
    return (
      <Stack spacing={4} maxWidth="1400px" mx="auto" width="100%">
        <Card sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 5, background: GRADIENT, color: "#fff" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ display: { xs: "inline-flex", sm: "none" }, color: "#fff" }}
              >
                <MenuIcon />
              </IconButton>
              <AdminPanelSettingsIcon fontSize="large" />
              <Typography variant="h5" fontWeight={900}>ADMIN DASHBOARD</Typography>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ display: { xs: "none", sm: "flex" } }}>
              <Button
                startIcon={<PersonAddAltIcon />}
                onClick={() => setOpenAddUser(true)}
                sx={{ bgcolor: "#fff", color: "#166534", fontWeight: 900, px: 4, py: 1.2, borderRadius: 3, "&:hover": { bgcolor: "#f0f0f0" } }}
              >
                ADD USER
              </Button>
              <ProfileMenu />
            </Stack>
          </Stack>
          <Typography mt={1} sx={{ opacity: 0.9 }}> Manage users and system approvals </Typography>
        </Card>

        {/* STAT BOXES - Added Settings Card Here */}
        <Grid container spacing={4}>

          <StatBox
            title="Approved Passes"
            value={approvedCount}
            icon={<CheckCircleIcon fontSize="large" />}
          />

          <StatBox
            title="Total Users"
            value={users.length}
            icon={<PeopleIcon fontSize="large" />}
          />
                  <SettingsIcon 
  onClick={() => setOpenSettings(true)} 
  sx={{ 
    fontSize: 50, 
    cursor: "pointer",
    ml: 70,   // move right
    mt: 8   // move down
  }} 
/>

        </Grid>

        {/* EMAIL CC SETTINGS DIALOG */}
        <Dialog open={openSettings} onClose={() => setOpenSettings(false)} fullWidth maxWidth="xs">
          <DialogTitle sx={{ fontWeight: 800 }}>Email CC Settings</DialogTitle>
          <DialogContent>
            <Typography variant="caption" color="text.secondary" mb={2} display="block">
              Add emails that should receive a copy of all approved passes.
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <Button variant="contained" onClick={addEmail}>Add</Button>
            </Stack>
            <List sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
              {emails.map((email) => (
                <ListItem key={email} secondaryAction={
                  <IconButton edge="end" onClick={() => removeEmail(email)} color="error">
                    <DeleteIcon />
                  </IconButton>
                }>
                  <ListItemText primary={email} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenSettings(false)}>Cancel</Button>
            <Button variant="contained" color="success" onClick={handleSaveSettings}>Save Changes</Button>
          </DialogActions>
        </Dialog>

        <AddUserDialog
          open={openAddUser}
          onClose={() => setOpenAddUser(false)}
          formData={formData}
          handleChange={handleChange}
          handleAddUser={handleAddUser}
        />
      </Stack>
    );
  }

  // ... (rest of your staff/hod/cso code remains the same)

  /* ================= STAFF ================= */
  if (role === "staff") {
    return (
      <Stack spacing={2} maxWidth="1400px" mx="auto">
        <Card sx={{ p: 3, borderRadius: 5, background: GRADIENT, color: "#fff" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ display: { xs: "inline-flex", sm: "none" }, color: "#fff" }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h5" fontWeight={900}>
                STAFF GATE PASS
              </Typography>
              
             
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <Button
                startIcon={<Plus />}
                onClick={() => setShowPassModal(true)}
                sx={{ bgcolor: "#fff", color: "#166534", fontWeight: 900 }}
              >
                APPLY PASS
              </Button>
              <ProfileMenu />
            </Stack>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            mt={2}
            sx={{ display: { xs: "flex", sm: "none" } }}
          >
            <Button
              startIcon={<Plus />}
              onClick={() => setShowPassModal(true)}
              sx={{ bgcolor: "#fff", color: "#166534", fontWeight: 900 }}
            >
              APPLY PASS
            </Button>
            <ProfileMenu />
          </Stack>
           <Typography sx={{ opacity: 0.9 }}> Apply and track gate pass requests </Typography>
        </Card>

        <AddPass
          open={showPassModal}
          onClose={() => setShowPassModal(false)}
          API={API}
          token={token}
          setPasses={setPasses}
        />
      </Stack>
    );
  }
/* ================= CSO (Security) ================= */
if (role === "cso") {
  return (
    <Stack spacing={4} maxWidth="1400px" mx="auto" width="100%">
      <Card 
        sx={{ 
          p: { xs: 2.5, md: 4 }, 
          borderRadius: 5, 
          background: GRADIENT, // Uses your #2563eb -> #22c55e theme
          color: "#fff" 
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: "inline-flex", sm: "none" }, color: "#fff" }}
            >
              <MenuIcon />
            </IconButton>
            <AdminPanelSettingsIcon fontSize="large" />
            <Typography variant="h5" fontWeight={900}>
              CSO DASHBOARD
            </Typography>
          </Stack>

          {/* DESKTOP ACTIONS */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            {/* Added a placeholder action for Security - e.g., Scan/Verify */}
            {/* <Button
              startIcon={<CheckCircleIcon />}
              sx={{
                bgcolor: "#fff",
                color: "#166534",
                fontWeight: 900,
                px: 4,
                py: 1.2,
                borderRadius: 3,
                "&:hover": { bgcolor: "#f0f0f0" },
              }}
            >
              VERIFY PASS
            </Button> */}
            <ProfileMenu />
          </Stack>
        </Stack>

        {/* MOBILE ACTION ROW */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          mt={2}
          sx={{ display: { xs: "flex", sm: "none" } }}
        >
          {/* <Button
            startIcon={<CheckCircleIcon />}
            sx={{
              bgcolor: "#fff",
              color: "#166534",
              fontWeight: 900,
              px: 3,
              py: 1,
              borderRadius: 3,
            }}
          >
            VERIFY
          </Button> */}
          <ProfileMenu />
        </Stack>
        <Typography mt={1} sx={{ opacity: 0.9 }}>
          Chief Security Officer: Oversee entry logs and security clearance
        </Typography>
      </Card>

      {/* <Grid container spacing={4}>
        <StatBox
          title="Verified Today"
          value={approvedCount}
          icon={<CheckCircleIcon fontSize="large" />}
        />
        <StatBox
          title="Security Staff"
          value={users.filter(u => u.role === 'security').length || 0}
          icon={<PeopleIcon fontSize="large" />}
        />
      </Grid> */}
    </Stack>
  );
}
  /* ================= HOD ================= */
  if (role === "hod") {
    return (
      <Stack spacing={2} maxWidth="1400px" mx="auto">
        <Card sx={{ p: 3, borderRadius: 5, background: GRADIENT, color: "#fff" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ display: { xs: "inline-flex", sm: "none" }, color: "#fff" }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h5" fontWeight={900}>
                HOD APPROVAL PANEL
              </Typography>
             
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <Button
                startIcon={<Plus />}
                onClick={() => setShowPassModal(true)}
                sx={{ bgcolor: "#fff", color: "#166534", fontWeight: 900 }}
              >
                APPLY PASS
              </Button>
              <ProfileMenu />
            </Stack>

          </Stack>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            mt={2}
            sx={{ display: { xs: "flex", sm: "none" } }}
          >
            <Button
              startIcon={<Plus />}
              onClick={() => setShowPassModal(true)}
              sx={{ bgcolor: "#fff", color: "#166534", fontWeight: 900 }}
            >
              APPLY PASS
            </Button>
            <ProfileMenu />
          </Stack>
           <Typography mt={1} sx={{ opacity: 0.9 }}> Review and approve staff gate pass requests </Typography>
        </Card>

        <HodPassCreate
          open={showPassModal}
          onClose={() => setShowPassModal(false)}
          API={API}
          token={token}
          setPasses={setPasses}
        />
      </Stack>
    );
  }

  return null;
};

export default Navbar;
