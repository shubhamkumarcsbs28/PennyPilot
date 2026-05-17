const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pennypilot';
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000; // 5 seconds

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔄 MongoDB connection attempt ${attempt}/${MAX_RETRIES}...`);
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000, // 10s timeout per attempt
      });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);

      // Connection event listeners
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected — will auto-reconnect');
      });
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err.message);
      });

      return; // success — exit the retry loop
    } catch (err) {
      console.error(`❌ Attempt ${attempt} failed: ${err.message}`);
      if (attempt === MAX_RETRIES) {
        console.error('💀 All connection attempts failed. Exiting.');
        process.exit(1);
      }
      console.log(`   Retrying in ${RETRY_DELAY / 1000}s...`);
      await new Promise((r) => setTimeout(r, RETRY_DELAY));
    }
  }
};

module.exports = connectDB;
