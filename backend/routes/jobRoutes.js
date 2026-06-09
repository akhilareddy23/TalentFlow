const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const {
  createJob,
  getJobs,
  getJobById,
  deleteJob,
} = require('../controllers/jobController');

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', protect, createJob);
router.delete('/:id', protect, deleteJob);
module.exports = router;