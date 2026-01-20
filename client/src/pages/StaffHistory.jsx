// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import {
// //   Box,
// //   Typography,
// //   Paper,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Chip,
// // } from "@mui/material";
// // import Sidebar from "../components/SideBar";

// // const API = "http://localhost:5000/api";

// // /* =========================
// //    STATUS CHIP
// // ========================= */
// // const StatusChip = ({ status }) => {
// //   if (status === "APPROVED")
// //     return <Chip label="APPROVED" color="success" size="small" />;
// //   if (status === "REJECTED")
// //     return <Chip label="REJECTED" color="error" size="small" />;
// //   return <Chip label="PENDING" color="warning" size="small" />;
// // };

// // const History = () => {
// //   /* =========================
// //      SIDEBAR STATE
// //   ========================= */
// //   const [activeTab, setActiveTab] = useState("history");
// //   const [mobileOpen, setMobileOpen] = useState(false);
// //   const [collapsed, setCollapsed] = useState(false);

// //   const user = { role: localStorage.getItem("role") };

// //   /* =========================
// //      PASSES STATE
// //   ========================= */
// //   const [passes, setPasses] = useState([]);

// //   useEffect(() => {
// //     fetchHistory();
// //   }, []);

// //   const fetchHistory = async () => {
// //     try {
// //       const token = localStorage.getItem("token");

// //       const res = await axios.get(`${API}/passes/my`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       setPasses(res.data);
// //     } catch (error) {
// //       console.error("Failed to fetch history", error);
// //     }
// //   };

// //   return (
// //     <Box
// //       component="main"
// //       sx={{
// //         ml: { sm: collapsed ? "72px" : "260px" },
// //         transition: "margin 0.3s",
// //       }}
// //     >
// //       {/* SIDEBAR */}
// //       <Sidebar
// //         user={user}
// //         activeTab={activeTab}
// //         setActiveTab={setActiveTab}
// //         mobileOpen={mobileOpen}
// //         setMobileOpen={setMobileOpen}
// //         collapsed={collapsed}
// //         setCollapsed={setCollapsed}
// //       />

// //       {/* PAGE CONTENT */}
// //       <Box p={3}>
// //         <Typography variant="h6" fontWeight={800} mb={2}>
// //           Gate Pass History
// //         </Typography>

// //         <TableContainer component={Paper}>
// //           <Table>
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell><b>Pass Type</b></TableCell>
// //                 <TableCell><b>Asset Name</b></TableCell>
// //                 <TableCell><b>Asset No</b></TableCell>
// //                 <TableCell><b>Status</b></TableCell>
// //                 <TableCell><b>Date</b></TableCell>
// //               </TableRow>
// //             </TableHead>

// //             <TableBody>
// //               {passes.length === 0 ? (
// //                 <TableRow>
// //                   <TableCell colSpan={5} align="center">
// //                     No history available
// //                   </TableCell>
// //                 </TableRow>
// //               ) : (
// //                 passes.map((pass) => (
// //                   <TableRow key={pass._id}>
// //                     <TableCell>{pass.passType}</TableCell>
// //                     <TableCell>{pass.assetName}</TableCell>
// //                     <TableCell>{pass.assetNumber}</TableCell>
// //                     <TableCell>
// //                       <StatusChip status={pass.status} />
// //                     </TableCell>
// //                     <TableCell>
// //                       {new Date(pass.createdAt).toLocaleDateString()}
// //                     </TableCell>
// //                   </TableRow>
// //                 ))
// //               )}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default History;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Grid,
//   Typography,
//   Chip,
//   Divider,
// } from "@mui/material";

// /*
//   EXPECTED:
//   - JWT token in localStorage
//   - currentUser passed as prop OR stored in localStorage
// */

// const History = ({ currentUser }) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // ✅ API BASE URL
//   const API = "http://localhost:5000/api";

//   // ✅ fallback if prop not passed
//   const user =
//     currentUser || JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await axios.get(`${API}/passhistory`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         setData(res.data);
//       } catch (err) {
//         setError("Failed to load history");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, []);

//   if (loading) return <Typography>Loading history...</Typography>;
//   if (error) return <Typography color="error">{error}</Typography>;
//   if (!data) return <Typography>No history found</Typography>;

//   return (
//     <Box p={3}>
//       <Typography variant="h5" fontWeight={800} mb={3}>
//         {user?.role} HISTORY
//       </Typography>

//       {/* ================= STAFF / HOD / SECURITY ================= */}
//       {Array.isArray(data) && (
//         <Grid container spacing={3}>
//           {data.map((pass) => (
//             <Grid item xs={12} md={6} lg={4} key={pass._id}>
//               <HistoryCard pass={pass} />
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/* ================= ADMIN ================= */}
//       {user?.role === "ADMIN" && data.passes && (
//         <>
//           <Divider sx={{ my: 4 }} />
//           <Typography variant="h6" fontWeight={800} mb={2}>
//             PASS HISTORY
//           </Typography>

//           <Grid container spacing={3}>
//             {data.passes.map((pass) => (
//               <Grid item xs={12} md={4} key={pass._id}>
//                 <HistoryCard pass={pass} />
//               </Grid>
//             ))}
//           </Grid>

//           <Divider sx={{ my: 4 }} />
//           <Typography variant="h6" fontWeight={800} mb={2}>
//             USER HISTORY
//           </Typography>

//           {data.users.map((u) => (
//             <Box
//               key={u._id}
//               sx={{
//                 p: 2,
//                 mb: 1,
//                 borderRadius: 2,
//                 background: "linear-gradient(135deg,#2563eb,#22c55e)",
//                 color: "white",
//               }}
//             >
//               <Typography fontWeight={700}>
//                 {u.name} ({u.role})
//               </Typography>
//               <Typography variant="body2">
//                 Status: {u.isDeleted ? "DELETED" : "ACTIVE"}
//               </Typography>
//             </Box>
//           ))}
//         </>
//       )}
//     </Box>
//   );
// };

// /* ================= HISTORY CARD ================= */

// const HistoryCard = ({ pass }) => {
//   return (
//     <Box
//       sx={{
//         p: 3,
//         borderRadius: 3,
//         color: "white",
//         background: "linear-gradient(135deg,#2563eb,#22c55e)",
//         boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
//       }}
//     >
//       <Typography fontWeight={800} mb={1}>
//         {pass.assetName}
//       </Typography>

//       <Typography variant="body2">
//         Requester: {pass.requesterName}
//       </Typography>

//       <Typography variant="body2">
//         Department: {pass.department || "—"}
//       </Typography>

//       <Typography variant="body2">
//         Pass Type: {pass.passType}
//       </Typography>

//       <Box mt={1}>
//         <Chip
//           label={pass.status}
//           size="small"
//           sx={{
//             fontWeight: 700,
//             color: "white",
//             bgcolor:
//               pass.status === "APPROVED"
//                 ? "#16a34a"
//                 : pass.status === "REJECTED"
//                 ? "#dc2626"
//                 : "#f59e0b",
//           }}
//         />
//       </Box>

//       <Typography variant="caption" display="block" mt={1}>
//         {new Date(pass.createdAt).toLocaleString()}
//       </Typography>
//     </Box>
//   );
// };

// export default History;
