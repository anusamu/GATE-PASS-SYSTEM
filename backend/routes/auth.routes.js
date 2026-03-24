const express = require("express");
const router = express.Router();

// Import Controllers
const {
  verifyQRCode,
  markPassAsUsed,
} = require("../controllers/SecurityController");
const csoController = require("../controllers/csoController");
const {
  login,
  staffRegister,
  getMyProfile,
  createUserByAdmin,
    forgotPassword,
  resetPassword
} = require("../controllers/authController");

const {
  createPass,
  myPasses,
  viewPass,
  pendingApprovals,
  approvePass,
  rejectPass,
  getRecentPasses,
  getHistory,
  createPassHod,
  downloadPass,
 
  
} = require("../controllers/passController");

// Import Middleware
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

const {
  getUsers,
  createUser,
  approvedPassCount,
  deleteUser,
  getAllPassHistory,
   getCCList,
 updateCCList,
} = require("../controllers/adminController");

// --- Auth Routes ---
router.post("/login", login);
router.post("/register", staffRegister);
router.get("/me", protect, getMyProfile);

// --- Admin Routes ---
router.post(
  "/admin/create-user",
  protect,
  authorize("admin"),
  createUserByAdmin
);

// --- Pass Management Routes ---

// Staff
router.post(
  "/staff/create",
  protect,
  upload.single("photo"),
  authorize("staff"),
  createPass
);
router.get("/staff/mypass", protect, authorize("staff"), myPasses);
router.get("/staff/recent", protect, authorize("staff"), getRecentPasses);

// HOD
router.get("/hod/pending", protect, authorize("hod"), pendingApprovals);
router.put("/hod/approve/:id", protect, authorize("hod"), approvePass);
router.put("/hod/reject/:id", protect, authorize("hod"), rejectPass);
router.post(
  "/hod/create",
  protect,
  upload.single("photo"),
  authorize("hod"),
  createPassHod
);

// Pass View & Download
router.get("/pass/download/:id", downloadPass);
router.get("/pass/view/:id", viewPass);

// History
router.get("/history", protect, getHistory);

// Admin dashboard
router.get("/users", protect, getUsers);
router.post("/create-user", protect, createUser);
router.get("/passes/approved/count", protect, approvedPassCount);
router.delete("/user/:id", protect, deleteUser);
router.get("/admin/pass", getAllPassHistory);







router.post("/verify-qr", verifyQRCode);
router.put("/mark-used/:id", markPassAsUsed);





router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/pending", protect, csoController.getAllPendingPasses);

router.put("/approve/:id", protect, csoController.approvePassByCso);

router.put("/reject/:id", protect, csoController.rejectPassByCso);

router
  .route("/settings/cc")
  .get(protect, authorize("admin"), getCCList)
  .post(protect, authorize("admin"), updateCCList);

module.exports = router;
// router
//   .route("/settings/cc")
//   .get(settingsController.getCCList)    // Admin UI calls this to show current emails
//   .post(settingsController.updateCCList); // Admin UI calls this to save new emails

// const express = require("express");
// const router = express.Router();

// // Controllers
// const {
//   verifyQRCode,
//   markPassAsUsed,
// } = require("../controllers/SecurityController");

// const csoController = require("../controllers/csoController");

// const {
//   login,
//   staffRegister,
//   getMyProfile,
//   createUserByAdmin,
//   forgotPassword,
//   resetPassword,
// } = require("../controllers/authController");

// const {
//   createPass,
//   myPasses,
//   viewPass,
//   pendingApprovals,
//   approvePass,
//   rejectPass,
//   getRecentPasses,
//   getHistory,
//   createPassHod,
//   downloadPass,
// } = require("../controllers/passController");

// const {
//   getUsers,
//   createUser,
//   approvedPassCount,
//   deleteUser,
//   getAllPassHistory,
//   getCCList,
//   updateCCList,
// } = require("../controllers/adminController");

// // Middleware
// const { protect } = require("../middleware/authMiddleware");
// const { authorize } = require("../middleware/roleMiddleware");
// const upload = require("../middleware/upload");


// // ================= AUTH =================
// router.post("/login", login);
// router.post("/register", staffRegister);
// router.get("/me", protect, getMyProfile);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);


// // ================= ADMIN =================
// router.post(
//   "/admin/create-user",
//   protect,
//   authorize("admin"),
//   createUserByAdmin
// );

// router.get("/users", protect, authorize("admin"), getUsers);
// router.post("/create-user", protect, authorize("admin"), createUser);
// router.delete("/user/:id", protect, authorize("admin"), deleteUser);
// router.get("/passes/approved/count", protect, authorize("admin"), approvedPassCount);
// router.get("/admin/pass", protect, authorize("admin"), getAllPassHistory);


// // ================= STAFF =================
// router.post(
//   "/staff/create",
//   protect,
//   authorize("staff"),
//   upload.single("photo"),
//   createPass
// );

// router.get("/staff/mypass", protect, authorize("staff"), myPasses);
// router.get("/staff/recent", protect, authorize("staff"), getRecentPasses);


// // ================= HOD =================
// router.get("/hod/pending", protect, authorize("hod"), pendingApprovals);
// router.put("/hod/approve/:id", protect, authorize("hod"), approvePass);
// router.put("/hod/reject/:id", protect, authorize("hod"), rejectPass);

// router.post(
//   "/hod/create",
//   protect,
//   authorize("hod"),
//   upload.single("photo"),
//   createPassHod
// );


// // ================= PASS =================
// router.get("/pass/view/:id", viewPass);
// router.get("/pass/download/:id", downloadPass);


// // ================= HISTORY =================
// router.get("/history", protect, getHistory);


// // ================= SECURITY =================
// router.post("/verify-qr", verifyQRCode);
// router.put("/mark-used/:id", markPassAsUsed);


// // ================= CSO =================
// router.get("/pending", protect, authorize("cso"), csoController.getAllPendingPasses);
// router.put("/approve/:id", protect, authorize("cso"), csoController.approvePassByCso);
// router.put("/reject/:id", protect, authorize("cso"), csoController.rejectPassByCso);


// // ================= SETTINGS =================
// router
//   .route("/settings/cc")
//   .get(protect, authorize("admin"), getCCList)
//   .post(protect, authorize("admin"), updateCCList);


// module.exports = router;