import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint 1: Risk Explainer Analysis
app.post("/api/gemini/risk-analysis", async (req, res) => {
  try {
    const { systolicBp, totalCholesterol, age, smokingStatus, gender } = req.body;

    const ai = getGenAI();
    const prompt = `You are a compassionate, expert cardiovascular risk explainer for a heart health platform called Chordae.
Given the user's clinical numbers:
- Age: ${age}
- Systolic Blood Pressure: ${systolicBp} mmHg
- Total Cholesterol: ${totalCholesterol} mg/dL
- Smoking Status: ${smokingStatus}
- Gender Context: ${gender || "Not specified"}

Provide a plain-language summary explaining WHY these specific numbers matter for long-term arterial and heart health.
CRITICAL CONSTRAINTS:
1. Provide EXACTLY 2 clear, empathetic sentences.
2. DO NOT give a definitive medical diagnosis or state "you have disease".
3. Frame it as educational insight for doctor discussion.
4. Highlight any noteworthy factor (e.g., elevated BP or smoking impact).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    const summary = response.text?.trim() || "Your blood pressure and cholesterol levels are key indicators of vascular resistance and lipid accumulation. Discussing these combined factors with your physician can help tailor personalized cardiovascular prevention strategies.";

    res.json({ summary });
  } catch (error) {
    console.error("Error in /api/gemini/risk-analysis:", error);
    res.json({
      summary: "Your systolic pressure and cholesterol levels directly influence vascular elasticity and arterial plaque accumulation over time. Sharing these baseline metrics with your doctor will guide targeted, proactive heart care.",
    });
  }
});

// API Endpoint 2: Gender-Aware Symptom Journal Analysis
app.post("/api/gemini/symptom-analysis", async (req, res) => {
  try {
    const { symptomText, intensity, date, isFemaleContext } = req.body;

    const ai = getGenAI();
    const prompt = `You are Chordae's AI Gender-Aware Symptom Assessor.
Symptom Entry: "${symptomText}"
Intensity: ${intensity}/10
Date: ${date}
Biological Context: ${isFemaleContext ? "Female/Woman (High awareness for atypical symptoms like jaw/back pressure, extreme unexplainable fatigue, nausea, epigastric discomfort)" : "General/Male"}

Analyze this entry and respond with JSON matching this structure:
{
  "isAtypicalOrRedFlag": boolean,
  "flagLabel": "Atypical Female Pattern" | "Urgent Alert" | "Routine Observation" | "Moderate Concern",
  "reasoning": "1 short sentence explaining why",
  "doctorDiscussionPoint": "1 concise recommendation or key question to bring to the doctor"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    let jsonResult;
    try {
      jsonResult = JSON.parse(response.text || "{}");
    } catch {
      jsonResult = {
        isAtypicalOrRedFlag: isFemaleContext && (symptomText.toLowerCase().includes("jaw") || symptomText.toLowerCase().includes("fatigue") || symptomText.toLowerCase().includes("nausea") || symptomText.toLowerCase().includes("back")),
        flagLabel: isFemaleContext ? "Atypical Pattern Check" : "Routine Observation",
        reasoning: "Monitored symptom pattern logged for longitudinal tracking.",
        doctorDiscussionPoint: "Ask your physician whether this symptom correlates with your baseline exertion thresholds.",
      };
    }

    res.json(jsonResult);
  } catch (error) {
    console.error("Error in /api/gemini/symptom-analysis:", error);
    res.json({
      isAtypicalOrRedFlag: false,
      flagLabel: "Observed Symptom",
      reasoning: "Symptom logged into your longitudinal timeline.",
      doctorDiscussionPoint: "Bring this entry timestamp to your next check-up to evaluate pattern frequency.",
    });
  }
});

// API Endpoint 3: Post-Event Recovery Chatbot Companion
app.post("/api/gemini/recovery-chat", async (req, res) => {
  try {
    const { message, history, currentPhase } = req.body;

    const ai = getGenAI();

    const formattedHistory = Array.isArray(history)
      ? history.map((item: { role: string; content: string }) => `${item.role === "user" ? "User" : "Companion"}: ${item.content}`).join("\n")
      : "";

    const prompt = `You are Chordae's AI Recovery Companion, a warm, supportive, clinically-grounded assistant for patients in post-cardiac event recovery (e.g. stenting, heart attack recovery, cardiac rehab).
Current Patient Phase: ${currentPhase || "Phase 2: Light Rehab"}

Chat History:
${formattedHistory}

User Question: "${message}"

Guidelines:
1. Keep response concise (2-4 sentences max), encouraging, and clear.
2. Offer practical guidance on cardiac rehab milestones, rest, medication routines, emotional well-being, or exertion thresholds.
3. If the user mentions acute severe chest pain, extreme breathlessness, or syncope/fainting, ALWAYS advise immediate emergency medical contact (911/emergency care).
4. End with a supportive tone.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });

    const reply = response.text?.trim() || "In Phase 2 of recovery, light walking and controlled breathing are key milestones. Always monitor your heart rate and stop immediately if you experience shortness of breath or dizziness.";

    res.json({ reply });
  } catch (error) {
    console.error("Error in /api/gemini/recovery-chat:", error);
    res.json({
      reply: "During cardiac recovery, gradual progression under your clinical team's guidance is safest. If you feel unusual tightness or breathlessness, rest immediately and notify your cardiac rehab care team.",
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Chordae server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
