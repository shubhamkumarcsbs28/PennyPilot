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

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
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
