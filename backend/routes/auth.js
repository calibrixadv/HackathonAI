const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecret"; // îl vom muta în .env

// REGISTER
router.post("/register", async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "Email already exists" });

        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hash,
            name,
        });

        return res.status(201).json({ message: "User created" });

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "Logged in", user: { name: user.name, email: user.email } });
});

// LOGOUT
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});

module.exports = router;
