require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const connectDB  = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes       = require('./routes/auth');
const expenseRoutes    = require('./routes/expenses');
const budgetRoutes     = require('./routes/budgets');
const insightRoutes    = require('./routes/insights');
const predictionRoutes = require('./routes/predictions');

const app  = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow local dev servers, specified production origin, or non-prod environment requests
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS — blocked by production security rules'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── API Routes ──────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/expenses',    expenseRoutes);
app.use('/api/budgets',     budgetRoutes);
app.use('/api/insights',    insightRoutes);
app.use('/api/predictions', predictionRoutes);

// ── 404 handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ── Error handler ───────────────────────────────────────────
app.use(errorHandler);

// ── Start server ────────────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 PennyPilot API running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`   Environment:  ${process.env.NODE_ENV || 'development'}\n`);
  });
};

start();
