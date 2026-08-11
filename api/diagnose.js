/**
 * Serverless function: /api/diagnose
 * - POST body: { image: "<base64-data>" }
 * - Validates image exists and <= 5MB.
 * - Placeholder for Gemini (@google/genai) call. Does NOT import the package here to avoid build errors
 *   until you provide a GEMINI_API_KEY and want the concrete client snippet enabled.
 * - Returns structured JSON: { disease, confidence, severity, explanation, treatment[] }
 */

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    const raw = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const { image } = raw;

    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'Missing image (base64) in request body.' });
    }

    // Strip data URL prefix if present
    const base64 = image.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    // Validate size <= 5MB
    const sizeBytes = Math.ceil((base64.length * 3) / 4);
    const MAX_BYTES = 5 * 1024 * 1024;
    if (sizeBytes > MAX_BYTES) {
      return res.status(400).json({ error: 'Image too large. Must be 5MB or smaller.' });
    }

    // Ensure API key is present (server-side only)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      // We still allow the function to run in placeholder mode when key is missing,
      // returning a friendly message and a sample payload for frontend devs.
      const placeholder = {
        disease: 'Placeholder disease (no GEMINI_API_KEY)',
        confidence: 65.5,
        severity: 'medium',
        explanation: 'This is a placeholder diagnosis because GEMINI_API_KEY is not configured on the server.',
        treatment: [
          'Inspect surrounding leaves for spread and remove affected parts.',
          'Apply recommended treatment following label instructions.',
          'Monitor daily and improve ventilation.'
        ]
      };
      return res.status(200).json(placeholder);
    }

    // --- GEMINI WIRING POINT ---
    // The repository depends on @google/genai (see package.json). To wire Gemini,
    // uncomment and adapt the snippet below to the exact client API version you have.
    // Keep an AbortController/timeout to avoid exceeding Vercel limits.
    // Validate the response strictly (disease string, confidence number 0-100, severity enum, treatment array).

    /* Example pseudocode (do not uncomment unless you confirm the client API and want it enabled):
    import {SomeGenaiClient} from '@google/genai'
    const client = new SomeGenaiClient({ apiKey: process.env.GEMINI_API_KEY });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const prompt = `You are given an image of a plant. Return a single JSON object EXACTLY with keys: disease (string), confidence (number 0-100), severity (one of low, medium, high), explanation (string), treatment (array of strings). Do not add other text.`;
    const genResponse = await client.predict({ image_base64: base64, prompt, signal: controller.signal });
    clearTimeout(timeout);
    // parse and validate genResponse.text
    */

    // If you keep the GEMINI_API_KEY present and implement the client call above,
    // parse the model output into the shape below and return it.

    // For now return a safe placeholder response so the frontend has stable data.
    const fakeDiagnosis = {
      disease: 'Fungal leaf spot (example)',
      confidence: 72.4,
      severity: 'medium',
      explanation: 'Spots on leaves with yellow halos indicate a fungal infection; likely to spread under humid conditions.',
      treatment: [
        'Remove and destroy infected leaves.',
        'Apply a registered fungicide as directed.',
        'Reduce overhead irrigation and improve airflow.'
      ]
    };

    return res.status(200).json(fakeDiagnosis);
  } catch (err) {
    console.error('Diagnose error:', err);
    return res.status(500).json({ error: 'Diagnosis failed, please try again.' });
  }
}
