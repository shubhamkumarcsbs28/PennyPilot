import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createWorker } from 'tesseract.js'
import { useExpenses } from '../context/ExpenseContext'
import { categorizeByMerchant, categorizeByText, CATEGORIES } from '../utils/mockData'
import { Button } from '../components/ui/Button'
import { Upload, FileImage, CheckCircle, Loader, Zap } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const extractFromText = (text) => {
  const result = { merchant: '', amount: null, date: format(new Date(), 'yyyy-MM-dd'), items: [] }
  const amountPatterns = [
    new RegExp('(?:total(?: amount)?|amount payable|grand total|net payable|balance due|amt paid)[\\s:₹\\-–]*([0-9,]+(?:\\.[0-9]{1,2})?)', 'i'),
    new RegExp('(?:₹|rs\\.?|inr)\\s*([0-9,]+(?:\\.[0-9]{1,2})?)', 'i'),
  ]

  for (const pattern of amountPatterns) {
    const match = text.match(pattern)
    if (match) {
      result.amount = parseFloat(match[1].replace(/,/g, ''))
      break
    }
  }

  const dateMatch = text.match(new RegExp('(\\d{1,2}[\\/\\-\\.]\\d{1,2}[\\/\\-\\.]\\d{2,4})'))
  if (dateMatch) {
    try {
      const d = new Date(dateMatch[1].replace(/\./g, '/'))
      if (!isNaN(d)) result.date = format(d, 'yyyy-MM-dd')
    } catch {
      // ignore invalid parsed dates
    }
  }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const billLine = lines.find(line => /(?:\bbill\b|electricity|water|gas|insurance|recharge|utility|broadband|internet|subscription|mobile|dth|cable|dues)/i.test(line))
  result.merchant = (billLine || lines[0] || '').slice(0, 40)
  result.items = lines.filter(l => /\d/.test(l) && l.length > 3).slice(0, 8)
  return result
}

export const ScannerPage = () => {
  const { addExpense } = useExpenses()
  const [image, setImage]       = useState(null)
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult]     = useState(null)
  const [form, setForm]         = useState(null)

  const runOCR = useCallback(async (imgUrl) => {
    setScanning(true)
    setProgress(0)
    try {
      const worker = createWorker({
        logger: (m) => { if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100)) },
      })
      await worker.load()
      await worker.loadLanguage('eng')
      await worker.initialize('eng')
      const { data: { text } } = await worker.recognize(imgUrl)
      await worker.terminate()

      const extracted = extractFromText(text)
      const merchantCategory = categorizeByMerchant(extracted.merchant)
      const fallbackCategory = merchantCategory === 'other' ? categorizeByText(text) : merchantCategory

      setResult({ ...extracted, rawText: text })
      setForm({
        merchant: extracted.merchant,
        amount: extracted.amount || '',
        date: extracted.date,
        category: fallbackCategory,
        paymentMethod: 'UPI',
        notes: 'Imported via OCR',
      })
      toast.success('Receipt scanned successfully! ✅')
    } catch {
      toast.error('OCR failed. Please try a clearer image.')
    } finally {
      setScanning(false)
    }
  }, [])

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImage(url)
    setResult(null)
    setForm(null)
    runOCR(url)
  }, [runOCR])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1,
  })

  const handleSave = () => {
    if (!form?.amount) { toast.error('Amount is required'); return }
    addExpense({ ...form, amount: parseFloat(form.amount) })
    toast.success('Expense saved! 🎉')
    setImage(null); setResult(null); setForm(null)
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">OCR Receipt Scanner</h2>
          <p className="page-subtitle">Upload a receipt to auto-extract expense details</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: image ? '1fr 1fr' : '1fr', gap: 20, maxWidth: 960, margin: '0 auto' }}>
        {/* Drop Zone */}
        <div>
          <div className={`drop-zone ${isDragActive ? 'dragging' : ''}`} {...getRootProps()}>
            <input {...getInputProps()} />
            {scanning ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: 'pulse 1.5s infinite' }}>
                  <Loader size={24} color="var(--color-primary)" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Scanning Receipt…</p>
                <div className="progress-bar" style={{ maxWidth: 200, margin: '0 auto 8px' }}>
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{progress}% complete</p>
              </div>
            ) : image ? (
              <div style={{ textAlign: 'center' }}>
                <CheckCircle size={36} color="var(--color-accent)" style={{ marginBottom: 8 }} />
                <p style={{ fontSize: 14, color: 'var(--color-accent)', fontWeight: 600 }}>Scan complete!</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Drop another image to rescan</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <FileImage size={28} color="var(--color-primary)" />
                </div>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                  {isDragActive ? 'Drop your receipt here' : 'Drag & drop receipt here'}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>or click to browse — JPG, PNG, WEBP</p>
                <Button variant="primary" size="sm"><Upload size={14} /> Choose File</Button>
              </div>
            )}
          </div>

          {/* Preview */}
          {image && (
            <div className="card" style={{ padding: 12, marginTop: 16 }}>
              <img src={image} alt="receipt" style={{ width: '100%', maxHeight: 300, objectFit: 'contain', borderRadius: 8 }} />
            </div>
          )}
        </div>

        {/* Result */}
        {result && form && (
          <div className="card" style={{ padding: 24 }} >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={18} color="var(--color-accent)" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Extracted Data</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Review and save</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="input-group">
                <label className="input-label">Merchant</label>
                <input className="input" value={form.merchant} onChange={e => setForm(p => ({ ...p, merchant: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label className="input-label">Amount (₹)</label>
                  <input className="input" type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label className="input-label">Date</label>
                  <input className="input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Category</label>
                <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                </select>
              </div>

              {result.items.length > 0 && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>DETECTED ITEMS</p>
                  <div style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    {result.items.map((item, i) => <div key={i}>{item}</div>)}
                  </div>
                </div>
              )}

              <Button variant="primary" onClick={handleSave} style={{ width: '100%', marginTop: 8 }}>
                <CheckCircle size={16} /> Save Expense
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div style={{ maxWidth: 960, margin: '24px auto 0' }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>💡 Tips for better OCR results</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10 }}>
            {[
              ['📸', 'Take a clear, well-lit photo'],
              ['📄', 'Make sure the full receipt is in frame'],
              ['🔲', 'Avoid shadows and reflections'],
              ['📱', 'Hold camera steady for sharp text'],
            ].map(([icon, tip]) => (
              <div key={tip} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
                <span>{icon}</span> {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
