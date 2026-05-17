const Budget  = require('../models/Budget');
const Expense = require('../models/Expense');

/**
 * GET /api/budgets
 * Returns current month's budgets with spending status
 */
exports.getBudgets = async (req, res, next) => {
  try {
    const now   = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const budgets = await Budget.find({ user: req.user._id, month });

    // Calculate spent per category
    const spending = await Expense.aggregate([
      { $match: { user: req.user._id, date: { $gte: startOfMonth } } },
      { $group: { _id: '$category', spent: { $sum: '$amount' } } },
    ]);

    const spendingMap = {};
    spending.forEach(s => { spendingMap[s._id] = s.spent; });

    const result = budgets.map(b => ({
      _id: b._id,
      category: b.category,
      limit: b.limit,
      month: b.month,
      spent: spendingMap[b.category] || 0,
      pct: b.limit > 0 ? Math.min(((spendingMap[b.category] || 0) / b.limit) * 100, 100) : 0,
      exceeded: (spendingMap[b.category] || 0) > b.limit,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/budgets
 * Create or update a budget for a category+month
 */
exports.upsertBudget = async (req, res, next) => {
  try {
    const { category, limit } = req.body;
    if (!category || limit === undefined) {
      return res.status(400).json({ message: 'Category and limit are required' });
    }

    const now   = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category, month },
      { limit },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(budget);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/budgets/:id
 */
exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted', id: req.params.id });
  } catch (err) {
    next(err);
  }
};
