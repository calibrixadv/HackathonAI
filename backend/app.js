require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());           // parse JSON body
app.use(cookieParser());           // parse cookies

// Routes
app.use('/api/auth', authRoutes);

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports=app