const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

// GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    res.json({
      users: totalUsers,
      recruiters: totalRecruiters,
      admins: totalAdmins,
      jobs: totalJobs,
      applications: totalApplications,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin stats", error: err.message });
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

// GET /api/admin/jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).populate("createdBy", "name email").sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err.message });
  }
};

// DELETE /api/admin/jobs/:id
const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting job", error: err.message });
  }
};

// GET /api/admin/applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({})
      .populate("applicant", "name email")
      .populate("job", "title company")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching applications", error: err.message });
  }
};

module.exports = { getAdminStats, getAllUsers, deleteUser, getAllJobs, deleteJob, getAllApplications };
