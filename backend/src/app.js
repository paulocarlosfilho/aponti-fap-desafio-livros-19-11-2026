const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

// Remove header X-Powered-By por segurança (não expor tecnologia do servidor)
app.disable('x-powered-by');

const rawCors = (process.env.CORS_ORIGIN || '*').replace(/['"]/g, '').trim();
const allowedOrigins =
  rawCors === '*'
    ? '*'
    : rawCors.split(',').map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.use(express.json({ limit: '100kb' }));

// Endpoint de Healthcheck para monitoramento no Render / Docker
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'lendomais-api' });
});

app.use('/api/books', bookRoutes);

module.exports = app;
