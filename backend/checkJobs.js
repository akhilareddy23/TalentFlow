const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Job = require('./models/Job');
    const jobs = await Job.find({});
    console.log("Number of jobs in DB:", jobs.length);
    console.log("Jobs:", jobs);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
check();
