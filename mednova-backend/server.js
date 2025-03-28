import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const port = 5000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json()); // Middleware to parse JSON

// Chatbot API
app.post("/chatbot", async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Call Gemini AI API
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite-001" });
        const response = await model.generateContent(userMessage);
        const reply = response.response.candidates[0].content.parts[0].text;

        res.json({ reply });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
