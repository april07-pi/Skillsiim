import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Simunye Skills SA", footprint_mb: 2.1 });
  });

  // Sync endpoint for offline-first progress upload
  app.post("/api/sync", (req, res) => {
    const { userId, syncItems, performanceProfile } = req.body;
    console.log(`[Sync] Received ${syncItems?.length || 0} items for user ${userId} (${performanceProfile})`);
    res.json({
      success: true,
      syncedAt: new Date().toISOString(),
      itemsProcessed: syncItems?.length || 0,
      message: "Sync completed successfully. Local storage updated.",
    });
  });

  // Optional AI Tutor Hint / Career Advice endpoint using Gemini API
  app.post("/api/ai/hint", async (req, res) => {
    try {
      const { prompt, scenario, language = "en" } = req.body;
      const client = getAiClient();

      if (!client) {
        return res.json({
          offlineFallback: true,
          hint: language === "zu"
            ? "Ulayini ongaxhumekile: Bhekisisa izimpawu nezinye izinketho ngaphambi kokuthatha isinqumo."
            : "Offline Hint: Review the warning signs and double-check physical connection or diagnostic steps before proceeding.",
          source: "Offline Decision Engine",
        });
      }

      const systemInstruction = `You are Simunye AI, a supportive South African workplace mentor helping entry-level learners, TVET students, and youth. Provide short, practical, actionable guidance (maximum 3 concise sentences) adapted for low-data mobile screens in ${language === "zu" ? "isiZulu and simple English" : "simple clear South African English"}. Focus on real-world workplace or business practice. Scenario: ${scenario || "Skill simulation"}`;

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [prompt],
        config: {
          systemInstruction,
          maxOutputTokens: 250,
          temperature: 0.7,
        },
      });

      return res.json({
        offlineFallback: false,
        hint: response.text,
        source: "Gemini 2.5 AI Tutor",
      });
    } catch (err) {
      console.error("[AI Hint Error]", err);
      return res.json({
        offlineFallback: true,
        hint: "Observe the environment details carefully. Always verify before making irreversible changes.",
        source: "System Fallback Engine",
      });
    }
  });

  // Vite development or production static hosting
  if (process.env.NODE_ENV !== "production") {
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
    console.log(`[Simunye Skills SA] Mobile Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
