/**
 * Seed script — populates the database with a demo user and 6 months of realistic expense data.
 *
 * Usage:  node utils/seedData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User    = require('../models/User');
const Expense = require('../models/Expense');
const Budget  = require('../models/Budget');

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const MERCHANTS = {
  food:          ['Swiggy', 'Zomato', "Domino's", 'KFC', "McDonald's", 'Starbucks', 'Blinkit'],
  shopping:      ['Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Nykaa', 'D-Mart'],
  transport:     ['Uber', 'Ola', 'Rapido', 'IRCTC', 'Petrol Pump', 'Metro Card'],
  bills:         ['Jio Recharge', 'Airtel Bill', 'Electricity Bill', 'Gas Bill', 'Insurance'],
  entertainment: ['BookMyShow', 'Hotstar', 'Spotify', 'PVR Cinemas', 'Netflix'],
  healthcare:    ['Apollo Pharmacy', 'MedPlus', 'PharmEasy', 'Hospital Bill'],
  travel:        ['MakeMyTrip', 'OYO Hotel', 'Goibibo', 'Airbnb'],
  education:     ['Udemy', 'Coursera', "Byju's", 'Book Store'],
  other:         ['ATM Withdrawal', 'Salon', 'Laundry', 'Grocery Store'],
};

const AMOUNT_RANGES = {
  food: [80, 800], shopping: [299, 4999], transport: [40, 600],
  bills: [199, 1499], entertainment: [149, 999], healthcare: [100, 2500],
  travel: [500, 8000], education: [299, 4999], other: [50, 1000],
};

const CATEGORIES = Object.keys(MERCHANTS);

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Expense.deleteMany({});
    await Budget.deleteMany({});
    console.log('   Cleared existing data');

    // Create demo user
    const user = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      password: 'password123',
      balance: 45000,
      currency: '₹',
    });
    console.log(`   ✅ User created: ${user.email}`);

    // Generate 6 months of expenses
    const now = new Date();
    const expenses = [];

    for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
      const count = rand(18, 28);
      for (let i = 0; i < count; i++) {
        const category = pick(CATEGORIES);
        const merchant = pick(MERCHANTS[category]);
        const [minAmt, maxAmt] = AMOUNT_RANGES[category];

        const date = new Date(now);
        date.setMonth(date.getMonth() - monthOffset);
        date.setDate(rand(1, 28));

        expenses.push({
          user: user._id,
          merchant,
          category,
          amount: rand(minAmt, maxAmt),
          date,
          paymentMethod: pick(['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash']),
          isRecurring: Math.random() < 0.1,
          source: 'manual',
          notes: '',
        });
      }
    }

    await Expense.insertMany(expenses);
    console.log(`   ✅ ${expenses.length} expenses created`);

    // Create default budgets for current month
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const budgets = [
      { user: user._id, category: 'food',          limit: 5000,  month },
      { user: user._id, category: 'shopping',      limit: 8000,  month },
      { user: user._id, category: 'transport',     limit: 2000,  month },
      { user: user._id, category: 'bills',         limit: 3000,  month },
      { user: user._id, category: 'entertainment', limit: 1500,  month },
      { user: user._id, category: 'healthcare',    limit: 2000,  month },
      { user: user._id, category: 'travel',        limit: 10000, month },
      { user: user._id, category: 'education',     limit: 3000,  month },
    ];
    await Budget.insertMany(budgets);
    console.log(`   ✅ ${budgets.length} budgets created`);

    console.log('\n🎉 Seed complete!');
    console.log(`   Login with: aarav@example.com / password123\n`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
