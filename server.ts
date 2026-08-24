import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));

  // Initialize Gemini API client lazily / gracefully
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      platform: "Sanatani Bandhan Enterprise",
      version: "3.2.0",
      time: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Dharma Marketing AI Generation Route
  app.post("/api/gemini/dharma-marketing", async (req, res) => {
    try {
      const {
        festivalOrTopic,
        workspaceType = "Mandir",
        workspaceName = "Sri Sanatan Mandir",
        targetPlatform = "WhatsApp",
        language = "English",
        customInstructions = "",
      } = req.body;

      const ai = getGenAI();
      if (!ai) {
        // Fallback intelligent Vedic generator if API key is not yet attached
        const fallbackResponse = {
          headline: `🕉️ Auspicious ${festivalOrTopic || "Utsav"} Celebrations at ${workspaceName}`,
          postBody: `॥ श्री गुरुभ्यो नमः ॥\n\nDear Dharmic Devotees,\n\nWe cordially invite you and your family to join us for the sacred celebrations of ${festivalOrTopic || "Special Mahotsav"} at ${workspaceName}.\n\n📅 Date: Auspicious Tithi\n⏰ Timings: 6:00 AM Mangala Aarti to 8:30 PM Maha Pushpanjali\n📍 Venue: ${workspaceName} Main Hall\n\nMay the divine blessings of Prabhu bring eternal peace, prosperity, and spiritual elevation to your household.\n\nPrasadam & Mahapuja seva sponsorships are open. Contact the Seva desk to book your Sankalp.\n\n#SanataniBandhan #${festivalOrTopic?.replace(/\s+/g, "") || "VedicUtsav"} #Dharma #SanatanSeva`,
          hashtags: [
            "#SanatanDharma",
            `#${festivalOrTopic?.replace(/\s+/g, "") || "Utsav"}`,
            "#VedicCulture",
            "#BhaktiSeva",
            "#MandirMahotsav",
          ],
          callToAction: "Book Sankalp & Prasad Seva online at Sanatani Bandhan Portal",
          shlokaSnippet: "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥",
          isMock: true,
        };
        return res.json({ success: true, result: fallbackResponse });
      }

      const prompt = `You are the Vedic Marketing Strategist and Sanskrit scholar for "Sanatani Bandhan".
Generate a high-converting, culturally reverent, and inspiring promotional campaign packet for a Hindu organization.

Context:
- Organization Type: ${workspaceType}
- Organization Name: ${workspaceName}
- Event / Festival / Topic: ${festivalOrTopic}
- Primary Channel: ${targetPlatform} (e.g. WhatsApp Broadcast, Instagram/Facebook, Temple Poster, Email Newsletter)
- Output Language: ${language} (English / Hindi / Bengali or mixed with Sanskrit invocation)
- Additional Notes: ${customInstructions}

Return ONLY valid JSON matching this schema:
{
  "headline": "Short captivating headline with auspicious emojis",
  "postBody": "Well-formatted body text with bullet points, timings, Sankalp invitations, and spiritual context",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "callToAction": "Clear step for devotees (e.g. how to donate, join, or register)",
  "shlokaSnippet": "An authentic relevant Sanskrit Shloka with English transliteration or meaning",
  "whatsappSnippet": "Short 3-paragraph condensed broadcast suitable for instant WhatsApp copy-paste"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, result: parsed });
    } catch (err: any) {
      console.error("Dharma Marketing AI error:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "Failed to generate Dharma Marketing packet",
      });
    }
  });

  // Trilingual Shloka Analysis & Commentary Route
  app.post("/api/gemini/shloka-explain", async (req, res) => {
    try {
      const { shlokaText, contextVerse = "" } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          success: true,
          result: {
            sanskrit: shlokaText || "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
            transliteration: "karmaṇy-evādhikāras te mā phaleṣu kadācana, mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
            wordByWord: "karmaṇi (in duty) eva (only) adhikāraḥ (right) te (your)...",
            englishMeaning: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.",
            hindiMeaning: "तुम्हारा कर्म करने में ही अधिकार है, उसके फलों में कभी नहीं। इसलिए तुम कर्मफल के हेतु मत बनो और न ही तुम्हारी अकर्मण्यता में आसक्ति हो।",
            bengaliMeaning: "কর্মেতেই তোমার অধিকার আছে, কিন্তু তার ফলে কখনোই তোমার অধিকার নেই। কর্মফলের হেতু হয়ো না এবং কর্মত্যাগে তোমার প্রবৃত্তি যেন না হয়।",
            practicalApplication: "Focus 100% on the dedication, purity, and excellence of your daily seva without anxiety over worldly praise.",
            sourceText: "Bhagavad Gita - Chapter 2, Verse 47",
            isMock: true,
          },
        });
      }

      const prompt = `Analyze this sacred Vedic Shloka or Mantra:
Verse: "${shlokaText}"
${contextVerse ? `Context/Source: ${contextVerse}` : ""}

Provide authentic, scriptural trilingual exposition (English, Hindi, Bengali) with word-by-word breakups and modern practical application for community sevadars.

Return ONLY valid JSON matching this schema:
{
  "sanskrit": "Devanagari script",
  "transliteration": "IAST romanized script",
  "wordByWord": "Concise word-by-word meanings",
  "englishMeaning": "Refined English translation",
  "hindiMeaning": "Authentic Hindi translation",
  "bengaliMeaning": "Authentic Bengali translation",
  "practicalApplication": "Practical lesson for modern life and Seva",
  "sourceText": "Reference scripture (e.g. Gita, Upanishad, Rigveda)"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, result: parsed });
    } catch (err: any) {
      console.error("Shloka explain error:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "Failed to analyze Shloka",
      });
    }
  });

  // Generic Vedic Assistant Query Route
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          success: true,
          text: `Namaste! Sanatani Bandhan AI Assistant is ready. To enable live Gemini neural queries, configure your GEMINI_API_KEY in the Secrets panel. System operating in Dharmic rule-based mode.`,
          isMock: true,
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction:
            systemInstruction ||
            "You are Sanatani Bandhan AI, an expert in Hindu scriptures, Sanskrit, Panjika, Mandir administration, and Vedic rituals.",
        },
      });

      return res.json({ success: true, text: response.text });
    } catch (err: any) {
      console.error("Gemini query error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite middleware in development vs Static files in production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🕉️ Sanatani Bandhan Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal server boot error:", err);
});
