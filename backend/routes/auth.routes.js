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
} = require("../controllers/passController");

// Import Middleware
// Assuming 'protect' handles JWT verification and 'authorize' handles Roles
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

// Staff: Create and view own passes
router.post("/staff/create", protect, authorize("staff"), createPass);
router.get("/staff/mypass", protect, authorize("staff"), myPasses);

// HOD: View pending and approve, reject
router.get("/hod/pending", protect, authorize("hod"), pendingApprovals);
router.put("/approve/:id", protect, authorize("hod"), approvePass);
router.put("/reject/:id", protect, authorize("hod"), rejectPass);


module.exports = router;