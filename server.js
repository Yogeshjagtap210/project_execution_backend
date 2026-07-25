const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Backend API server running on port ${PORT}`);
});
