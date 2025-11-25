// backend/routes/libs/chatRouter.js  (sau routes/chat.js la tine)
const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const router = express.Router();

// rădăcina backend-ului (două nivele mai sus față de routes/libs)
const backendRoot = path.join(__dirname,  '..');

// Python din venv (macOS / Linux)
// pe Windows: const pythonBin = path.join(backendRoot, 'venv', 'Scripts', 'python.exe');
const pythonBin = path.join(backendRoot,'libs', 'venv', 'bin', 'python');
const chatBotPath = path.join(backendRoot, 'chatBot.py');

// helper comun
function runChatBot(payload, res) {
    let responded = false;

    const py = spawn(pythonBin, [chatBotPath], {
        cwd: backendRoot,
    });

    let stdout = '';
    let stderr = '';

    py.stdout.on('data', (data) => {
        stdout += data.toString();
    });

    py.stderr.on('data', (data) => {
        stderr += data.toString();
    });

    py.on('error', (err) => {
        console.error('Failed to start chatBot.py:', err);

        if (responded) return;
        responded = true;

        return res.status(500).json({
            error: 'python_spawn_failed',
            details: err.message,
        });
    });

    py.on('close', (code) => {
        console.log('chatBot.py exit code:', code);
        if (stderr) {
            console.error('stderr:', stderr);
        }

        if (responded) return;
        // de aici în jos sigur nu am trimis încă răspuns

        if (code !== 0 && !stdout) {
            responded = true;
            return res.status(500).json({
                error: 'chatbot_failed',
                exitCode: code,
                stderr,
            });
        }

        try {
            const json = JSON.parse(stdout);
            responded = true;
            return res.json(json);
        } catch (err) {
            console.error('Invalid JSON from chatBot.py:', stdout);
            responded = true;
            return res.status(500).json({
                error: 'invalid_json_from_python',
                raw: stdout,
            });
        }
    });

    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();
}

// ----------------- /api/chat -> mode: "chat" -----------------

router.post('/chat', (req, res) => {
    const { message, history = [] } = req.body || {};

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'message is required' });
    }

    const payload = {
        mode: 'chat',
        message,
        history,
    };

    runChatBot(payload, res);
});

// ----------------- /api/vibe -> mode: "vibe" -----------------

router.post('/vibe', (req, res) => {
    let { placeIndex, place_index } = req.body || {};
    const idx = placeIndex ?? place_index;

    if (typeof idx !== 'number') {
        return res.status(400).json({
            error: 'place_index_required',
            details: "Trimite 'placeIndex' sau 'place_index' ca număr (1-based).",
        });
    }

    const payload = {
        mode: 'vibe',
        place_index: idx,
    };

    runChatBot(payload, res);
});

module.exports = router;