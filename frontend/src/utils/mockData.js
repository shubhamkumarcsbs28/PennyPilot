// ============================================================
//  MOCK DATA — Realistic 6-month expense history
// ============================================================

import { subDays, subMonths, format, startOfMonth } from 'date-fns'

export const CATEGORIES = [
  { id: 'food',          label: 'Food',          color: '#f97316', icon: '🍔', cls: 'cat-food' },
  { id: 'shopping',      label: 'Shopping',       color: '#ec4899', icon: '🛍️', cls: 'cat-shopping' },
  { id: 'transport',     label: 'Transport',      color: '#3b82f6', icon: '🚗', cls: 'cat-transport' },
  { id: 'bills',         label: 'Bills',          color: '#8b5cf6', icon: '📄', cls: 'cat-bills' },
  { id: 'entertainment', label: 'Entertainment',  color: '#ef4444', icon: '🎬', cls: 'cat-entertainment' },
  { id: 'healthcare',    label: 'Healthcare',     color: '#10b981', icon: '💊', cls: 'cat-healthcare' },
  { id: 'travel',        label: 'Travel',         color: '#06b6d4', icon: '✈️', cls: 'cat-travel' },
  { id: 'education',     label: 'Education',      color: '#f59e0b', icon: '📚', cls: 'cat-education' },
  { id: 'other',         label: 'Other',          color: '#64748b', icon: '📦', cls: 'cat-other' },
]

export const getCategoryById = (id) =>
  CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]

// Merchant → Category mapping
export const MERCHANT_CATEGORY_MAP = {
  swiggy: 'food', zomato: 'food', dominos: 'food', kfc: 'food', mcdonalds: 'food',
  starbucks: 'food', dunkin: 'food', subway: 'food', pizzahut: 'food', blinkit: 'food',
  uber: 'transport', ola: 'transport', rapido: 'transport', irctc: 'transport', redbus: 'transport',
  petrol: 'transport', fuel: 'transport', metro: 'transport',
  amazon: 'shopping', flipkart: 'shopping', myntra: 'shopping', ajio: 'shopping',
  nykaa: 'shopping', meesho: 'shopping', reliance: 'shopping', dmart: 'shopping',
  netflix: 'entertainment', spotify: 'entertainment', hotstar: 'entertainment',
  primevideo: 'entertainment', bookmyshow: 'entertainment', youtube: 'entertainment',
  jio: 'bills', airtel: 'bills', bsnl: 'bills', tata: 'bills', electricity: 'bills',
  water: 'bills', gas: 'bills', insurance: 'bills', recharge: 'bills', utility: 'bills',
  broadband: 'bills', internet: 'bills', subscription: 'bills', mobile: 'bills', dth: 'bills',
  apollo: 'healthcare', medplus: 'healthcare', pharmeasy: 'healthcare', netmeds: 'healthcare',
  hospital: 'healthcare', doctor: 'healthcare', clinic: 'healthcare',
  makemytrip: 'travel', goibibo: 'travel', cleartrip: 'travel', airbnb: 'travel', oyo: 'travel',
  udemy: 'education', coursera: 'education', byju: 'education', unacademy: 'education', books: 'education',
}

export const categorizeByMerchant = (merchant = '') => {
  const lower = merchant.toLowerCase().replace(/\s+/g, '')
  for (const [key, cat] of Object.entries(MERCHANT_CATEGORY_MAP)) {
    if (lower.includes(key)) return cat
  }
  return 'other'
}

export const categorizeByText = (text = '') => {
  const lower = text.toLowerCase()
  if (/(?:\bbill\b|electricity|water|gas|insurance|recharge|subscription|utility|broadband|internet|mobile|dth|cable|dues)/i.test(lower)) {
    return 'bills'
  }
  return 'other'
}

// Generate random expense data
const now = new Date()
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

const MERCHANTS = {
  food:          ['Swiggy', 'Zomato', "Domino's", 'KFC', 'McDonald\'s', 'Starbucks', 'Blinkit'],
  shopping:      ['Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Nykaa', 'D-Mart'],
  transport:     ['Uber', 'Ola', 'Rapido', 'IRCTC', 'Petrol Pump', 'Metro Card'],
  bills:         ['Jio Recharge', 'Airtel Bill', 'Electricity Bill', 'Gas Bill', 'Netflix', 'Insurance'],
  entertainment: ['BookMyShow', 'Hotstar', 'Spotify', 'PVR Cinemas', 'Prime Video'],
  healthcare:    ['Apollo Pharmacy', 'MedPlus', 'PharmEasy', 'Hospital Bill'],
  travel:        ['MakeMyTrip', 'OYO Hotel', 'Goibibo', 'Airbnb'],
  education:     ['Udemy', 'Coursera', "Byju's", 'Book Store'],
  other:         ['ATM Withdrawal', 'Salon', 'Laundry', 'Grocery Store'],
}

