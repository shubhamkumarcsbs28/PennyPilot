import { useState } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { parseSMS } from '../utils/smsParser'
import { DEMO_SMS, getCategoryById, CATEGORIES } from '../utils/mockData'
import { formatCurrency } from '../utils/formatters'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { MessageSquare, Zap, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export const SMSPage = () => {
  const { addExpense } = useExpenses()
  const [smsText, setSmsText]   = useState('')
  const [parsed, setParsed]     = useState(null)
  const [form, setForm]         = useState(null)
  const [saveOpen, setSaveOpen] = useState(false)

  const handleParse = (text) => {
    const result = parseSMS(text)
    setParsed(result)
    setForm({ ...result, amount: result.amount || '', notes: 'Imported from SMS' })
    setSaveOpen(true)
  }

  const handleSave = () => {
    if (!form?.amount) { toast.error('Amount required'); return }
    addExpense({ ...form, amount: parseFloat(form.amount) })
    toast.success('Expense imported from SMS! 📲')
    setSaveOpen(false)
    setSmsText('')
    setParsed(null)
  }

  return (
    <div className="page-content stagger">
      <div className="page-header">
        <div>
          <h2 className="page-title">SMS Parser</h2>
          <p className="page-subtitle">Auto-import expenses from bank SMS messages</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(99,102,241,0.1)', borderRadius: 99, fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>
          <Zap size={14} /> Smart Parser
        </div>
      </div>

      {/* Manual Input */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Paste SMS Text</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Copy a bank SMS and paste it below to extract expense details automatically.</p>
        <textarea
          className="input"
          rows={3}
          placeholder='e.g. "Rs.450 debited from HDFC Card on Swiggy. Avail. Bal: Rs.24,550.00"'
          value={smsText}
          onChange={e => setSmsText(e.target.value)}
          style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }}
        />
        <Button
          variant="primary"
          style={{ marginTop: 12 }}
          onClick={() => { if (smsText.trim()) handleParse(smsText.trim()) }}
          disabled={!smsText.trim()}
        >
          <Zap size={14} /> Parse SMS
        </Button>
      </div>

      {/* Demo SMS Cards */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
        📱 Demo SMS Messages — Click to Import
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
        {DEMO_SMS.map(sms => (
          <div
            key={sms.id}
            className="sms-card"
            onClick={() => handleParse(sms.text)}
            title="Click to parse and import"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <MessageSquare size={12} color="var(--color-primary)" />
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Bank SMS
                  </span>
                </div>
                {sms.text}
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--color-primary)', fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
              ↑ Click to auto-import →
            </div>
          </div>
        ))}
      </div>

      {/* Save Modal */}
      <Modal isOpen={saveOpen} onClose={() => setSaveOpen(false)} title="Confirm Imported Expense">
        {form && (
          <div>
            {parsed?.amount && (
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
                <CheckCircle size={18} color="var(--color-accent)" />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Successfully extracted: <strong style={{ color: 'var(--color-accent)' }}>{formatCurrency(parsed.amount)}</strong> from {parsed.merchant || 'Unknown'}
                </span>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div className="input-group" style={{ gridColumn: '1/-1' }}>
                <label className="input-label">Merchant</label>
                <input className="input" value={form.merchant || ''} onChange={e => setForm(p => ({ ...p, merchant: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label">Amount (₹)</label>
                <input className="input" type="number" value={form.amount || ''} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label">Date</label>
                <input className="input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label">Category</label>
                <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Payment</label>
                <input className="input" value={form.paymentMethod || 'UPI'} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setSaveOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>Save Expense</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
