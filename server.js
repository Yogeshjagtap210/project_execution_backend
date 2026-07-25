const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Project Execution Board Backend API running' });
});

app.listen(PORT, () => {
  console.log(`Backend API server running on port ${PORT}`);
});
