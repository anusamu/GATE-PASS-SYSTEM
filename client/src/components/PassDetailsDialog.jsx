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

  const isApproved = pass.status === "APPROVED";

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
        id: "printable-pass" // Target for potential print libraries
      }}
      sx={{
        // Printing styles to ensure the modal content fills the page
        "@media print": {
          "& .MuiDialog-container": { display: "block" },
          "& .MuiPaper-root": { margin: 0, width: "100%", borderRadius: 0, boxShadow: "none" },
          "& .MuiDialogActions-root": { display: "none" }, // Hide buttons on print
        }
      }}
      className="print-area"
          onClick={() => setOpen(true)}
    >
      {/* HEADER SECTION */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #2563eb, #22c55e)",
          color: "white",
          p: 4,
        }}
         
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: 1 }}>
              GATE PASS
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
              Verification ID: {pass._id?.toUpperCase()}
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
                fontSize: "0.8rem",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              {pass.status}
            </Box>
          </Grid>

          {/* QR CODE - Fixed Positioning */}
          <Grid
  item
  xs={12}
  sm={4}
  sx={{
 mr: { xs: 0, sm: 6 }, // 6 = theme spacing (6 × 8px = 48px)
    display: "flex",
    marginLeft:"150px",
    justifyContent: { xs: "flex-start", sm: "flex-end" },
  }}
>
            {isApproved && (
              <Box
                sx={{
                  bgcolor: "white",
                  p: 1,
                  borderRadius: 2,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                  textAlign: "center",
                //   minWidth: 110,
                  
                }}
              >
                <QRCode size={100} value={JSON.stringify({ passId: pass._id })} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ color: "#2c5364", fontWeight: 900, mt: 0.5, fontSize: "0.6rem" }}
                >
                  SCAN VALIDATION
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        <Stack spacing={4}>
          {/* REQUESTER SECTION */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={800} gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Business fontSize="small" /> REQUESTER INFORMATION
            </Typography>
            <Grid container spacing={2}>
              <DataRow icon={<Person fontSize="small" />} label="Requester Name" value={pass.requesterName} />
              <DataRow icon={<Email fontSize="small" />} label="Official Email" value={pass.requesterEmail} />
              <DataRow icon={<Email fontSize="small" />} label="Purpose" value={pass.purpose} />
            </Grid>
          </Box>

          <Divider />

          {/* ASSET SECTION */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={800} gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Laptop fontSize="small" /> ASSET & LOGISTICS
            </Typography>
            <Grid container spacing={2}>
              <DataRow icon={<Badge fontSize="small" />} label="Asset Name" value={pass.assetName} />
              <DataRow icon={<AssignmentInd fontSize="small" />} label="Serial Number" value={pass.assetSerialNo} />
              <DataRow icon={<AssignmentInd fontSize="small" />} label="Pass Type" value={pass.passType} />
              <DataRow icon={<Event fontSize="small" />} label="Out Date" value={pass.outDate} />
              {pass.passType === "RETURNABLE" && (
                <DataRow icon={<Event fontSize="small" />} label="Return Schedule" value={pass.returnDateTime} />
              )}
            </Grid>
          </Box>

          <Divider />

          {/* VISITOR SECTION */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={800} gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Person fontSize="small" /> VISITOR / CARRY PERSON
            </Typography>
            <Grid container spacing={2}>
              <DataRow icon={<Person fontSize="small" />} label="Visitor Name" value={pass.externalPersonName} />
              <DataRow icon={<Phone fontSize="small" />} label="Contact" value={pass.externalPersonPhone} />
              <DataRow icon={<Email fontSize="small" />} label="Visitor Email" value={pass.externalPersonEmail} />
            </Grid>
          </Box>

          {/* PHOTO SECTION */}
          {pass.photo && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pt: 2,
                borderTop: "1px solid #eee",
              }}
            >
              <Typography variant="caption" fontWeight={700} color="text.secondary" mb={1}>
                VISUAL ASSET VERIFICATION
              </Typography>
              <Box
                component="img"
                src={pass.photo}
                sx={{
                  width: "100%",
                  maxWidth: 400,
                  borderRadius: 3,
                  maxHeight: 220,
                  objectFit: "contain",
                  bgcolor: "#f9f9f9",
                  p: 1,
                  border: "1px solid #eee",
                }}
              />
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: "1px solid #eee", bgcolor: "#fcfcfc", gap: 2 }}>
        {isApproved && (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<Printer size={20} />}
            onClick={handlePrint}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            Print Pass
          </Button>
        )}
        <Button
          onClick={onClose}
          fullWidth
          variant="outlined"
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            color: "#2c5364",
            borderColor: "#2c5364",
            "&:hover": { borderColor: "#0f2027", bgcolor: "#f0f0f0" },
          }}
        >
          CLOSE PREVIEW
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* READABLE DATA ROW COMPONENT */
const DataRow = ({ icon, label, value }) => (
  <Grid item xs={12} sm={6}>
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
      <Box sx={{ mr: 1.5, mt: 0.5, p: 0.5, borderRadius: 1, bgcolor: "#f0f4f8", display: "flex", color: "#2c5364" }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, textTransform: "uppercase", fontSize: "0.65rem" }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700, color: "#2d3436", wordBreak: "break-word", lineHeight: 1.2 }}>
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  </Grid>
);

export default PassDetails;