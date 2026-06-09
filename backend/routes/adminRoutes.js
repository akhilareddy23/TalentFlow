const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const { getAdminStats } = require("../controllers/adminController");

router.get("/stats", protect, adminOnly, getAdminStats);

module.exports = router;