let idCounter = 1
const generateExpenses = () => {
  const expenses = []
  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const expensesCount = rand(18, 28)
    for (let i = 0; i < expensesCount; i++) {
      const category = pick(CATEGORIES).id
      const merchant = pick(MERCHANTS[category] || MERCHANTS.other)
      const daysBack = monthOffset * 30 + rand(0, 29)
      const date = subDays(now, daysBack)
      const amountMap = {
        food: rand(80, 800), shopping: rand(299, 4999), transport: rand(40, 600),
        bills: rand(199, 1499), entertainment: rand(149, 999), healthcare: rand(100, 2500),
        travel: rand(500, 8000), education: rand(299, 4999), other: rand(50, 1000),
      }
      expenses.push({
        _id: `mock_${idCounter++}`,
        merchant,
        category,
        amount: amountMap[category] || rand(100, 1000),
        date: format(date, 'yyyy-MM-dd'),
        notes: '',
        paymentMethod: pick(['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash']),
        isRecurring: Math.random() < 0.1,
      })
    }
  }
  return expenses.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export const MOCK_EXPENSES = generateExpenses()

// Monthly aggregates
export const getMonthlyData = (expenses = MOCK_EXPENSES) => {
  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = subMonths(now, i)
    const monthKey = format(d, 'yyyy-MM')
    const monthExpenses = expenses.filter(e => e.date.startsWith(monthKey))
    const total = monthExpenses.reduce((s, e) => s + e.amount, 0)
    months.push({
      month: format(d, 'MMM yy'),
      total,
      count: monthExpenses.length,
    })
  }
  return months
}

// Category breakdown for current month
export const getCategoryBreakdown = (expenses = MOCK_EXPENSES) => {
  const currentMonth = format(now, 'yyyy-MM')
  const current = expenses.filter(e => e.date.startsWith(currentMonth))
  const totals = {}
  current.forEach(e => { totals[e.category] = (totals[e.category] || 0) + e.amount })
  return Object.entries(totals).map(([id, value]) => ({
    ...getCategoryById(id),
    value,
  })).sort((a, b) => b.value - a.value)
}

// Current month stats
export const getCurrentMonthStats = (expenses = MOCK_EXPENSES) => {
  const currentMonth = format(now, 'yyyy-MM')
  const prevMonth = format(subMonths(now, 1), 'yyyy-MM')
  const current = expenses.filter(e => e.date.startsWith(currentMonth))
  const prev = expenses.filter(e => e.date.startsWith(prevMonth))
  const totalCurrent = current.reduce((s, e) => s + e.amount, 0)
  const totalPrev = prev.reduce((s, e) => s + e.amount, 0)
  const change = totalPrev > 0 ? ((totalCurrent - totalPrev) / totalPrev) * 100 : 0
  return {
    totalSpent: totalCurrent,
    prevMonthSpent: totalPrev,
    changePercent: Math.round(change),
    transactionCount: current.length,
    avgPerDay: Math.round(totalCurrent / new Date().getDate()),
  }
}

// Spending trend (last 14 days)
export const getSpendingTrend = (expenses = MOCK_EXPENSES) => {
  const result = []
  for (let i = 13; i >= 0; i--) {
    const d = subDays(now, i)
    const dateKey = format(d, 'yyyy-MM-dd')
    const dayExpenses = expenses.filter(e => e.date === dateKey)
    result.push({
      day: format(d, 'dd MMM'),
      amount: dayExpenses.reduce((s, e) => s + e.amount, 0),
    })
  }
  return result
}

// Predictions (simple linear projection)
export const getPredictions = (expenses = MOCK_EXPENSES) => {
  const monthly = getMonthlyData(expenses)
  const last3 = monthly.slice(-3)
  const avg = last3.reduce((s, m) => s + m.total, 0) / 3
  const trend = (last3[2].total - last3[0].total) / 2
  const predicted = Math.max(0, avg + trend)
  const currentMonth = format(now, 'yyyy-MM')
  const currentSpent = expenses
    .filter(e => e.date.startsWith(currentMonth))
    .reduce((s, e) => s + e.amount, 0)
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const dayOfMonth = now.getDate()
  const projectedThisMonth = (currentSpent / dayOfMonth) * daysInMonth

  return {
    nextMonthPredicted: Math.round(predicted),
    thisMonthProjected: Math.round(projectedThisMonth),
    currentSpent,
    savingsEstimate: Math.round(predicted * 0.15),
    overspendRisk: projectedThisMonth > avg * 1.1,
    chartData: [
      ...monthly.map(m => ({ ...m, type: 'actual' })),
      { month: 'Next', total: Math.round(predicted), type: 'predicted' },
    ],
  }
}

