// import React from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Chip,
//   Stack,
// } from "@mui/material";
// import {
//   CheckCircle,
//   PendingActions,
//   Cancel,
// } from "@mui/icons-material";

// /**
//  * PassCard Component
//  * @param {Object} props
//  * @param {Object} props.pass - Gate pass object
//  */
// const PassCard = ({ pass }) => {
//   // ✅ SAFETY CHECK (MOST IMPORTANT FIX)
//   if (!pass) {
//     return null; // or return <Skeleton />
//   }

//   // ✅ SAFE STATUS ACCESS
//   const status = pass.status || "PENDING";

//   // ✅ STATUS UI CONFIG
//   const statusConfig = {
//     APPROVED: {
//       color: "success",
//       icon: <CheckCircle fontSize="small" />,
//     },
//     PENDING: {
//       color: "warning",
//       icon: <PendingActions fontSize="small" />,
//     },
//     REJECTED: {
//       color: "error",
//       icon: <Cancel fontSize="small" />,
//     },
//   };

//   const currentStatus = statusConfig[status] || statusConfig.PENDING;

//   return (
//     <Paper
//       elevation={3}
//       sx={{
//         p: 3,
//         borderRadius: 3,
//         mb: 2,
//       }}
//     >
//       <Stack spacing={1}>
//         {/* PASS ID */}
//         <Typography fontWeight={700}>
//           Gate Pass ID: {pass.passId || "--"}
//         </Typography>

//         {/* VISITOR / EMPLOYEE */}
//         <Typography variant="body2" color="text.secondary">
//           Requested By: {pass.requestedBy || "N/A"}
//         </Typography>

//         {/* DEPARTMENT */}
//         <Typography variant="body2">
//           Department: {pass.department || "N/A"}
//         </Typography>

//         {/* STATUS */}
//         <Box mt={1}>
//           <Chip
//             icon={currentStatus.icon}
//             label={status}
//             color={currentStatus.color}
//             variant="outlined"
//             size="small"
//           />
//         </Box>
//       </Stack>
//     </Paper>
//   );
// };

// export default PassCard;
import React from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Stack,
  Chip,
} from "@mui/material";

import {
  Calendar,
  User,
  Package,
  CheckCircle,
  XCircle,
  Download,
  Printer,
  Hash,
} from "lucide-react";

import { QRCodeSVG } from "qrcode.react";

/* =========================
   PASS CARD
========================= */
const PassCard = ({ pass, onAction, showActions }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return { bg: "#FEF9C3", color: "#A16207" };
      case "APPROVED":
        return { bg: "#DBEAFE", color: "#1D4ED8" };
      case "IN":
        return { bg: "#DCFCE7", color: "#166534" };
      case "OUT":
        return { bg: "#E9D5FF", color: "#6B21A8" };
      case "COMPLETED":
        return { bg: "#F3F4F6", color: "#374151" };
      case "REJECTED":
        return { bg: "#FEE2E2", color: "#991B1B" };
      default:
        return { bg: "#F3F4F6", color: "#374151" };
    }
  };

  const handlePrint = () => {
    const content = document.getElementById(`pass-print-${pass.id}`);
    if (!content) return;

    const win = window.open("", "", "width=800,height=600");
    win.document.write(`
      <html>
        <head><title>Gate Pass</title></head>
        <body style="display:flex;justify-content:center;align-items:center;padding:40px">
          ${content.innerHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const statusStyle = getStatusColor(pass.status);

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid #f0f0f0",
        position: "relative",
        transition: "0.3s",
        "&:hover": { boxShadow: 6, transform: "scale(1.01)" },
      }}
    >
      {/* PRINT BUTTON */}
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <Button
          size="small"
          onClick={handlePrint}
          sx={{ minWidth: 0, p: 1 }}
        >
          <Printer size={18} />
        </Button>
      </Box>

      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Box>
          <Chip
            label={pass.status}
            sx={{
              bgcolor: statusStyle.bg,
              color: statusStyle.color,
              fontWeight: 900,
              fontSize: 10,
              mb: 1,
            }}
          />

          <Stack direction="row" spacing={0.5} alignItems="center">
            <Hash size={12} />
            <Typography variant="caption" fontWeight={700}>
              {pass.serialNo}
            </Typography>
          </Stack>

          <Typography variant="h6" fontWeight={900}>
            #{pass.id.slice(0, 8).toUpperCase()}
          </Typography>

          <Typography
            variant="caption"
            fontWeight={700}
            color="primary"
          >
            {pass.type === "RETURNABLE"
              ? "Returnable Asset"
              : "One-Way Access"}
          </Typography>
        </Box>

        <Box
          id={`pass-print-${pass.id}`}
          sx={{
            p: 1.5,
            borderRadius: 3,
            bgcolor: "#f9fafb",
            border: "1px solid #eee",
          }}
        >
          <QRCodeSVG value={pass.qrCode} size={80} />
        </Box>
      </Stack>

      {/* IMAGE */}
      {pass.imageUrl && (
        <Box
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #eee",
            mb: 2,
          }}
        >
          <img
            src={pass.imageUrl}
            alt="Attachment"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      )}

      {/* DETAILS */}
      <Stack spacing={2} mt={2}>
        <Stack direction="row" spacing={2}>
          <Box sx={{ bgcolor: "#DBEAFE", p: 1.5, borderRadius: 2 }}>
            <User size={16} />
          </Box>
          <Box>
            <Typography variant="caption" fontWeight={700}>
              Requester / Dept
            </Typography>
            <Typography fontWeight={700}>
              {pass.requesterName} | {pass.department}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Box sx={{ bgcolor: "#DCFCE7", p: 1.5, borderRadius: 2 }}>
            <Package size={16} />
          </Box>
          <Box>
            <Typography variant="caption" fontWeight={700}>
              Visitor / Purpose
            </Typography>
            <Typography fontWeight={700}>
              {pass.externalPersonName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {pass.purpose}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Calendar size={14} />
          <Typography variant="caption">
            {new Date(pass.createdAt).toLocaleString()}
          </Typography>
        </Stack>
      </Stack>

      {/* ACTIONS */}
      {showActions && pass.status === "PENDING" && (
        <Stack direction="row" spacing={2} mt={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => onAction(pass.id, "APPROVED")}
            startIcon={<CheckCircle size={16} />}
          >
            Approve
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={() => onAction(pass.id, "REJECTED")}
            startIcon={<XCircle size={16} />}
          >
            Reject
          </Button>
        </Stack>
      )}

      {!showActions && pass.status === "APPROVED" && (
        <Button
          fullWidth
          sx={{ mt: 3 }}
          onClick={handlePrint}
          startIcon={<Download size={16} />}
        >
          Download Digital Pass
        </Button>
      )}
    </Card>
  );
};

export default PassCard;
