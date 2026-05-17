const Expense = require('../models/Expense');

/**
 * GET /api/insights
 * Generates AI-powered spending insights based on the user's expense data
 */
exports.getInsights = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonth    = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Current month expenses
    const current = await Expense.find({ user: userId, date: { $gte: currentMonth } });
    const prev    = await Expense.find({ user: userId, date: { $gte: prevMonth, $lt: currentMonth } });

    const currTotal = current.reduce((s, e) => s + e.amount, 0);
    const prevTotal = prev.reduce((s, e) => s + e.amount, 0);
    const changePct = prevTotal > 0 ? ((currTotal - prevTotal) / prevTotal) * 100 : 0;

    // Category totals (current month)
    const catTotals = {};
    current.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
    const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
    const topCat = sortedCats[0];

    // Weekend vs weekday analysis
    const weekendTotal = current.filter(e => { const d = new Date(e.date); return d.getDay() === 0 || d.getDay() === 6; }).reduce((s, e) => s + e.amount, 0);
    const weekdayTotal = current.filter(e => { const d = new Date(e.date); return d.getDay() > 0 && d.getDay() < 6; }).reduce((s, e) => s + e.amount, 0);

    const insights = [];
    let id = 1;

    // Spending spike
    if (changePct > 10) {
      insights.push({
        id: id++, type: 'warning', priority: 'high',
        title: 'Spending Spike Detected',
        description: `You spent ${Math.abs(Math.round(changePct))}% more this month compared to last month. Consider reviewing discretionary expenses.`,
        icon: '⚠️', saving: null,
      });
    } else if (changePct < -10) {
      insights.push({
        id: id++, type: 'positive', priority: 'medium',
        title: 'Great Savings!',
        description: `Your spending decreased by ${Math.abs(Math.round(changePct))}% compared to last month. Keep up the good work!`,
        icon: '🎉', saving: null,
      });
    }

    // Top category
    if (topCat) {
      insights.push({
        id: id++, type: 'info', priority: 'medium',
        title: `Top Spending: ${topCat[0].charAt(0).toUpperCase() + topCat[0].slice(1)}`,
        description: `${topCat[0].charAt(0).toUpperCase() + topCat[0].slice(1)} accounts for ₹${topCat[1].toLocaleString('en-IN')} this month — your highest category.`,
        icon: '📊', saving: null,
      });
    }

    // Food savings
    const foodTotal = catTotals.food || 0;
    if (foodTotal > 3000) {
      const saving = Math.round(foodTotal * 0.3);
      insights.push({
        id: id++, type: 'tip', priority: 'medium',
        title: 'Reduce Online Food Orders',
        description: `Cutting food delivery orders by 30% could save you ₹${saving.toLocaleString('en-IN')}/month.`,
        icon: '💡', saving,
      });
    }

    // Weekend spending
    if (weekendTotal / 2 > weekdayTotal / 5) {
      insights.push({
        id: id++, type: 'info', priority: 'low',
        title: 'High Weekend Spending',
        description: 'Your weekend spending per day is higher than weekdays. Plan a weekend budget to stay on track.',
        icon: '📅', saving: null,
      });
    }

    // Savings opportunity
    insights.push({
      id: id++, type: 'positive', priority: 'low',
      title: 'Savings Opportunity',
      description: `Based on your spending pattern, you could save ₹${Math.round(currTotal * 0.12).toLocaleString('en-IN')} by optimizing subscriptions and impulse purchases.`,
      icon: '🎯', saving: Math.round(currTotal * 0.12),
    });

    res.json({
      insights,
      summary: {
        totalSpent: currTotal,
        prevMonthSpent: prevTotal,
        changePercent: Math.round(changePct),
        transactionCount: current.length,
        avgPerDay: Math.round(currTotal / Math.max(1, now.getDate())),
      },
      categoryBreakdown: sortedCats.map(([cat, val]) => ({ category: cat, total: val })),
    });
  } catch (err) {
    next(err);
  }
};
