const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const vaultRoutes = require('./routes/vault');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
// UPDATED: Increased the limit for JSON payloads to prevent crashes
// when receiving larger encrypted vault data from the frontend.
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/vault', vaultRoutes);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "your_mongodb_connection_string_here";

mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});