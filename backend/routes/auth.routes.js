const express = require("express");
const router = express.Router();

// Import Controllers
const {
  login,
  staffRegister,
  getMyProfile,
  createUserByAdmin,
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

module.exports = router;
