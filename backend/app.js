const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Conectare MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Rute
app.use('/api/auth', authRoutes);

// Endpoint fallback
app.use('*', (req, res) => res.status(404).json({ success: false, error: 'Not Found' }));

module.exports = app;
