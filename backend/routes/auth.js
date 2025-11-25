const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Folosește un secret în .env: JWT_SECRET=supersecret123
const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        // Verifică dacă există deja user
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, error: 'User already exists' });

        // Hash parola
        const hashed = await bcrypt.hash(password, 10);

        // Creează userul cu parola hash-uită
        const user = new User({ username, email, password: hashed });
        await user.save();

        // Crează JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ success: true, token, user: { id: user._id, username, email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, error: 'All fields required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ success: true, token, user: { id: user._id, username: user.username, email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
