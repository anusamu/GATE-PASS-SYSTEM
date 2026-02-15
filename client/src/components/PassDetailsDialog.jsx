import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Stack,
  Button,
  Divider,
  Grid,
} from "@mui/material";
import QRCode from "react-qr-code";
import {
  Person,
  Email,
  Phone,
  Laptop,
  Event,
  AssignmentInd,
  Badge,
  Business,
} from "@mui/icons-material";
import { Printer } from "lucide-react";

const PassDetails = ({ open, onClose, pass }) => {
  if (!pass) return null;

  // ✅ SAFE APPROVAL CHECK
  const isApproved =
    String(pass.status || "").toUpperCase() === "APPROVED";

  // ✅ SAFETY: ALWAYS HAVE QR VALUE
  // HOD auto-approved sometimes opens before fresh fetch
  const qrValue = pass.qrCode || pass._id;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: { borderRadius: 16, overflow: "hidden" },
        id: "printable-pass",
      }}
      sx={{
        "@media print": {
          "& .MuiDialog-container": { display: "block" },
          "& .MuiPaper-root": {
            margin: 0,
            width: "100%",
            borderRadius: 0,
            boxShadow: "none",
          },
          "& .MuiDialogActions-root": { display: "none" },
        },
      }}
    >
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          background: "linear-gradient(135deg,#2563eb,#22c55e)",
          color: "white",
          p: 4,
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} sm={8}>
            <Box
              sx={{
                backgroundColor: "white",
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                src="/tp-logo.png"
                alt="Technopark"
                sx={{ height: 28, width: 150, objectFit: "contain" }}
              />
            </Box>

            <Typography variant="h4" fontWeight={900} mt={2}>
              GATE PASS
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Verification ID: {pass._id}
            </Typography>

            <Box
              sx={{
                display: "inline-block",
                bgcolor: isApproved ? "#00c853" : "#ffab00",
                color: "white",
                px: 3,
                py: 0.5,
                borderRadius: 10,
                fontWeight: 800,
                fontSize: "0.75rem",
                mt: 2,
              }}
            >
              {pass.status}
            </Box>
          </Grid>

          {/* ================= QR CODE ================= */}
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-end" },
              mt: { xs: 3, sm: 0 },
            }}
          >
            {isApproved && (
              <Box
                sx={{
                  bgcolor: "white",
                  p: 1.2,
                  borderRadius: 2,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                  textAlign: "center",
                }}
              >
                <QRCode size={140} value={qrValue} />
                <Typography
                  variant="caption"
                  display="block"
                  sx={{
                    color: "#2c5364",
                    fontWeight: 900,
                    mt: 0.5,
                    fontSize: "0.6rem",
                  }}
                >
                  SCAN FOR VALIDATION
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* ================= CONTENT ================= */}
      <DialogContent sx={{ p: 4 }}>
        <Stack spacing={4}>
          <Section title="REQUESTER INFORMATION" icon={<Business />}>
            <DataRow icon={<Person />} label="Requester Name" value={pass.requesterName} />
            <DataRow icon={<Email />} label="Email" value={pass.requesterEmail} />
            <DataRow icon={<AssignmentInd />} label="Purpose" value={pass.purpose} />
          </Section>

          <Divider />

          <Section title="ASSET DETAILS" icon={<Laptop />}>
            <DataRow icon={<Badge />} label="Asset Name" value={pass.assetName} />
            <DataRow icon={<AssignmentInd />} label="Serial Number" value={pass.assetSerialNo} />
            <DataRow icon={<AssignmentInd />} label="Pass Type" value={pass.passType} />
            <DataRow icon={<Event />} label="Out Date" value={pass.outDate} />
            {pass.passType === "RETURNABLE" && (
              <DataRow icon={<Event />} label="Return Date" value={pass.returnDateTime} />
            )}
          </Section>

          <Divider />

          <Section title="VISITOR DETAILS" icon={<Person />}>
            <DataRow icon={<Person />} label="Visitor Name" value={pass.externalPersonName} />
            <DataRow icon={<Phone />} label="Contact" value={pass.externalPersonPhone} />
            <DataRow icon={<Email />} label="Visitor Email" value={pass.externalPersonEmail} />
          </Section>

          {pass.photo && (
            <Box textAlign="center">
              <Typography fontWeight={700} mb={1}>
                ASSET PHOTO
              </Typography>
              <Box
                component="img"
                src={pass.photo}
                sx={{
                  maxWidth: 400,
                  width: "100%",
                  borderRadius: 3,
                  border: "1px solid #eee",
                }}
              />
            </Box>
          )}
        </Stack>
      </DialogContent>

      {/* ================= ACTIONS ================= */}
      <DialogActions sx={{ p: 3 }}>
        {isApproved && (
          <Button
            fullWidth
            variant="contained"
            startIcon={<Printer size={18} />}
            onClick={handlePrint}
            sx={{ fontWeight: 800 }}
          >
            PRINT PASS
          </Button>
        )}
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          sx={{ fontWeight: 700 }}
        >
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ================= HELPERS ================= */
const Section = ({ title, icon, children }) => (
  <Box>
    <Typography
      variant="subtitle2"
      fontWeight={900}
      color="primary"
      sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
    >
      {icon} {title}
    </Typography>
    <Grid container spacing={2}>
      {children}
    </Grid>
  </Box>
);

const DataRow = ({ icon, label, value }) => (
  <Grid item xs={12} sm={6}>
    <Box sx={{ display: "flex", gap: 1 }}>
      <Box sx={{ color: "#2563eb" }}>{icon}</Box>
      <Box>
        <Typography variant="caption" fontWeight={700}>
          {label}
        </Typography>
        <Typography fontWeight={800}>
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  </Grid>
);

export default PassDetails;
