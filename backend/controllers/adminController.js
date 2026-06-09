const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

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
    res.status(500).json({
      message: "Error fetching admin stats",
      error: err.message,
    });
  }
};

module.exports = { getAdminStats };
