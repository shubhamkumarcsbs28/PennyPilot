const Expense = require('../models/Expense');

/**
 * GET /api/predictions
 * Returns spending forecast based on historical data
 */
exports.getPredictions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Monthly totals
    const monthly = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: sixMonthsAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      }},
      { $sort: { _id: 1 } },
    ]);

    // Current month data
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentData = monthly.find(m => m._id === currentMonthKey);
    const currentSpent = currentData?.total || 0;

    // Last 3 months for prediction
    const last3 = monthly.slice(-3);
    const avg = last3.length > 0
      ? last3.reduce((s, m) => s + m.total, 0) / last3.length
      : 0;

    // Trend: simple linear slope
    const trend = last3.length >= 2
      ? (last3[last3.length - 1].total - last3[0].total) / Math.max(1, last3.length - 1)
      : 0;

    const predicted = Math.max(0, avg + trend);

    // Project current month
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dayOfMonth  = now.getDate();
    const projected   = dayOfMonth > 0 ? (currentSpent / dayOfMonth) * daysInMonth : 0;

    // Category predictions
    const catData = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]);

    const categoryPredictions = catData.map(c => ({
      category: c._id,
      current: c.total,
      predicted: Math.round(c.total * (0.9 + Math.random() * 0.3)),
    }));

    // Chart data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = monthly.map(m => {
      const [y, mo] = m._id.split('-');
      return {
        month: `${months[parseInt(mo) - 1]} ${y.slice(2)}`,
        total: m.total,
        type: 'actual',
      };
    });
    chartData.push({
      month: 'Next',
      total: Math.round(predicted),
      type: 'predicted',
    });

    res.json({
      nextMonthPredicted: Math.round(predicted),
      thisMonthProjected: Math.round(projected),
      currentSpent,
      savingsEstimate: Math.round(predicted * 0.15),
      overspendRisk: projected > avg * 1.1,
      chartData,
      categoryPredictions,
    });
  } catch (err) {
    next(err);
  }
};
