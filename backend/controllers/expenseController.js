const Expense = require('../models/Expense');

// Merchant → category mapping for auto-categorization
const MERCHANT_MAP = {
  swiggy: 'food', zomato: 'food', dominos: 'food', kfc: 'food', mcdonalds: 'food',
  starbucks: 'food', subway: 'food', pizzahut: 'food', blinkit: 'food', dunkin: 'food',
  uber: 'transport', ola: 'transport', rapido: 'transport', irctc: 'transport',
  petrol: 'transport', metro: 'transport', redbus: 'transport',
  amazon: 'shopping', flipkart: 'shopping', myntra: 'shopping', ajio: 'shopping',
  nykaa: 'shopping', meesho: 'shopping', dmart: 'shopping',
  netflix: 'entertainment', spotify: 'entertainment', hotstar: 'entertainment',
  bookmyshow: 'entertainment', primevideo: 'entertainment',
  jio: 'bills', airtel: 'bills', bsnl: 'bills', electricity: 'bills',
  gas: 'bills', insurance: 'bills', water: 'bills',
  apollo: 'healthcare', medplus: 'healthcare', pharmeasy: 'healthcare', hospital: 'healthcare',
  makemytrip: 'travel', goibibo: 'travel', oyo: 'travel', airbnb: 'travel',
  udemy: 'education', coursera: 'education', byju: 'education', unacademy: 'education',
};

const autoCategorize = (merchant) => {
  if (!merchant) return 'other';
  const lower = merchant.toLowerCase().replace(/\s+/g, '');
  for (const [key, cat] of Object.entries(MERCHANT_MAP)) {
    if (lower.includes(key)) return cat;
  }
  return 'other';
};

/**
 * GET /api/expenses
 * Supports: ?category=food&from=2026-01-01&to=2026-05-31&search=swiggy&sort=date&order=desc&limit=50&page=1
 */
exports.getExpenses = async (req, res, next) => {
  try {
    const { category, from, to, search, sort = 'date', order = 'desc', limit = 100, page = 1 } = req.query;

    const filter = { user: req.user._id };

    if (category && category !== 'all') filter.category = category;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to)   filter.date.$lte = new Date(to);
    }
    if (search) {
      filter.$or = [
        { merchant: { $regex: search, $options: 'i' } },
        { notes:    { $regex: search, $options: 'i' } },
      ];
    }

    const sortDir = order === 'asc' ? 1 : -1;
    const sortObj = sort === 'amount' ? { amount: sortDir } : { date: sortDir };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [expenses, total] = await Promise.all([
      Expense.find(filter).sort(sortObj).skip(skip).limit(parseInt(limit)),
      Expense.countDocuments(filter),
    ]);

    res.json({ expenses, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/expenses
 */
exports.createExpense = async (req, res, next) => {
  try {
    const { merchant, category, amount, date, notes, paymentMethod, isRecurring, source } = req.body;

    if (!merchant || amount === undefined) {
      return res.status(400).json({ message: 'Merchant and amount are required' });
    }

    // Auto-categorize if not provided or 'other'
    const finalCategory = (category && category !== 'other')
      ? category
      : autoCategorize(merchant);

    const expense = await Expense.create({
      user: req.user._id,
      merchant,
      category: finalCategory,
      amount,
      date: date || new Date(),
      notes: notes || '',
      paymentMethod: paymentMethod || 'UPI',
      isRecurring: isRecurring || false,
      source: source || 'manual',
    });

    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/expenses/:id
 */
exports.updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const allowed = ['merchant', 'category', 'amount', 'date', 'notes', 'paymentMethod', 'isRecurring'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) expense[field] = req.body[field];
    });

    await expense.save();
    res.json(expense);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/expenses/:id
 */
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted', id: req.params.id });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/expenses/stats
 * Returns monthly aggregates, category breakdown, and daily trend
 */
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonth    = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Monthly totals (last 6 months)
    const monthlyData = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: sixMonthsAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      }},
      { $sort: { _id: 1 } },
    ]);

    // Category breakdown (current month)
    const categoryData = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: currentMonth } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]);

    // Current month total
    const currentTotal = categoryData.reduce((s, c) => s + c.total, 0);

    // Previous month total
    const prevData = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: prevMonth, $lt: currentMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    const prevTotal = prevData[0]?.total || 0;

    // Change percentage
    const changePercent = prevTotal > 0
      ? Math.round(((currentTotal - prevTotal) / prevTotal) * 100)
      : 0;

    // Daily trend (last 14 days)
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 13);
    const dailyTrend = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: twoWeeksAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        amount: { $sum: '$amount' },
      }},
      { $sort: { _id: 1 } },
    ]);

    res.json({
      monthlyData,
      categoryData,
      currentMonth: {
        totalSpent: currentTotal,
        prevMonthSpent: prevTotal,
        changePercent,
        transactionCount: categoryData.reduce((s, c) => s, 0), // placeholder
      },
      dailyTrend,
    });
  } catch (err) {
    next(err);
  }
};
