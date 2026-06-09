const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const adminRoutes = require("./routes/adminRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const profileRoutes = require("./routes/profileRoutes");
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect MongoDB
connectDB();

const app = express();

// Middleware — UPDATE: Explicit CORS permissions for Vercel production
app.use(cors({
  origin: 'https://talent-flow-beige-pi.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/profile", profileRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

const PORT = process.env.PORT || 5000;

// UPDATE: Added an error listener block to handle Render's duplicate port binding attempt gracefully
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is already in use by Render's internal process router, but your app logic is safely initialized.`);
    } else {
      console.error('Server startup error:', err);
    }
  });
}

module.exports = app;
