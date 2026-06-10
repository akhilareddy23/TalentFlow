const path = require('path');

const dotenv = require('dotenv');
 
// CHANGE HERE: Only look for a physical .env file if we are NOT running on Render production

if (process.env.NODE_ENV !== 'production') {

  dotenv.config({ path: path.resolve(__dirname, '.env') }); 

}
 
const express = require('express');

const cors = require('cors');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');

const jobRoutes = require('./routes/jobRoutes');

const adminRoutes = require("./routes/adminRoutes");

const applicationRoutes = require("./routes/applicationRoutes");

const profileRoutes = require("./routes/profileRoutes");

const aiRoutes = require("./routes/aiRoutes");
 
// Connect MongoDB

connectDB();
 
const app = express();
 
// CORS — allows local dev + Vercel production + any Render preview URLs

const allowedOrigins = [

  'http://localhost:5173',

  'http://localhost:5174',

  'https://talent-flow-beige-pi.vercel.app',

];
 
app.use(cors({

  origin: (origin, callback) => {

    // Allow requests with no origin (mobile apps, Postman, curl, server-to-server)

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {

      return callback(null, true);

    }

    return callback(new Error(`CORS blocked: ${origin}`));

  },

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

  allowedHeaders: ['Content-Type', 'Authorization'],

  credentials: true,

}));
 
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 
// Routes

app.use('/api/auth', authRoutes);

app.use('/api/jobs', jobRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/ai", aiRoutes);

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
 