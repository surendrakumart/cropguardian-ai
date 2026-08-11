// src/routes/api/diagnose.ts
// TanStack Start server route — Gemini vision crop disease diagnosis
// Needs GEMINI_API_KEY set in Vercel Environment Variables

import { createFileRoute } from '@tanstack/react-router'
import { GoogleGenAI } from '@google/genai'

export const Route = createFileRoute('/api/diagnose')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { image } = body

          if (!image) {
            return Response.json({ error: 'No image provided' }, { status: 400 })
          }

          // Strip data URL prefix if present (e.g. "data:image/jpeg;base64,")
          const base64Data = image.includes(',') ? image.split(',')[1] : image

          // Basic size guard (~5MB raw limit)
          const approxBytes = base64Data.length * 0.75
          if (approxBytes > 5 * 1024 * 1024) {
            return Response.json(
              { error: 'Image too large. Please use an image under 5MB.' },
              { status: 400 }
            )
          }

          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

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
{"disease": "Unrecognized", "confidence": 0, "severity": "low", "explanation": "This doesn't appear to be a leaf image. Please upload a clear photo of the affected leaf.", "treatment": []}`

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
              {
                role: 'user',
                parts: [
                  { text: prompt },
                  { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                ],
              },
            ],
          })

          let text = response.text.trim()
          text = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()

          let result
          try {
            result = JSON.parse(text)
          } catch (parseErr) {
            console.error('Failed to parse Gemini response:', text)
            return Response.json(
              { error: 'Diagnosis failed, please try again.' },
              { status: 500 }
            )
          }

          return Response.json(result)
        } catch (err) {
          console.error('Diagnose API error:', err)
          const debugMessage = err instanceof Error ? err.message : String(err)
          return Response.json(
            { error: 'Diagnosis failed, please try again.', debug: debugMessage },
            { status: 500 }
          )
        }
      },
    },
  },
})
