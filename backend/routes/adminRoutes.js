const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAllApplications,
} = require("../controllers/adminController");

router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.get("/jobs", protect, adminOnly, getAllJobs);
router.delete("/jobs/:id", protect, adminOnly, deleteJob);
router.get("/applications", protect, adminOnly, getAllApplications);

module.exports = router;