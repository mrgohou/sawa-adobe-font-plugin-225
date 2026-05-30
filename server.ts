import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side API endpoint for the Gemini UXP Consultant Assistant
  app.post('/api/consultant', async (req, res) => {
    const { prompt, history } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        error: "Missing API Key",
        response: "L'assistant IA fonctionne actuellement en mode local car la clé GEMINI_API_KEY n'a pas été configurée dans votre panneau d'environnement. Voici une réponse experte simulée quant au développement de plugins Adobe UXP :\\n\\nPour interroger le catalogue localement, privilégiez le fichier `manifest.json` avec la permission `network` stipulée. Les APIs spécifiques à l'hôte comme `require('photoshop').app` requièrent une exécution asynchrone complète pour éviter de bloquer l'interface Spectrum."
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `You are an expert Adobe CC UXP Plugin Developer Consultant.
You deeply understand UXP (Unified Extensibility Platform), Spectrum CSS, Adobe UXP storage, Photoshop, Illustrator, Premiere Pro, InDesign, InCopy, After Effects APIs.
You answer questions in French, helping developers write, optimize or debug code for scanning documents, finding missing fonts, or making network requests (Google Fonts / Adobe Fonts APIs).
Keep your answers highly code-focused, practical, precise, and formatted in Markdown.`;

      // Format conversation history
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
      }
      contents.push({ role: 'user', parts: [{ text: prompt }] });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const responseText = response.text || "Désolé, je n'ai pas pu générer de réponse.";
      res.json({ response: responseText });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({ error: "Gemini API Error", message: err.message });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
