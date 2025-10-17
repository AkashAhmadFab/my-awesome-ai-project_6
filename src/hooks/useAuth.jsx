import React, { createContext, useContext, useState, useEffect } from 'react'

/**
 * Authentication context and provider
 * Handles user authentication state, login, logout, and session management
 */

const AuthContext = createContext()

/**
 * Custom hook to use authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Authentication provider component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Initialize auth state from localStorage on app start
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('user')
        const storedAuth = localStorage.getItem('isAuthenticated')
        
        if (storedUser && storedAuth === 'true') {
          setUser(JSON.parse(storedUser))
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        // Clear potentially corrupted data
        localStorage.removeItem('user')
        localStorage.removeItem('isAuthenticated')
      } finally {
        setIsLoading(false)
      }
    }

    // Add small delay to simulate loading
    setTimeout(initializeAuth, 500)
  }, [])

  /**
   * Login function - accepts any valid email format and password 6+ chars
   * @param {string} email - User email address
   * @param {string} password - User password
   * @param {boolean} rememberMe - Whether to remember user session
   * @returns {boolean} - Success status
   */
  const login = async (email, password, rememberMe = false) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Basic validation (for demo purposes)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format')
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }
      
      // Create user object
      const userData = {
        email,
        rememberMe,
        loginTime: new Date().toISOString(),
        id: Date.now().toString() // Simple ID generation
      }
      
      // Update state
      setUser(userData)
      setIsAuthenticated(true)
      
      // Persist to localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('isAuthenticated', 'true')
      } else {
        // Use sessionStorage for temporary sessions
        sessionStorage.setItem('user', JSON.stringify(userData))
        sessionStorage.setItem('isAuthenticated', 'true')
      }
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  /**
   * Logout function - clears user data and redirects
   */
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    
    // Clear all stored data
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('isAuthenticated')
  }

  /**
   * Update user data
   */
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    
    // Update stored data if exists
    if (localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
    if (sessionStorage.getItem('user')) {
      sessionStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  /**
   * Check if user session is valid
   */
  const validateSession = () => {
    if (user && user.loginTime) {
      const loginTime = new Date(user.loginTime)
      const now = new Date()
      const timeDifference = now - loginTime
      const maxSessionTime = 24 * 60 * 60 * 1000 // 24 hours
      
      if (timeDifference > maxSessionTime) {
        logout()
        return false
      }
    }
    return true
  }

  // Validate session periodically
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(validateSession, 60000) // Check every minute
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, user])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    validateSession
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}