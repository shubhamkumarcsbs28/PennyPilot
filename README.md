# PennyPilot — AI-Powered Expense Tracker

PennyPilot is a premium, AI-powered personal finance dashboard built with React, Node.js, and MongoDB. It features intelligent categorization, OCR receipt scanning, and AI-generated spending insights.

## 🚀 Features

- **Fintech Dashboard**: Interactive charts (Recharts) for spending breakdown, trends, and forecasts.
- **AI Insights**: Automatically generates actionable financial tips based on your spending patterns.
- **OCR Scanner**: Upload or drag-and-drop receipts to auto-extract amount, merchant, and date.
- **SMS Parsing**: Extract expense data from bank SMS messages with a regex-based parser.
- **Budget Manager**: Set monthly limits per category and track utilization with visual progress bars.
- **Full CRUD**: Manage expenses with advanced filtering, sorting, and search.
- **Dark/Light Mode**: Premium glassmorphism UI with theme persistence.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth.
- **AI/OCR**: Tesseract.js (OCR), Google Gemini API (Insights).

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/pennypilot.git
cd pennypilot
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/pennypilot
JWT_SECRET=your_secret_key
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
```
> Note: The backend now uses a persistent MongoDB database, so registered users and expenses are stored across restarts.

Seed the database (optional):
```bash
npm run seed
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Start the frontend:
```bash
npm run dev
```

## 🧪 Demo Credentials
If you run `npm run seed` after setup, the seed script will create a demo account:
- **Email**: `aarav@example.com`
- **Password**: `password123`

If you do not seed the database, please use the app's Sign Up page to create a new account.

---
Built with ❤️ by Antigravity AI
