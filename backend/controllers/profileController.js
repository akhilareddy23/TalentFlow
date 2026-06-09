const User = require('../models/User');

// Calculate Profile Strength percentage based on filled details
const calculateProfileStrength = (user) => {
  let strength = 20; // 20% baseline for Name & Email registration
  
  if (user.title && user.title.trim() !== "") {
    strength += 15;
  }
  if (user.skills && user.skills.length > 0) {
    strength += 15;
  }
  if (user.college && user.college.trim() !== "" && user.degree && user.degree.trim() !== "") {
    strength += 15;
  }
  if (user.resumeUrl && user.resumeUrl.trim() !== "") {
    strength += 20;
  }
  if ((user.currentCompany && user.currentCompany.trim() !== "") || user.experienceYears > 0) {
    strength += 15;
  } else if (user.degree && user.degree.trim() !== "") {
    // If student, education serves as career baseline
    strength += 15;
  }
  
  return Math.min(strength, 100);
};

// @desc Get current user's profile and analytics
// @route GET /api/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const strength = calculateProfileStrength(user);

    return res.status(200).json({
      user,
      profileStrength: strength,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Update user profile details
// @route PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const {
      title,
      skills,
      experienceYears,
      college,
      degree,
      currentCompany,
      currentCtc,
      expectedCtc,
      resumeUrl
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (title !== undefined) user.title = title;
    if (skills !== undefined) {
      // Parse skills if passed as comma separated string or array
      user.skills = Array.isArray(skills) 
        ? skills 
        : skills.split(',').map(s => s.trim()).filter(s => s);
    }
    if (experienceYears !== undefined) user.experienceYears = Number(experienceYears) || 0;
    if (college !== undefined) user.college = college;
    if (degree !== undefined) user.degree = degree;
    if (currentCompany !== undefined) user.currentCompany = currentCompany;
    if (currentCtc !== undefined) user.currentCtc = currentCtc;
    if (expectedCtc !== undefined) user.expectedCtc = expectedCtc;
    if (resumeUrl !== undefined) user.resumeUrl = resumeUrl;

    await user.save();

    const strength = calculateProfileStrength(user);
    const updatedUser = await User.findById(req.user.id).select('-password');

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
      profileStrength: strength,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
