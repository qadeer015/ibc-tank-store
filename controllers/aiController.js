const fetch = global.fetch || require("node-fetch");
require("dotenv").config();

exports.gemini = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: prompt }]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 800
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({
                error: data.error?.message || "Gemini API error"
            });
        }

        const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

        res.json({ text });

    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({ error: "AI request failed" });
    }
};