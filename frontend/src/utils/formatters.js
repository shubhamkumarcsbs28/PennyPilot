// Formatting helpers

export const formatCurrency = (amount, currency = '₹') => {
  if (isNaN(amount)) return `${currency}0`
  return `${currency}${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}

export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    }).format(new Date(dateStr))
  } catch { return dateStr }
}

export const formatRelativeDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - date) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff}d ago`
  return formatDate(dateStr)
}

export const formatPercent = (value) => {
  const n = Number(value)
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(1)}%`
}

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

export const generateId = () =>
  `id_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
