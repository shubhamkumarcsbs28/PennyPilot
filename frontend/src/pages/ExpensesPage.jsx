import { useState } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { getCategoryById, CATEGORIES } from '../utils/mockData'
import { formatCurrency, formatDate, generateId } from '../utils/formatters'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Plus, Search, Trash2, Edit2, Download, X } from 'lucide-react'
import { format } from 'date-fns'
import Papa from 'papaparse'

const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Newest First' },
  { value: 'date_asc',  label: 'Oldest First' },
  { value: 'amount_desc', label: 'Highest Amount' },
  { value: 'amount_asc',  label: 'Lowest Amount' },
]
const DEFAULT_FORM = {
  merchant: '', category: 'food', amount: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  paymentMethod: 'UPI', notes: '',
}

const ExpenseForm = ({ initial = DEFAULT_FORM, onSave, onClose }) => {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.merchant || !form.amount) return
    onSave({ ...form, amount: parseFloat(form.amount) })
    onClose()
  }
  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div className="input-group" style={{ gridColumn: '1/-1' }}>
          <label className="input-label">Merchant / Description</label>
          <input className="input" value={form.merchant} onChange={e => set('merchant', e.target.value)} placeholder="e.g. Swiggy" required />
        </div>
        <div className="input-group">
          <label className="input-label">Amount (₹)</label>
          <input className="input" type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0" min="0" step="0.01" required />
        </div>
        <div className="input-group">
          <label className="input-label">Date</label>
          <input className="input" type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
        </div>
        <div className="input-group">
          <label className="input-label">Category</label>
          <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">Payment Method</label>
          <select className="input" value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value)}>
            {['UPI','Credit Card','Debit Card','Net Banking','Cash'].map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="input-group" style={{ gridColumn: '1/-1' }}>
          <label className="input-label">Notes (optional)</label>
          <input className="input" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional info" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
        <Button variant="primary" type="submit">Save Expense</Button>
      </div>
    </form>
  )
}

export const ExpensesPage = () => {
  const { getFilteredExpenses, filters, setFilters, addExpense, updateExpense, deleteExpense } = useExpenses()
  const [addOpen, setAddOpen] = useState(false)
  const [editExp, setEditExp] = useState(null)
  const [sortVal, setSortVal] = useState('date_desc')
  const allExpenses = getFilteredExpenses()
  const totalFiltered = allExpenses.reduce((s, e) => s + e.amount, 0)

  const applySort = (v) => {
    setSortVal(v)
    const [sortBy, sortDir] = v.split('_')
    setFilters(f => ({ ...f, sortBy, sortDir }))
  }

  const handleExportCSV = () => {
    const csv = Papa.unparse(allExpenses.map(e => ({
      Date: e.date, Merchant: e.merchant, Category: e.category,
      Amount: e.amount, 'Payment Method': e.paymentMethod, Notes: e.notes,
    })))
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'expenses.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">Expenses</h2>
          <p className="page-subtitle">{allExpenses.length} transactions · {formatCurrency(totalFiltered)}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={handleExportCSV}><Download size={14} /> Export CSV</Button>
          <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}><Plus size={14} /> Add Expense</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 32 }} placeholder="Search merchant…" value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
        </div>
        <select className="input" style={{ flex: '0 1 160px' }} value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>
        <input className="input" type="date" style={{ flex: '0 1 150px' }} value={filters.dateFrom} onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))} />
        <input className="input" type="date" style={{ flex: '0 1 150px' }} value={filters.dateTo} onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))} />
        <select className="input" style={{ flex: '0 1 160px' }} value={sortVal} onChange={e => applySort(e.target.value)}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <Button variant="ghost" size="sm" onClick={() => setFilters({ category: 'all', search: '', dateFrom: '', dateTo: '', sortBy: 'date', sortDir: 'desc' })}>
          <X size={14} /> Clear
        </Button>
      </div>

      {/* List */}
      <div className="card" style={{ padding: '8px 16px' }}>
        {allExpenses.length === 0 ? (
          <EmptyState icon="🔍" title="No expenses found" description="Adjust filters or add a new expense."
            action={<Button variant="primary" onClick={() => setAddOpen(true)}><Plus size={14} /> Add</Button>} />
        ) : allExpenses.map(exp => {
          const cat = getCategoryById(exp.category)
          return (
            <div key={exp._id} className="tx-row" style={{ paddingRight: 0 }}>
              <div className="tx-icon" style={{ background: `${cat.color}18` }}>
                <span style={{ fontSize: 18 }}>{cat.icon}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.merchant}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{formatDate(exp.date)} · {exp.paymentMethod}{exp.notes ? ` · ${exp.notes}` : ''}</div>
              </div>
              <span className={`badge cat-${exp.category}`} style={{ marginRight: 12 }}>{cat.label}</span>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-danger)', minWidth: 80, textAlign: 'right' }}>−{formatCurrency(exp.amount)}</div>
              <div style={{ display: 'flex', gap: 6, marginLeft: 12 }}>
                <button onClick={() => setEditExp(exp)} style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bg-elevated)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}><Edit2 size={13} /></button>
                <button onClick={() => deleteExpense(exp._id)} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-danger)' }}><Trash2 size={13} /></button>
              </div>
            </div>
          )
        })}
      </div>

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add New Expense">
        <ExpenseForm onSave={addExpense} onClose={() => setAddOpen(false)} />
      </Modal>
      <Modal isOpen={!!editExp} onClose={() => setEditExp(null)} title="Edit Expense">
        {editExp && <ExpenseForm initial={{ ...editExp, amount: String(editExp.amount) }} onSave={(data) => { updateExpense(editExp._id, data); setEditExp(null) }} onClose={() => setEditExp(null)} />}
      </Modal>
    </div>
  )
}
