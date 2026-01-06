import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Box,
  Stack,
  Button,
} from "@mui/material";
import { User, Mail, Package, Calendar, Check, X, Printer } from "lucide-react";
import QRCode from "react-qr-code";

/* ===========================
   PASS CARD COMPONENT
=========================== */
const PassCard = ({ pass, onApprove, onReject, role }) => {
  const isApproved = pass.status === "APPROVED";

  const handlePrint = () => {
    window.print();
  };

  return (
    <Grid item xs={12} sm={12} md={6} lg={4}>
      <Card
        sx={{
          borderRadius: 4,
          background: "linear-gradient(135deg, #e8f5e9, #e0f7fa)",
        }}
        className="print-area"
      >
        <CardContent>
          {/* HEADER */}
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={900}>Gate Pass</Typography>
            <Chip
              label={pass.status}
              color={
                pass.status === "APPROVED"
                  ? "success"
                  : pass.status === "REJECTED"
                  ? "error"
                  : "warning"
              }
              size="small"
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* DETAILS */}
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

          {/* QR CODE (ONLY IF APPROVED) */}
          {isApproved && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box textAlign="center">
                <Typography fontWeight={700} mb={1}>
                  Security QR Code
                </Typography>
                <QRCode
                  size={140}
                  value={JSON.stringify({
                    passId: pass._id,
                    valid: true,
                  })}
                />
              </Box>
            </>
          )}

          {/* ACTIONS */}
          <Divider sx={{ my: 2 }} />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="space-between"
          >
            {/* HOD ACTIONS */}
            {role === "hod" && pass.status === "PENDING" && (
              <>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<Check />}
                  onClick={() => onApprove(pass._id)}
                >
                  Approve
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<X />}
                  onClick={() => onReject(pass._id)}
                >
                  Reject
                </Button>
              </>
            )}

            {/* PRINT */}
            {isApproved && (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Printer />}
                onClick={handlePrint}
              >
                Print Pass
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Grid>
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
      alignItems: "center",
      p: highlight ? 1 : 0,
      bgcolor: highlight ? "#dcfce7" : "transparent",
      borderRadius: 2,
    }}
  >
    {icon}
    <Typography fontWeight={700}>{label}:</Typography>
    <Typography>{value || "-"}</Typography>
  </Box>
);

export default PassCard;
