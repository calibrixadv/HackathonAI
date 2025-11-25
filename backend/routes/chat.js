import express from 'express';
import { PythonShell } from 'python-shell';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware simplu JWT
function authMiddleware(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

router.post('/chat', authMiddleware, (req, res) => {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'message is required' });

    const options = {
        mode: 'text',
        pythonOptions: ['-u'],
        scriptPath: './',
        stdin: JSON.stringify({ message, history }),
    };

    PythonShell.run('chatBot.py', options, (err, results) => {
        if (err) return res.status(500).json({ error: 'Python script failed' });

        try {
            const output = results.join('');
            const data = JSON.parse(output);
            res.json(data);
        } catch (parseErr) {
            res.status(500).json({ error: 'Invalid JSON from Python script' });
        }
    });
});

export default router;