// AI Insights
export const getAIInsights = (expenses = MOCK_EXPENSES) => {
  const stats = getCurrentMonthStats(expenses)
  const breakdown = getCategoryBreakdown(expenses)
  const topCat = breakdown[0]
  const insights = []

  if (stats.changePercent > 10) {
    insights.push({
      id: 1, type: 'warning', priority: 'high',
      title: 'Spending Spike Detected',
      description: `You spent ${Math.abs(stats.changePercent)}% more this month compared to last month. Consider reviewing discretionary expenses.`,
      icon: '⚠️', saving: null,
    })
  }
  if (topCat) {
    insights.push({
      id: 2, type: 'info', priority: 'medium',
      title: `Top Spending: ${topCat.label}`,
      description: `${topCat.label} accounts for ₹${topCat.value.toLocaleString('en-IN')} this month — your highest category.`,
      icon: topCat.icon, saving: null,
    })
  }

  const foodExp = breakdown.find(c => c.id === 'food')
  if (foodExp && foodExp.value > 3000) {
    const saving = Math.round(foodExp.value * 0.3)
    insights.push({
      id: 3, type: 'tip', priority: 'medium',
      title: 'Reduce Online Food Orders',
      description: `Cutting food delivery orders by 30% could save you ₹${saving.toLocaleString('en-IN')}/month.`,
      icon: '💡', saving,
    })
  }

  const weekend = expenses
    .filter(e => { const d = new Date(e.date); return d.getDay() === 0 || d.getDay() === 6 })
    .reduce((s, e) => s + e.amount, 0)
  const weekday = expenses
    .filter(e => { const d = new Date(e.date); return d.getDay() > 0 && d.getDay() < 6 })
    .reduce((s, e) => s + e.amount, 0)
  if (weekend / 2 > weekday / 5) {
    insights.push({
      id: 4, type: 'info', priority: 'low',
      title: 'High Weekend Spending',
      description: 'Your weekend spending is significantly higher than weekdays. Plan a weekend budget to stay on track.',
      icon: '📅', saving: null,
    })
  }

  insights.push({
    id: 5, type: 'positive', priority: 'low',
    title: 'Savings Opportunity',
    description: `Based on your spending pattern, you could save ₹${(stats.totalSpent * 0.12).toLocaleString('en-IN', { maximumFractionDigits: 0 })} by optimizing subscriptions and impulse purchases.`,
    icon: '🎯', saving: Math.round(stats.totalSpent * 0.12),
  })

  return insights
}

// Demo SMS messages
export const DEMO_SMS = [
  { id: 1, text: 'Rs.450 debited from HDFC Card on Swiggy. Avail. Bal: Rs.24,550.00' },
  { id: 2, text: 'INR 1,299.00 spent on Amazon using ICICI Credit Card ending 4321.' },
  { id: 3, text: 'Rs.350 paid to Uber via UPI on 12-May-26. Ref No: UPI123456789' },
  { id: 4, text: 'Your Jio bill of Rs.699 has been paid successfully via Auto-Pay.' },
  { id: 5, text: 'Rs.2,499 debited for Netflix subscription renewal from HDFC Bank.' },
  { id: 6, text: 'INR 180 paid to Rapido using BHIM UPI. Available balance: Rs.8,320.' },
  { id: 7, text: 'Rs.5,999 spent at Myntra.com using SBI Credit Card on 11-May-26.' },
  { id: 8, text: 'Rs.125 paid to Starbucks India via GPay UPI. Ref: GPY987654321.' },
]

// Budget defaults
export const DEFAULT_BUDGETS = [
  { category: 'food',          limit: 5000  },
  { category: 'shopping',      limit: 8000  },
  { category: 'transport',     limit: 2000  },
  { category: 'bills',         limit: 3000  },
  { category: 'entertainment', limit: 1500  },
  { category: 'healthcare',    limit: 2000  },
  { category: 'travel',        limit: 10000 },
  { category: 'education',     limit: 3000  },
]
