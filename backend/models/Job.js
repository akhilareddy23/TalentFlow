const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    jobType: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Internship', 'Remote'],
      default: 'Full Time',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);