import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Contexts
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider }   from './context/AuthContext'
import { ExpenseProvider } from './context/ExpenseContext'

// Layout
import { Sidebar } from './components/layout/Sidebar'
import { TopBar }  from './components/layout/TopBar'

// Auth
import { ProtectedRoute }  from './components/auth/ProtectedRoute'
import { LoginPage }       from './components/auth/LoginPage'
import { SignupPage }      from './components/auth/SignupPage'

// Pages
import { DashboardPage } from './pages/DashboardPage'
import { ExpensesPage }  from './pages/ExpensesPage'
import { ScannerPage }   from './pages/ScannerPage'
import { InsightsPage }  from './pages/InsightsPage'
import { PredictPage }   from './pages/PredictPage'
import { SMSPage }       from './pages/SMSPage'
import { BudgetPage }    from './pages/BudgetPage'
import { ProfilePage }   from './pages/ProfilePage'
import { SettingsPage }  from './pages/SettingsPage'

// ── Authenticated Shell ─────────────────────────────────────
const AppShell = () => {
  const [collapsed,   setCollapsed]   = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(p => !p)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        <TopBar onMenuClick={() => setMobileOpen(p => !p)} />

        <Routes>
          <Route path="/"         element={<DashboardPage />} />
          <Route path="/expenses" element={<ExpensesPage />}  />
          <Route path="/scanner"  element={<ScannerPage />}   />
          <Route path="/insights" element={<InsightsPage />}  />
          <Route path="/predict"  element={<PredictPage />}   />
          <Route path="/sms"      element={<SMSPage />}       />
          <Route path="/budget"   element={<BudgetPage />}    />
          <Route path="/profile"  element={<ProfilePage />}   />
          <Route path="/settings" element={<SettingsPage />}  />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

// ── Root App ────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ExpenseProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                },
                success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />

            <Routes>
              {/* Public */}
              <Route path="/login"    element={<LoginPage />}  />
              <Route path="/register" element={<SignupPage />} />

              {/* Protected */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </ExpenseProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
