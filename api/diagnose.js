// /api/diagnose.js
// Vercel serverless function — Gemini vision crop disease diagnosis
// No external OAuth/import needed — just needs GEMINI_API_KEY set in Vercel env vars

import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image } = req.body; // expects base64 string (no data:image/... prefix, or strip it below)

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Strip data URL prefix if present (e.g. "data:image/jpeg;base64,")
    const base64Data = image.includes(",") ? image.split(",")[1] : image;

    // Basic size guard (base64 is ~33% larger than raw bytes; ~5MB raw limit)
    const approxBytes = base64Data.length * 0.75;
    if (approxBytes > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "Image too large. Please use an image under 5MB." });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `You are an expert agricultural plant pathologist. Analyze this leaf image and identify any disease present.

Respond ONLY with valid JSON in exactly this format, no markdown fences, no extra text:
{
  "disease": "Disease name, or 'Healthy' if no disease detected",
  "confidence": 85,
  "severity": "low | medium | high",
  "explanation": "1-2 plain-language sentences explaining what you see and why",
  "treatment": ["Step 1 text", "Step 2 text", "Step 3 text"]
}

If the image is not a plant leaf at all, respond with:
{"disease": "Unrecognized", "confidence": 0, "severity": "low", "explanation": "This doesn't appear to be a leaf image. Please upload a clear photo of the affected leaf.", "treatment": []}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: base64Data } },
          ],
        },
      ],
    });

    let text = response.text.trim();
    // Strip markdown code fences if Gemini adds them despite instructions
    text = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

    let result;
    try {
      result = JSON.parse(text);
    } catch (parseErr) {
      console.error("Failed to parse Gemini response:", text);
      return res.status(500).json({ error: "Diagnosis failed, please try again." });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Diagnose API error:", err);
    return res.status(500).json({ error: "Diagnosis failed, please try again." });
  }
}

