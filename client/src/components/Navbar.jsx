import React, { useState } from "react";
import {
  Stack,
  Card,
  Grid,
  Typography,
  IconButton,
  Button,
  Box,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

import { Shield, ShieldCheck, Plus } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import AddPass from "./AddPass";
import HodPassCreate from "./HodPasssCreate";
const API = "https://gate-pass-system-drti.onrender.com" ;
const GRADIENT = "linear-gradient(135deg,#2563eb,#22c55e)";


  //  INTERNAL STAT CARD

const StatBox = ({ title, value, icon }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card
      sx={{
        height: 150,
        borderRadius: 4,
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
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
          <Typography variant="h3" fontWeight={900}>
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


  //  NAVBAR

const Navbar = ({
  role,
  setMobileOpen,
  setOpenAddUser = () => {},
  approvedCount = 0,
  users = [],
  API,
  token,
  setPasses = () => {},
}) => {
  const [showPassModal, setShowPassModal] = useState(false);


    //  ADMIN NAVBAR

 if (role === "admin") {
  return (
    <Stack spacing={4} maxWidth="1400px" mx="auto" width="100%">
      <Card
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 5,
          background: GRADIENT,
          color: "#fff",
          width: "95%",
        }}
      >
        <Stack
          // Horizontal on laptop (row), Vertical on mobile (column)
          direction={{ xs: "column", md: "row" }}
          // Pushes items to opposite ends on laptop
          justifyContent={{ xs: "center", md: "space-between" }}
          alignItems="center"
          spacing={2}
        >
          {/* LEFT SIDE: Title & Icon */}
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center"
              justifyContent={{ xs: "center", md: "flex-start" }}
            >
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ display: { xs: "inline-flex", sm: "none" }, color: "#fff", p: 0 }}
              >
                <MenuIcon />
              </IconButton>
              <AdminPanelSettingsIcon fontSize="large" />
              <Typography variant="h5" fontWeight={900} sx={{ whiteSpace: 'nowrap' }}>
                ADMIN DASHBOARD
              </Typography>
            </Stack>
            <Typography mt={1} sx={{ opacity: 0.9 }}>
              Manage users and system approvals
            </Typography>
          </Box>

          {/* RIGHT SIDE: Action Buttons */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ 
              mt: { xs: 2, md: 0 },
              width: { xs: "100%", md: "auto" } 
            }}
          >
            <Button
              startIcon={<PersonAddAltIcon />}
              onClick={() => setOpenAddUser(true)}
              sx={{
                bgcolor: "#fff",
                color: "#166534",
                fontWeight: 900,
                px: 4,
                py: 1.2, // Added consistent padding
                borderRadius: 3,
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#f0f0f0' }
              }}
            >
              ADD USER
            </Button>
            <ProfileMenu />
          </Stack>
        </Stack>
      </Card>

      {/* Stats Section remains as Grid */}
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
      </Grid>
    </Stack>
  );
}

    //  STAFF NAVBAR

if (role === "staff") {
  return (
    <Stack spacing={2} maxWidth="1400px" mx="auto" width="100%">
      <Card
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 5,
          background: GRADIENT,
          color: "#fff",
          width: "95%", // Ensures card fills the stack
        }}
      >
        <Stack
          // Mobile: Vertical (column), Laptop: Horizontal (row)
          direction={{ xs: "column", md: "row" }}
          // Laptop: Pushes left and right apart
          justifyContent={{ xs: "center", md: "space-between" }}
          alignItems="center"
          spacing={1}
        >
          {/* LEFT SIDE: Title Group */}
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center" 
              justifyContent={{ xs: "center", md: "flex-start" }}
            >
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ display: { xs: "inline-flex", sm: "none" }, color: "#fff", p: 0 }}
              >
                <MenuIcon />
              </IconButton>
              <Shield size={34} />
              <Typography variant="h5" fontWeight={900} sx={{ whiteSpace: 'nowrap' }}>
                STAFF GATE PASS
              </Typography>
            </Stack>
            <Typography mt={1} sx={{ opacity: 0.9 }}>
              Apply and track gate pass requests
            </Typography>
          </Box>

          {/* RIGHT SIDE: Action Group */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ 
              mt: { xs: 2, md: 0 },
              width: { xs: "100%", md: "auto" } 
            }}
          >
            <Button
              startIcon={<Plus />}
              onClick={() => setShowPassModal(true)}
              sx={{
                bgcolor: "#fff",
                color: "#166534",
                px: { xs: 3, md: 4 },
                py: 1.4,
                fontWeight: 800,
                borderRadius: 3,
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#f0f0f0' }
              }}
            >
              APPLY PASS
            </Button>
            <ProfileMenu />
          </Stack>
        </Stack>
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

  
    //  HOD NAVBAR
 
if (role === "hod") {
  return (
    <Stack spacing={4} maxWidth="1400px" mx="auto" width="100%">
      <Card
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 5,
          background: GRADIENT,
          color: "#fff",
          width: "95%",
        }}
      >
        <Stack
          // Laptop: Horizontal (row), Mobile: Vertical (column)
          direction={{ xs: "column", md: "row" }}
          // Pushes left and right sections apart on laptop
          justifyContent={{ xs: "center", md: "space-between" }}
          alignItems="center"
          spacing={2}
        >
          {/* LEFT SIDE: Title & Subtitle */}
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center"
              justifyContent={{ xs: "center", md: "flex-start" }}
            >
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ display: { xs: "inline-flex", sm: "none" }, color: "#fff", p: 0 }}
              >
                <MenuIcon />
              </IconButton>
              <ShieldCheck size={34} />
              <Typography variant="h5" fontWeight={900} sx={{ whiteSpace: 'nowrap' }}>
                HOD APPROVAL PANEL
              </Typography>
            </Stack>
            <Typography mt={1} sx={{ opacity: 0.9 }}>
              Review and approve staff gate pass requests
            </Typography>
          </Box>

          {/* RIGHT SIDE: Action Buttons */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ 
              mt: { xs: 2, md: 0 },
              width: { xs: "100%", md: "auto" } 
            }}
          >
            <Button
              startIcon={<Plus />}
              onClick={() => setShowPassModal(true)}
              sx={{
                bgcolor: "#fff",
                color: "#166534",
                px: 4,
                py: 1.4,
                fontWeight: 800,
                borderRadius: 3,
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#f0f0f0' }
              }}
            >
              APPLY PASS
            </Button>
            <ProfileMenu />
          </Stack>
        </Stack>
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

