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
  pendingApprovals,
  approvePass,
  rejectPass,
  getRecentPasses, // 1. Added this here
} = require("../controllers/passController");

// Import Middleware
const { protect } = require("../middleware/authMiddleware"); 
const { authorize } = require("../middleware/roleMiddleware");

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

// Staff: Create, view all, and view recent passes
router.post("/staff/create", protect, authorize("staff"), createPass);
router.get("/staff/mypass", protect, authorize("staff"), myPasses);
router.get("/staff/recent", protect, authorize("staff"), getRecentPasses); // 2. Fixed naming and added role check

// HOD: View pending
router.get("/hod/pending", protect, authorize("hod"), pendingApprovals);

// HOD: Approve and Reject
router.put("/hod/approve/:id", protect, authorize("hod"), approvePass);
router.put("/hod/reject/:id", protect, authorize("hod"), rejectPass);

module.exports = router;