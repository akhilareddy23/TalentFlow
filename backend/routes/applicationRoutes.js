const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  applyJob,
  getMyApplications,
  getJobApplications,
  getRecruiterApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

router.post("/apply/:jobId", protect, applyJob);
router.get("/my-applications", protect, getMyApplications);
router.get("/job/:jobId", protect, getJobApplications);
router.get("/recruiter/all", protect, getRecruiterApplications);
router.put("/:id/status", protect, updateApplicationStatus);

module.exports = router;
