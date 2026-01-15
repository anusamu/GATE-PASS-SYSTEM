const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getUsers,
  createUser,
  approvedPassCount,
  deleteUser,
} = require("../controllers/adminController");

router.get("/users", protect, getUsers);
router.post("/create-user", protect, createUser);
router.get("/passes/approved/count", protect, approvedPassCount);
router.delete("/user/:id", protect, deleteUser);
module.exports = router;

