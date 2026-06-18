const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const STORE = path.join(__dirname, 'submissions.json');

// CORS configurável via variável de ambiente CORS_ORIGIN
// Exemplo: CORS_ORIGIN="https://bgcprojetos.github.io, http://localhost:3000"
const corsOrigin = process.env.CORS_ORIGIN || '*';
if (corsOrigin === '*') {
  app.use(cors());
} else {
  const allowed = corsOrigin.split(',').map(s => s.trim());
  app.use(cors({ origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow server-to-server or tools without Origin
    if (allowed.includes(origin)) return cb(null, true);
    cb(new Error('CORS not allowed'));
  }}));
}

app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '2mb' }));

// Ensure submissions file exists
if (!fs.existsSync(STORE)) {
  fs.writeFileSync(STORE, JSON.stringify([]), 'utf8');
}

app.post('/submit', (req, res) => {
  const data = req.body || {};
  data._receivedAt = new Date().toISOString();

  // Basic validation
  if (!data.date || !data.prefix) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes (date, prefix).' });
  }

  // Append to file
  try {
    const content = fs.readFileSync(STORE, 'utf8');
    const list = JSON.parse(content || '[]');
    list.push(data);
    fs.writeFileSync(STORE, JSON.stringify(list, null, 2), 'utf8');
    return res.json({ ok: true });
  } catch (err) {
    console.error('Erro ao salvar submissão:', err);
    return res.status(500).json({ error: 'Falha ao salvar dados.' });
  }
});

app.get('/submissions', (req, res) => {
  try {
    const content = fs.readFileSync(STORE, 'utf8');
    const list = JSON.parse(content || '[]');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Falha ao ler dados.' });
  }
});

app.listen(PORT, () => {
  console.log(`INSOLO backend listening on port ${PORT}`);
});
