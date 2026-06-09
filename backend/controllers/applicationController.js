const Application = require("../models/Application");
const Job = require("../models/Job");

// @desc    Apply for a job
// @route   POST /api/applications/apply/:jobId
// @access  Private (Applicant only)
const applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const applicantId = req.user.id;
    
    const {
      applicantName,
      resumeUrl,
      applicantType,
      college,
      degree,
      currentCompany,
      experienceYears,
      currentCtc,
      expectedCtc,
    } = req.body;

    if (!applicantName || !resumeUrl || !applicantType) {
      return res.status(400).json({ message: "Full Name, Resume Link, and Candidate Type are required." });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: applicantId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: applicantId,
      status: "Applied",
      applicantName,
      resumeUrl,
      applicantType,
      college: applicantType === "Student" ? college : undefined,
      degree: applicantType === "Student" ? degree : undefined,
      currentCompany: applicantType === "Experienced" ? currentCompany : undefined,
      experienceYears: applicantType === "Experienced" ? experienceYears : undefined,
      currentCtc: applicantType === "Experienced" ? currentCtc : undefined,
      expectedCtc,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to apply for job",
      error: error.message,
    });
  }
};

// @desc    Get current user's applications
// @route   GET /api/applications/my-applications
// @access  Private (Applicant only)
const getMyApplications = async (req, res) => {
  try {
    const applicantId = req.user.id;

    const applications = await Application.find({ applicant: applicantId })
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

// @desc    Get all applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter only)
const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const recruiterId = req.user.id;

    // Verify job belongs to this recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.createdBy.toString() !== recruiterId) {
      return res.status(403).json({ message: "Access denied. You did not create this job." });
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email title skills")
      .sort({ createdAt: -1 });

    // Automatically increment profileViews & searchAppearances for these applicants (Naukri analytics)
    const applicantIds = applications.map(app => app.applicant?._id || app.applicant).filter(id => id);
    if (applicantIds.length > 0) {
      const User = require("../models/User");
      await User.updateMany(
        { _id: { $in: applicantIds } },
        { $inc: { profileViews: 1, searchAppearances: 1 } }
      );
    }

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applications for job",
      error: error.message,
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    const recruiterId = req.user.id;

    if (!["Applied", "Shortlisted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await Application.findById(applicationId).populate("job");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify job belongs to this recruiter
    if (application.job.createdBy.toString() !== recruiterId) {
      return res.status(403).json({ message: "Access denied. You cannot modify this application." });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      message: `Application status updated to ${status}`,
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update application status",
      error: error.message,
    });
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
};
