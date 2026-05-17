const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['food', 'shopping', 'transport', 'bills', 'entertainment',
           'healthcare', 'travel', 'education', 'other'],
  },
  limit: {
    type: Number,
    required: true,
    min: 0,
  },
  month: {
    type: String, // "2026-05" format
    required: true,
  },
}, {
  timestamps: true,
});

// One budget per user+category+month
budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
