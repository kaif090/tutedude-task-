

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './server/.env' });  // Explicit path to .env

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes (✅ Relative path from index.js inside /server)
const progressRoutes = require('./Routes/progressroutes');

// Use routes
app.use('/api/progress', progressRoutes);

// Server & DB connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB error:', err);
  });
