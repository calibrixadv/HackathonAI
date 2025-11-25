const express = require("express");
const router = express.Router();

// Placeholder pentru funcțiile din chatbot
const { loadConfig, loadPlaces, answerMessage, generateVibeForPlace } = require("../chatbot");

const config = loadConfig();
const places = loadPlaces(config.locations_path);

// Endpoint chat simplificat (fără JWT)
router.post("/", async (req, res) => {
    try {
        const { message, history = [], option, placeIndex } = req.body;

        if (!option || ![1, 2, 3].includes(option)) {
            return res.status(400).json({ error: "option must be 1, 2, or 3" });
        }

        // 1 = list first N places
        if (option === 1) {
            const count = Math.min(placeIndex || 5, places.length);
            const list = places.slice(0, count).map((p, idx) => ({
                index: idx + 1,
                name: p.name,
                address: p.address,
                rating: p.rating,
            }));
            return res.json({ option: 1, data: list });
        }

        // 2 = generate vibe for a place
        if (option === 2) {
            if (!placeIndex || placeIndex < 1 || placeIndex > places.length) {
                return res.status(400).json({ error: "invalid placeIndex" });
            }
            const place = places[placeIndex - 1];
            const vibe = await generateVibeForPlace(config.client, config.model, place);
            return res.json({ option: 2, place: place.name, vibe });
        }

        // 3 = full chat
        if (option === 3) {
            if (!message) return res.status(400).json({ error: "message is required" });

            const result = await answerMessage(config.client, config.model, places, history, message);
            return res.json({ option: 3, reply: result.reply, history: result.history });
        }

    } catch (err) {
        console.error("[CHAT ERROR]", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
