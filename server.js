const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '.')));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'patcher.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Symbol Patcher running on http://localhost:${PORT}`);
});
