/**
 * AI Service — Gemini API integration for intelligent expense categorization and insights.
 * Falls back gracefully to rule-based logic when no API key is configured.
 */

let genAI = null;
let model = null;

// Initialize Gemini client if API key is available
const init = () => {
  if (model) return true;
  const key = process.env.GEMINI_API_KEY;
  if (!key) return false;

  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    genAI = new GoogleGenerativeAI(key);
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    console.log('✅ Gemini AI initialized');
    return true;
  } catch (err) {
    console.warn('⚠️  Gemini AI initialization failed:', err.message);
    return false;
  }
};

/**
 * Use Gemini to categorize a merchant/description into one of our expense categories.
 * @param {string} text — merchant name or expense description
 * @returns {string} category id
 */
exports.aiCategorize = async (text) => {
  if (!init()) return null;

  try {
    const prompt = `Categorize the following merchant/expense into EXACTLY one of these categories: food, shopping, transport, bills, entertainment, healthcare, travel, education, other.

Merchant/Expense: "${text}"

Reply with ONLY the category name, nothing else.`;

    const result = await model.generateContent(prompt);
    const category = result.response.text().trim().toLowerCase();

    const valid = ['food', 'shopping', 'transport', 'bills', 'entertainment', 'healthcare', 'travel', 'education', 'other'];
    return valid.includes(category) ? category : null;
  } catch (err) {
    console.warn('AI categorize error:', err.message);
    return null;
  }
};

/**
 * Use Gemini to generate spending insights from expense summary data.
 * @param {object} summary — spending summary object
 * @returns {string|null} AI-generated insight text
 */
exports.aiInsight = async (summary) => {
  if (!init()) return null;

  try {
    const prompt = `You are a smart personal finance advisor. Based on this spending summary, generate 2-3 concise, actionable insights:

Monthly spending: ₹${summary.totalSpent}
Previous month: ₹${summary.prevMonthSpent}
Change: ${summary.changePercent}%
Top categories: ${JSON.stringify(summary.categories)}

Keep each insight under 2 sentences. Be specific and helpful. Use ₹ for currency.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.warn('AI insight error:', err.message);
    return null;
  }
};

/**
 * Use Gemini to extract structured data from OCR receipt text.
 * @param {string} ocrText — raw text from OCR
 * @returns {object|null} { merchant, amount, date, items }
 */
exports.aiParseReceipt = async (ocrText) => {
  if (!init()) return null;

  try {
    const prompt = `Extract the following from this receipt text and return as JSON:
- merchant (store/restaurant name)
- amount (total amount as number)
- date (in YYYY-MM-DD format, or null if not found)
- items (array of item descriptions)

Receipt text:
"""
${ocrText}
"""

Return ONLY valid JSON, no markdown or explanation.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/```json\n?/g, '').replace(/```/g, '');
    return JSON.parse(text);
  } catch (err) {
    console.warn('AI receipt parse error:', err.message);
    return null;
  }
};
