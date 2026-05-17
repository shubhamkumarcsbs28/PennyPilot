import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken]     = useState(null)

  // Restore session
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('pp-token')
      if (savedToken) {
        try {
          setToken(savedToken)
          const res = await api.get('/auth/me')
          setUser(res.data)
        } catch (err) {
          console.error('Auth restore failed:', err)
          localStorage.removeItem('pp-token')
          localStorage.removeItem('pp-user')
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { token: newToken, ...userData } = res.data
    
    setUser(userData)
    setToken(newToken)
    localStorage.setItem('pp-token', newToken)
    localStorage.setItem('pp-user', JSON.stringify(userData))
    return userData
  }

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    const { token: newToken, ...userData } = res.data
    
    setUser(userData)
    setToken(newToken)
    localStorage.setItem('pp-token', newToken)
    localStorage.setItem('pp-user', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('pp-user')
    localStorage.removeItem('pp-token')
  }

  const updateUser = async (data) => {
    const res = await api.put('/auth/me', data)
    setUser(res.data)
    localStorage.setItem('pp-user', JSON.stringify(res.data))
    return res.data
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
