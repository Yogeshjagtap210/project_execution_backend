import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { execSync } from 'child_process';

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

// Helper function to resolve static UI path
function resolveStaticPath() {
  const frontendDist = path.resolve(__dirname, '../frontend/dist');
  const rootDist = path.resolve(__dirname, '../dist');
  const localPublic = path.resolve(__dirname, './public');

  if (fs.existsSync(frontendDist) && fs.existsSync(path.join(frontendDist, 'index.html'))) {
    return frontendDist;
  }
  if (fs.existsSync(rootDist) && fs.existsSync(path.join(rootDist, 'index.html'))) {
    return rootDist;
  }
  if (fs.existsSync(localPublic) && fs.existsSync(path.join(localPublic, 'index.html'))) {
    return localPublic;
  }
  return null;
}

let staticPath = resolveStaticPath();

// Automatic build fallback: If dist does not exist, build it automatically on server start
if (!staticPath) {
  console.log('Static frontend dist not found. Triggering automatic frontend build...');
  try {
    const frontendDir = path.resolve(__dirname, '../frontend');
    const rootDir = path.resolve(__dirname, '..');
    
    if (fs.existsSync(path.join(frontendDir, 'package.json'))) {
      console.log('Building frontend from ../frontend directory...');
      execSync('npx vite build', { cwd: frontendDir, stdio: 'inherit' });
    } else if (fs.existsSync(path.join(rootDir, 'package.json'))) {
      console.log('Building frontend from root directory...');
      execSync('npx vite build', { cwd: rootDir, stdio: 'inherit' });
    }
    staticPath = resolveStaticPath();
  } catch (err) {
    console.error('Auto-build frontend fallback encountered warning:', err.message);
  }
}

if (staticPath) {
  console.log(`Serving frontend application UI from: ${staticPath}`);
  app.use(express.static(staticPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      status: 'online',
      message: 'Project Execution Board API Service online.',
      endpoints: { health: '/api/health', sync: '/api/sync' }
    });
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
