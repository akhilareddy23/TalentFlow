const Job = require('../models/Job');

// @desc    Create a new job
// @route   POST /api/jobs
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      description,
      skills,
      jobType,
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      salary,
      description,
      skills,
      jobType,
      createdBy: req.user.id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create job',
      error: error.message,
    });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch jobs',
      error: error.message,
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch job',
      error: error.message,
    });
  }
};

// @desc    Delete job by ID
// @route   DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }

    await job.deleteOne();

    res.status(200).json({
      message: 'Job deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete job',
      error: error.message,
    });
  }
};

// Remove the dummy routes and export your actual async database functions:
module.exports = {
  createJob,
  getJobs,
  getJobById,
  deleteJob,
};