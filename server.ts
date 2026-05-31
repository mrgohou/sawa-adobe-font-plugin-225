import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side API endpoint for the Gemini Typography & Font Consultant
  app.post('/api/consultant', async (req, res) => {
    const { prompt, history } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        error: "Missing API Key",
        response: "L'assistant IA fonctionne actuellement en mode local car la clé GEMINI_API_KEY n'a pas été configurée dans votre panneau d'environnement. Voici une recommandation typographique simulée :\\n\\nPour associer des polices avec élégance, optez pour un fort contraste ! Mariez une police de titre géométrique expressive (comme 'Orbitron' ou 'Clash Grotesk') avec une police de labeur néo-grotesque neutre et ultra-lisible (comme 'Inter' ou 'Plus Jakarta Sans'). Limitez votre design à 2 familles typographiques maximales pour maintenir une hiérarchie visuelle claire et ultra-professionnelle."
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
      const systemInstruction = `You are an expert Typography and Font Consultant in Graphic Design (Sawa Font Scout Bot).
You deeply understand font pairings, typographic hierarchy, visual design principles, classification of typefaces (e.g., Humanist, Geometric, Didone, Garalde, slab-serifs), readability, legibility in print and digital media, font licensing rules, and typography history.
You answer in French. Help users elevate their graphic design projects, typography choices, pairings, layouts, and technical considerations. Keep answers extremely professional, elegant, inspiring, structural, and formatted beautifully in Markdown with practical examples.`;

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
        model: 'gemini-3.5-flash',
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
