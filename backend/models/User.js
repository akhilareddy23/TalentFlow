const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "recruiter", "admin"],
      default: 'user',
    },
    // Jobseeker Profile Fields
    title: { type: String, default: "" },
    skills: { type: [String], default: [] },
    experienceYears: { type: Number, default: 0 },
    college: { type: String, default: "" },
    degree: { type: String, default: "" },
    currentCompany: { type: String, default: "" },
    currentCtc: { type: String, default: "" },
    expectedCtc: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    // Analytics Counters
    searchAppearances: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);