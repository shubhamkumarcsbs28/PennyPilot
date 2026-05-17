import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const ExpenseContext = createContext()

export const ExpenseProvider = ({ children }) => {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [budgets, setBudgets]   = useState([])
  const [stats, setStats]       = useState({ totalSpent: 0, changePercent: 0, transactionCount: 0, avgPerDay: 0 })
  const [monthlyData, setMonthlyData] = useState([])
  const [trendData, setTrendData]     = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [predictions, setPredictions] = useState({ nextMonthPredicted: 0, chartData: [] })
  const [insights, setInsights]       = useState([])
  const [loading, setLoading]         = useState(true)

  const [filters, setFilters]   = useState({
    category: 'all',
    search: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    sortDir: 'desc',
  })

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const [expRes, statRes, insightRes, predictRes, budgetRes] = await Promise.all([
        api.get('/expenses', { params: filters }),
        api.get('/expenses/stats'),
        api.get('/insights'),
        api.get('/predictions'),
        api.get('/budgets'),
      ])

      setExpenses(expRes.data.expenses)
      setStats(statRes.data.currentMonth)
      setMonthlyData(statRes.data.monthlyData.map(m => ({ month: m._id, amount: m.total })))
      setTrendData(statRes.data.dailyTrend.map(d => ({ date: d._id, amount: d.amount })))
      setCategoryData(statRes.data.categoryData.map(c => ({ id: c._id, value: c.total, label: c._id })))
      setInsights(insightRes.data.insights)
      setPredictions(predictRes.data)
      setBudgets(budgetRes.data)
    } catch (err) {
      console.error('Failed to fetch expense data:', err)
    } finally {
      setLoading(false)
    }
  }, [user, filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ── EXPENSE CRUD ──────────────────────────────────
  const addExpense = async (data) => {
    try {
      const res = await api.post('/expenses', data)
      setExpenses(prev => [res.data, ...prev])
      fetchData() // Refresh stats
      return res.data
    } catch (err) {
      console.error('Add expense failed:', err)
      throw err
    }
  }

  const updateExpense = async (id, data) => {
    try {
      const res = await api.put(`/expenses/${id}`, data)
      setExpenses(prev => prev.map(e => e._id === id ? res.data : e))
      fetchData()
      return res.data
    } catch (err) {
      console.error('Update expense failed:', err)
      throw err
    }
  }

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`)
      setExpenses(prev => prev.filter(e => e._id !== id))
      fetchData()
    } catch (err) {
      console.error('Delete expense failed:', err)
      throw err
    }
  }

  // ── BUDGET CRUD ───────────────────────────────────
  const updateBudget = async (category, limit) => {
    try {
      const res = await api.post('/budgets', { category, limit })
      setBudgets(prev => {
        const exists = prev.find(b => b.category === category)
        if (exists) return prev.map(b => b.category === category ? { ...b, limit, _id: res.data._id } : b)
        return [...prev, res.data]
      })
      fetchData()
    } catch (err) {
      console.error('Update budget failed:', err)
    }
  }

  const getFilteredExpenses = () => expenses

  const getBudgetStatus = () => budgets

  return (
    <ExpenseContext.Provider value={{
      expenses, filters, setFilters, loading,
      addExpense, updateExpense, deleteExpense,
      budgets, updateBudget,
      getFilteredExpenses,
      stats, monthlyData, trendData, categoryData, predictions, insights,
      getBudgetStatus,
      refreshData: fetchData,
    }}>
      {children}
    </ExpenseContext.Provider>
  )
}

export const useExpenses = () => useContext(ExpenseContext)
