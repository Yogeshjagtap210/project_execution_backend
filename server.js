import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Project Execution Board Backend API live on Render',
    timestamp: new Date().toISOString()
  });
});

// API Sync Endpoint
app.post('/api/sync', (req, res) => {
  const { sheetUrl } = req.body;
  res.json({
    success: true,
    message: 'Data successfully synchronized with backend',
    sheetUrl,
    syncedAt: new Date().toLocaleTimeString()
  });
});

// Serve Static Frontend UI (Supports Fullstack single URL deployment)
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
const rootDistPath = path.resolve(__dirname, '../dist');
const localPublicPath = path.resolve(__dirname, './public');

let staticPath = null;
if (fs.existsSync(frontendDistPath)) {
  staticPath = frontendDistPath;
} else if (fs.existsSync(rootDistPath)) {
  staticPath = rootDistPath;
} else if (fs.existsSync(localPublicPath)) {
  staticPath = localPublicPath;
}

if (staticPath) {
  console.log(`Serving frontend application from: ${staticPath}`);
  app.use(express.static(staticPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      status: 'online',
      message: 'Project Execution Board API Service online. Build frontend to view UI.',
      endpoints: { health: '/api/health', sync: '/api/sync' }
    });
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
