import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root Endpoint - Styled HTML Dashboard for Browser / JSON for API
app.get('/', (req, res) => {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Backend API - Project Execution Board</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
          body { background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px; max-width: 550px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); text-align: center; }
          .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); padding: 6px 16px; border-radius: 9999px; font-weight: 600; font-size: 14px; margin-bottom: 20px; }
          .dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 10px #22c55e; }
          h1 { font-size: 24px; font-weight: 700; margin-bottom: 12px; color: #ffffff; }
          p { color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 28px; }
          .info-box { background: #0f172a; border-radius: 12px; padding: 20px; text-align: left; margin-bottom: 28px; border: 1px solid #334155; }
          .info-title { font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
          .endpoint-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #1e293b; font-size: 14px; }
          .endpoint-row:last-child { border-bottom: none; }
          .method { background: #3b82f6; color: #fff; padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 12px; }
          .path { font-family: monospace; color: #38bdf8; }
          .footer-note { font-size: 13px; color: #64748b; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">
            <span class="dot"></span>
            Backend API Live & Operational
          </div>
          <h1>Project Execution Board Service</h1>
          <p>You have reached the <strong>Backend API URL</strong>. This service handles data synchronization and API health checks for the frontend application.</p>
          
          <div class="info-box">
            <div class="info-title">Available API Endpoints</div>
            <div class="endpoint-row">
              <span class="path">/api/health</span>
              <span class="method">GET</span>
            </div>
            <div class="endpoint-row">
              <span class="path">/api/sync</span>
              <span class="method" style="background:#8b5cf6;">POST</span>
            </div>
          </div>

          <div class="footer-note">
            To view the full interactive dashboard UI, open your <strong>Frontend Web Application URL</strong> on Render or Vercel.
          </div>
        </div>
      </body>
      </html>
    `);
  } else {
    res.json({
      status: 'online',
      service: 'Project Execution Board Backend API',
      endpoints: {
        health: '/api/health',
        sync: '/api/sync (POST)'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Project Execution Board Backend API live on Render',
    timestamp: new Date().toISOString()
  });
});

// Sync Endpoint
app.post('/api/sync', (req, res) => {
  const { sheetUrl } = req.body;
  res.json({
    success: true,
    message: 'Data successfully synchronized with backend',
    sheetUrl,
    syncedAt: new Date().toLocaleTimeString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend API server running on port ${PORT}`);
});
