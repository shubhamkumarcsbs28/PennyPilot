const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  merchant: {
    type: String,
    required: [true, 'Merchant name is required'],
    trim: true,
    maxlength: 120,
  },
  category: {
    type: String,
    required: true,
    enum: ['food', 'shopping', 'transport', 'bills', 'entertainment',
           'healthcare', 'travel', 'education', 'other'],
    default: 'other',
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500,
    default: '',
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash'],
    default: 'UPI',
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  source: {
    type: String,
    enum: ['manual', 'ocr', 'sms', 'import'],
    default: 'manual',
  },
}, {
  timestamps: true,
});

// Compound index for efficient queries
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
