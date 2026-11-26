import express from 'express';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';
import {
  getDistinctRoots,
  getVocabularyByRoot,
  searchVocabulary,
  getAllSegments,
  generateWordTokenTimestamps
} from './components/vocabularySubsystem.js';
import { QURAN_STUDY_MODULES } from './components/quranStudyModulesData.js';
import {
  extractFolderIdFromUrl,
  fetchDriveFolderFiles,
  fetchDriveFileContent,
  parseRawContentToModules,
  normalizeParsedModule
} from './components/googleDriveService.js';

// Shared server-side Gemini client utility
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Quran Explorer API Gateway', version: '2.4.0' });
  });

  // ============================================================================
  // GOOGLE DRIVE CURATED MODULES IMPORT REST API
  // ============================================================================

  // List files from a Google Drive folder URL or ID
  app.get('/api/v1/drive/list-folder', async (req, res) => {
    try {
      const folderUrlOrId = (req.query.folderId as string) || (req.query.url as string) || '1yBYV_N_4leL8qzCDRDmeeTEHx4wLz6fq';
      const authHeader = req.headers.authorization;
      const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : (req.query.accessToken as string) || '';

      const folderId = extractFolderIdFromUrl(folderUrlOrId);
      if (!folderId) {
        return res.status(400).json({ success: false, error: 'Invalid Google Drive folder link or ID' });
      }

      const result = await fetchDriveFolderFiles(folderId, token);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Error listing Google Drive folder' });
    }
  });

  // Fetch content of a specific Google Drive file
  app.get('/api/v1/drive/file-content', async (req, res) => {
    try {
      const fileId = req.query.fileId as string;
      const mimeType = (req.query.mimeType as string) || 'application/json';
      const authHeader = req.headers.authorization;
      const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : (req.query.accessToken as string) || '';

      if (!fileId) {
        return res.status(400).json({ success: false, error: 'fileId query parameter is required' });
      }

      const result = await fetchDriveFileContent(fileId, mimeType, token);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Error fetching file content from Google Drive' });
    }
  });

  // Parse raw text or JSON payload from Google Drive into QuranModule objects
  app.post('/api/v1/drive/parse-modules', (req, res) => {
    try {
      const { rawText, jsonPayload } = req.body;
      let modules: any[] = [];

      if (jsonPayload) {
        const list = Array.isArray(jsonPayload) ? jsonPayload : [jsonPayload];
        modules = list.map(normalizeParsedModule).filter(Boolean);
      } else if (rawText) {
        modules = parseRawContentToModules(rawText);
      }

      res.json({
        success: true,
        count: modules.length,
        modules: modules
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to parse Quran modules' });
    }
  });

  // ============================================================================
  // SECTION 8.2: VOCABULARY REST API ENDPOINTS
  // ============================================================================

  // 1. GET /api/v1/vocabulary/roots - List all distinct trilateral roots (Jizw)
  app.get('/api/v1/vocabulary/roots', (req, res) => {
    try {
      const roots = getDistinctRoots();
      res.json({
        success: true,
        totalRoots: roots.length,
        roots: roots
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. GET /api/v1/vocabulary/root/:root - Vocabulary, verses & expansions for a root
  app.get('/api/v1/vocabulary/root/:root', (req, res) => {
    try {
      const { root } = req.params;
      const data = getVocabularyByRoot(decodeURIComponent(root));
      res.json({
        success: true,
        root: data.root,
        totalOccurrences: data.totalOccurrences,
        matches: data.matches
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. GET /api/v1/vocabulary/search?q={query} - Full-text search with Tashkeel stripping
  app.get('/api/v1/vocabulary/search', (req, res) => {
    try {
      const query = (req.query.q as string) || '';
      if (!query.trim()) {
        return res.json({ success: true, results: [] });
      }
      const results = searchVocabulary(query);
      res.json({
        success: true,
        query: query,
        totalResults: results.length,
        results: results
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. GET /api/v1/segments/:segmentId/keywords - Verse-specific vocabulary list
  app.get('/api/v1/segments/:segmentId/keywords', (req, res) => {
    try {
      const { segmentId } = req.params;
      const segments = getAllSegments();
      const targetSeg = segments.find((s) => s.id === segmentId);

      if (!targetSeg) {
        return res.status(404).json({ success: false, error: 'Segment not found' });
      }

      const timestamps = generateWordTokenTimestamps(targetSeg.arabicText, 5000);

      res.json({
        success: true,
        segmentId: targetSeg.id,
        surahNumber: targetSeg.surahNumber,
        verseNumber: targetSeg.verseNumber,
        arabicText: targetSeg.arabicText,
        keywords: targetSeg.keywords || [],
        wordTimestamps: timestamps
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ============================================================================
  // SERVER-SIDE GEMINI API ENDPOINTS (MODELS: gemini-3.8-flash, gemini-3.8-live)
  // ============================================================================

  // 1. POST /api/gemini/tafsir-insight - Comprehensive scholarly reflection & linguistic analysis
  app.post('/api/gemini/tafsir-insight', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          success: false,
          error: 'GEMINI_API_KEY environment variable is not configured'
        });
      }

      const { surahName, verseNumber, arabicText, translation, language } = req.body;

      const langPrompt =
        language === 'ar'
          ? 'باللغة العربية الفصحى'
          : language === 'am'
          ? 'በአማርኛ ቋንቋ'
          : 'in English';

      const prompt = `You are a world-class Islamic scholar and Quranic linguist. Analyze the following Quranic verse ${surahName || ''} Verse ${verseNumber || 1}:
Arabic Text: "${arabicText || ''}"
Translation: "${translation || ''}"

Provide a deep scholarly reflection ${langPrompt} formatted strictly as valid JSON with the following key structure:
{
  "scholarlyTafsir": "A rich 2-3 paragraph explanation summarizing classical tafsir (Ibn Kathir, Al-Tabari, Al-Qurtubi) and main theological themes.",
  "linguisticGems": "2 key rhetorical or linguistic secrets regarding the word choice or Arabic syntax in this verse.",
  "practicalApplications": "2 actionable spiritual or daily life lessons derived from this verse.",
  "relatedAyahs": [
    {
      "surah": "Name of related Surah",
      "verseRef": "Verse reference e.g., 2:255",
      "arabic": "Arabic snippet if available",
      "themeConnection": "Brief description of how it connects to this verse"
    }
  ]
}
Return ONLY pure valid JSON without markdown wrapping.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      const rawText = response.text || '';
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      res.json({ success: true, insight: parsed });
    } catch (err: any) {
      console.error('Tafsir insight error:', err);
      res.status(500).json({ success: false, error: err.message || 'Gemini Tafsir reflection request failed' });
    }
  });

  // 2. POST /api/gemini/vocabulary-breakdown - Linguistic root & morphological analysis
  app.post('/api/gemini/vocabulary-breakdown', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          success: false,
          error: 'GEMINI_API_KEY environment variable is not configured'
        });
      }

      const { surahName, verseNumber, arabicText, translation } = req.body;

      const prompt = `Analyze the words in this Quranic verse (${surahName || ''}, Verse ${verseNumber || 1}):
Arabic Text: "${arabicText || ''}"
Translation: "${translation || ''}"

Break down 3-6 key or core vocabulary words in this verse into their linguistic roots and meanings. Return ONLY a valid JSON array of objects with the following schema:
[
  {
    "id": "w-1",
    "word": "Arabic word",
    "transliteration": "Phonetic transliteration e.g. Ar-Rahman",
    "root": "Triliteral root e.g. ر ح م",
    "type": "Noun / Verb / Particle",
    "meaning": {
      "en": "English meaning",
      "ar": "المعنى بالعربية",
      "am": "የአማርኛ ትርጉም"
    },
    "contextNote": {
      "en": "Linguistic note in English",
      "ar": "ملاحظة لغوية بالعربية",
      "am": "ማብራሪያ"
    }
  }
]
Return ONLY pure valid JSON array, no markdown wrappers.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      const rawText = response.text || '';
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      res.json({ success: true, vocabulary: parsed });
    } catch (err: any) {
      console.error('Vocabulary breakdown error:', err);
      res.status(500).json({ success: false, error: err.message || 'Gemini vocabulary breakdown request failed' });
    }
  });

  // 3. POST /api/gemini/stream - Server-Sent Events (SSE) streaming endpoint
  app.post('/api/gemini/stream', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({ error: 'GEMINI_API_KEY environment variable is not configured' });
      }

      const { prompt, systemInstruction } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      if (typeof (res as any).flushHeaders === 'function') {
        (res as any).flushHeaders();
      }

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined
      });

      for await (const chunk of responseStream) {
        const text = chunk.text || '';
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (err: any) {
      console.error('Streaming error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: err.message || 'Gemini streaming failed' });
      } else {
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
      }
    }
  });

  // 4. POST /api/v1/segments/:id/gemini-insight - Contextual Reflection for Segment
  app.post('/api/v1/segments/:id/gemini-insight', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          success: false,
          error: 'GEMINI_API_KEY environment variable is not configured'
        });
      }

      const { surahName, verseNumber, arabicText, translation } = req.body;

      const prompt = `Provide a deep scholarly Quranic Tafsir reflection for Surah ${surahName || ''}, Verse ${verseNumber || 1}:
Arabic Text: "${arabicText}"
Translation: "${translation}"

Return ONLY a pure valid JSON object matching this schema:
{
  "scholarlyTafsir": "Comprehensive scholarly explanation in English",
  "linguisticGems": "Analytical notes on rhetorical precision, root words, and eloquence",
  "practicalApplications": "Key spiritual and daily life actionable takeaways",
  "relatedAyahs": [
    {
      "surah": "Surah name",
      "verseRef": "Verse number",
      "arabic": "Arabic text",
      "themeConnection": "Connection note"
    }
  ]
}
Return ONLY pure valid JSON without markdown wrapping.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      const rawText = response.text || '';
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      res.json({ success: true, insight: parsed });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Gemini reflection request failed' });
    }
  });

  // 5. GET /api/v1/modules - Get all Quran study modules
  app.get('/api/v1/modules', (req, res) => {
    res.json({
      success: true,
      totalModules: QURAN_STUDY_MODULES.length,
      modules: QURAN_STUDY_MODULES.map((m) => ({
        id: m.id,
        surahNumber: m.surahNumber,
        title: m.title,
        titleAr: m.titleAr,
        subtitle: m.subtitle,
        totalVerses: m.totalVerses,
        themeColor: m.themeColor
      }))
    });
  });

  // 6. GET /api/v1/modules/:id/segments - Get segments for a module
  app.get('/api/v1/modules/:id/segments', (req, res) => {
    const { id } = req.params;
    const moduleItem = QURAN_STUDY_MODULES.find((m) => m.id === id);

    if (!moduleItem) {
      return res.status(404).json({ success: false, error: 'Module not found' });
    }

    res.json({
      success: true,
      moduleId: moduleItem.id,
      title: moduleItem.title,
      segments: moduleItem.segments
    });
  });

  // ============================================================================
  // GEMINI LIVE API WEBSOCKET GATEWAY
  // ============================================================================
  const wss = new WebSocketServer({ server, path: '/api/gemini/live' });

  wss.on('connection', async (clientWs: WebSocket) => {
    console.log('[LiveAPI] Client connected to Gemini Live WebSocket');

    let liveSession: any = null;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        clientWs.send(JSON.stringify({ error: 'GEMINI_API_KEY is not configured on server' }));
        clientWs.close();
        return;
      }

      liveSession = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are a compassionate, serene Islamic scholar and Quran guide assistant. Speak with reverence, clarity, and kindness.',
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            for (const part of message.serverContent?.modelTurn?.parts ?? []) {
              if (part.inlineData?.data) {
                clientWs.send(JSON.stringify({ audio: part.inlineData.data }));
              }
              if (part.text) {
                clientWs.send(JSON.stringify({ text: part.text }));
              }
            }
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
          onerror: (err: any) => {
            console.error('[LiveAPI] Gemini session error:', err);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ error: err.message || 'Live session error' }));
            }
          },
          onclose: () => {
            console.log('[LiveAPI] Gemini Live session closed');
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ closed: true }));
            }
          }
        },
      });

      clientWs.on('message', (data: any) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.audio && liveSession) {
            liveSession.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' }
            });
          } else if (parsed.text && liveSession) {
            liveSession.sendRealtimeInput({
              text: parsed.text
            });
          }
        } catch (e: any) {
          console.error('[LiveAPI] Error parsing client message:', e);
        }
      });

      clientWs.on('close', () => {
        console.log('[LiveAPI] Client connection closed');
        if (liveSession) {
          try {
            liveSession.close();
          } catch (e) {}
        }
      });

    } catch (err: any) {
      console.error('[LiveAPI] Connection initialization error:', err);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ error: err.message || 'Failed to initialize Gemini Live session' }));
        clientWs.close();
      }
    }
  });

  // ============================================================================
  // VITE DEVELOPMENT OR PRODUCTION STATIC SERVING
  // ============================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Quran Explorer Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
