import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { analyzeRouter } from './routes/analyze.js';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', analyzeRouter);

// Health & configuration check
app.get('/api/health', (_req: express.Request, res: express.Response) => {
  const model = process.env.GEMINI_MODEL || 'gemma-4-31b-it';
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '' && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');

  res.json({
    status: 'ok',
    app: 'VisualProof AI',
    model_configured: model,
    api_key_present: hasKey,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Check if frontend build exists to serve full-stack SPA on Render/production
const clientDistCandidates = [
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(process.cwd(), '../client/dist'),
];

const clientDistPath = clientDistCandidates.find(candidate => fs.existsSync(candidate));

if (clientDistPath) {
  console.log(`📦 Serving static client build from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  app.get('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Root informational endpoint in API-only mode
  app.get('/', (_req: express.Request, res: express.Response) => {
    res.json({
      name: 'VisualProof AI API',
      tagline: 'Does the evidence actually support the claim?',
      endpoints: {
        health: 'GET /api/health',
        analyze: 'POST /api/analyze (multipart/form-data: claimImage, evidenceImage)'
      }
    });
  });
}

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred.',
    message: err.message
  });
});

app.listen(PORT, () => {
  const model = process.env.GEMINI_MODEL || 'gemma-4-31b-it';
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '' && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');

  console.log(`\n==================================================`);
  console.log(`   👁️  VISUALPROOF AI — PRODUCTION SERVER`);
  console.log(`   "Does the evidence actually support the claim?"`);
  console.log(`==================================================`);
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`🤖 Configured Model (GEMINI_MODEL): ${model}`);
  console.log(`🔑 Gemini API Key detected: ${hasKey ? 'YES (Active)' : 'NO (Demo Mode fallback ready)'}`);
  console.log(`📦 SPA Static Serving: ${clientDistPath ? 'ENABLED (' + clientDistPath + ')' : 'DISABLED'}`);
  console.log(`📡 Endpoints: POST http://localhost:${PORT}/api/analyze`);
  console.log(`==================================================\n`);
});
