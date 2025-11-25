const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    const token = req.cookies.token || '';

    if (!token) return res.status(401).json({ success: false, error: 'Not authorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ success: false, error: 'Not authorized' });

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ success: false, error: 'Token invalid or expired' });
    }
};
