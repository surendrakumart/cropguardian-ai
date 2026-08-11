/**
 * Serverless function: /api/diagnose
 * - POST body: { image: "<base64-data>" }
 * - Validates image exists and <= 5MB.
 * - Calls @google/genai (Gemini) when GEMINI_API_KEY is present.
 * - Returns structured JSON: { disease, confidence, severity, explanation, treatment[] }
 *
 * Notes:
 * - This function attempts a dynamic import of @google/genai and supports
 *   a couple of common SDK shapes. If the SDK shape doesn't match your
 *   installed version, the function will return an error explaining what's missing.
 * - The prompt forces the model to emit a single JSON object. The code
 *   strictly parses and validates that object before returning it.
 * - Uses an AbortController to enforce a timeout to stay within Vercel limits.
 */

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    // Accept JSON body
    const raw = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const { image } = raw;

    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'Missing image (base64) in request body.' });
    }

    const base64 = image.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    // Validate size <= 5MB
    const sizeBytes = Math.ceil((base64.length * 3) / 4);
    const MAX_BYTES = 5 * 1024 * 1024;
    if (sizeBytes > MAX_BYTES) {
      return res.status(400).json({ error: 'Image too large. Must be 5MB or smaller.' });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return res.status(500).json({ error: 'Server misconfiguration: missing GEMINI_API_KEY.' });
    }

    // Build a strict prompt that requests a single JSON object with exact keys.
    const prompt = `You are an expert plant pathologist. Analyze the provided image and RETURN ONLY a single valid JSON object with these keys: \n` +
      `- disease: string (name of the disease or 'healthy')\n` +
      `- confidence: number (0-100, confidence percentage)\n` +
      `- severity: string ('low' | 'medium' | 'high')\n` +
      `- explanation: string (plain-language explanation of evidence)\n` +
      `- treatment: array of strings (actionable treatment steps)\n` +
      `Do NOT include any other text or markdown. If uncertain, provide your best guess and keep confidence accordingly.`;

    // Timeout to keep request within Vercel limits
    const controller = new AbortController();
    const timeoutMs = 10000; // 10s
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // Dynamic import of @google/genai so builds don't fail if the package shape differs at runtime
      const genaiPkg = await import('@google/genai');

      // Try a few common client patterns from the SDKs:
      // 1) genaiPkg.GenerativeAI or genaiPkg.GenerativeAIClient
      // 2) genaiPkg.ImageGeneration or genaiPkg.ImageModel
      // 3) genaiPkg.default

      let responseText = null;
      let lastError = null;

      // Helper to parse different response shapes
      const extractText = (resp) => {
        if (!resp) return null;
        // Common shapes:
        // - { output: [{ content: [{ text: '...' }] }] }
        // - { outputText: '...' }
        // - { text: '...' }
        try {
          if (typeof resp === 'string') return resp;
          if (resp.outputText) return resp.outputText;
          if (resp.text) return resp.text;
          if (Array.isArray(resp.output) && resp.output[0] && Array.isArray(resp.output[0].content) && resp.output[0].content[0]) {
            return resp.output[0].content[0].text || null;
          }
          if (Array.isArray(resp.outputs) && resp.outputs[0] && resp.outputs[0].text) return resp.outputs[0].text;
        } catch (e) {
          return null;
        }
        return null;
      };

      // Attempt pattern 1: genaiPkg.GenerativeModel or genaiPkg.TextGenerationModel
      try {
        if (genaiPkg.GenerativeModel || genaiPkg.TextGenerationModel || genaiPkg.TextGeneration) {
          const Model = genaiPkg.GenerativeModel || genaiPkg.TextGenerationModel || genaiPkg.TextGeneration;
          // instantiate if constructor
          const client = (typeof Model === 'function') ? new Model({ apiKey: geminiKey }) : Model;
          // if client has a predict/generate method
          if (client.generate) {
            const resp = await client.generate({ prompt, image: { imageBase64: base64 }, signal: controller.signal });
            responseText = extractText(resp);
          } else if (client.predict) {
            const resp = await client.predict({ prompt, image: { imageBase64: base64 }, signal: controller.signal });
            responseText = extractText(resp);
          }
        }
      } catch (e) {
        lastError = e;
      }

      // Attempt pattern 2: genaiPkg.ImageGeneration or genaiPkg.ImageModel
      if (!responseText) {
        try {
          const ImgGen = genaiPkg.ImageGeneration || genaiPkg.ImageModel || genaiPkg.Vision;
          if (ImgGen) {
            const client = (typeof ImgGen === 'function') ? new ImgGen({ apiKey: geminiKey }) : ImgGen;
            if (client.annotate || client.generate || client.predict) {
              const method = client.annotate ? 'annotate' : (client.generate ? 'generate' : 'predict');
              const resp = await client[method]({ image: base64, prompt, signal: controller.signal });
              responseText = extractText(resp);
            }
          }
        } catch (e) {
          lastError = e;
        }
      }

      // Attempt pattern 3: default export with a 'predict' or 'generate' function
      if (!responseText) {
        try {
          const def = genaiPkg.default || genaiPkg;
          if (def && (def.predict || def.generate)) {
            const method = def.predict ? 'predict' : 'generate';
            const resp = await def[method]({ prompt, image: base64, apiKey: geminiKey, signal: controller.signal });
            responseText = extractText(resp);
          }
        } catch (e) {
          lastError = e;
        }
      }

      clearTimeout(timeout);

      if (!responseText) {
        console.error('Gemini client invoked but no text extracted. Last error:', lastError);
        return res.status(502).json({ error: 'Failed to get a valid response from Gemini. Check GEMINI_API_KEY and SDK compatibility.' });
      }

      // Try to parse JSON from the model response. The prompt asks for a single JSON object.
      let parsed = null;
      try {
        // Some models wrap JSON in ``` or surrounding text; extract first {...}
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
        parsed = JSON.parse(jsonStr);
      } catch (e) {
        console.error('Failed to parse model response as JSON:', responseText, e);
        return res.status(502).json({ error: 'Gemini response parse failed. Ensure the model returns a single JSON object.' });
      }

      // Validate parsed structure
      const { disease, confidence, severity, explanation, treatment } = parsed || {};
      if (!disease || typeof disease !== 'string') return res.status(502).json({ error: 'Invalid response: missing disease string.' });
      if (typeof confidence !== 'number' || confidence < 0 || confidence > 100) return res.status(502).json({ error: 'Invalid response: confidence must be number 0-100.' });
      if (!['low', 'medium', 'high'].includes(String(severity))) return res.status(502).json({ error: "Invalid response: severity must be one of 'low','medium','high'." });
      if (!explanation || typeof explanation !== 'string') return res.status(502).json({ error: 'Invalid response: missing explanation string.' });
      if (!Array.isArray(treatment) || !treatment.every(t => typeof t === 'string')) return res.status(502).json({ error: 'Invalid response: treatment must be array of strings.' });

      // Return the validated parsed object
      return res.status(200).json({ disease, confidence, severity, explanation, treatment });

    } catch (innerErr) {
      clearTimeout(timeout);
      console.error('Error while invoking Gemini client:', innerErr);
      return res.status(502).json({ error: 'Failed to call Gemini. Check GEMINI_API_KEY and SDK version compatibility.' });
    }

  } catch (err) {
    console.error('Diagnose error:', err);
    return res.status(500).json({ error: 'Diagnosis failed, please try again.' });
  }
}
