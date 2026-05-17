// SMS Parser utility — extracts expense info from bank SMS messages

import { categorizeByMerchant } from './mockData'
import { format } from 'date-fns'

const AMOUNT_PATTERNS = [
  /(?:rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)/i,
  /([\d,]+(?:\.\d{1,2})?)\s*(?:rs\.?|inr)/i,
]

const MERCHANT_PATTERNS = [
  /(?:on|at|to)\s+([A-Za-z][A-Za-z0-9\s\.\-&']+?)(?:\s+(?:using|via|from|\.)|$)/i,
  /paid\s+to\s+([A-Za-z][A-Za-z0-9\s\.]+?)(?:\s+via|$)/i,
]

const DATE_PATTERNS = [
  /(\d{1,2}[-\/]\w{3}[-\/]\d{2,4})/i,
  /(\d{2}-\w{3}-\d{2,4})/i,
]

export const parseSMS = (smsText) => {
  const result = {
    amount: null,
    merchant: null,
    category: 'other',
    date: format(new Date(), 'yyyy-MM-dd'),
    paymentMethod: 'UPI',
    raw: smsText,
  }

  // Extract amount
  for (const pattern of AMOUNT_PATTERNS) {
    const match = smsText.match(pattern)
    if (match) {
      result.amount = parseFloat(match[1].replace(/,/g, ''))
      break
    }
  }

  // Extract merchant
  for (const pattern of MERCHANT_PATTERNS) {
    const match = smsText.match(pattern)
    if (match) {
      result.merchant = match[1].trim()
      break
    }
  }

  // Extract date
  for (const pattern of DATE_PATTERNS) {
    const match = smsText.match(pattern)
    if (match) {
      try {
        const d = new Date(match[1].replace(/-/g, ' '))
        if (!isNaN(d)) result.date = format(d, 'yyyy-MM-dd')
      } catch {}
      break
    }
  }

  // Detect payment method
  const lowerText = smsText.toLowerCase()
  if (lowerText.includes('credit card')) result.paymentMethod = 'Credit Card'
  else if (lowerText.includes('debit card')) result.paymentMethod = 'Debit Card'
  else if (lowerText.includes('upi') || lowerText.includes('gpay') || lowerText.includes('bhim')) result.paymentMethod = 'UPI'
  else if (lowerText.includes('net banking')) result.paymentMethod = 'Net Banking'

  // Categorize
  if (result.merchant) {
    result.category = categorizeByMerchant(result.merchant)
  }

  return result
}
