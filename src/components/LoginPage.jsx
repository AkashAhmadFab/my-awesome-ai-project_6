import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'
import Toast from './Toast'

/**
 * Modern login page component with authentication and form validation
 * Features: Real-time validation, loading states, error handling, remember me functionality
 */
const LoginPage = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState({ show: false, message: '', type: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  /**
   * Real-time email validation
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Handle input changes with real-time validation
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const inputValue = type === 'checkbox' ? checked : value

    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }))

    // Real-time validation
    if (name === 'email' && value) {
      if (!validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
      } else {
        setErrors(prev => ({ ...prev, email: '' }))
      }
    }

    if (name === 'password' && value) {
      if (value.length < 6) {
        setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }))
      } else {
        setErrors(prev => ({ ...prev, password: '' }))
      }
    }
  }

  /**
   * Handle form submission with validation and authentication
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Validate form
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false)
      setToast({
        show: true,
        message: 'Please fix the errors above',
        type: 'error'
      })
      return
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const success = await login(formData.email, formData.password, formData.rememberMe)
      
      if (success) {
        setToast({
          show: true,
          message: 'Login successful! Redirecting...',
          type: 'success'
        })
        
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      } else {
        setToast({
          show: true,
          message: 'Login failed. Please check your credentials.',
          type: 'error'
        })
      }
    } catch (error) {
      setToast({
        show: true,
        message: 'An error occurred. Please try again.',
        type: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  /**
   * Close toast notification
   */
  const closeToast = () => {
    setToast({ show: false, message: '', type: '' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center animate-slide-in">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 animate-pulse-hover">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Sign in to access your secure dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus-ring input-glow transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-300 bg-red-50' 
                      : formData.email && !errors.email
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                  } hover:border-blue-400 focus:bg-white`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {formData.email && !errors.email && (
                  <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                )}
                {errors.email && (
                  <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-red-500" />
                )}
              </div>
              {errors.email && (
                <p className="text-red-600 text-xs flex items-center gap-1 animate-slide-in">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus-ring input-glow transition-all duration-200 ${
                    errors.password 
                      ? 'border-red-300 bg-red-50' 
                      : formData.password && !errors.password
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                  } hover:border-blue-400 focus:bg-white`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
</div>
              {errors.password && (
                <p className="text-red-600 text-xs flex items-center gap-1 animate-slide-in">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="custom-checkbox"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || Object.values(errors).some(error => error)}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="small" color="white" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-blue-700">Email: any valid email format</p>
            <p className="text-xs text-blue-700">Password: any password (6+ characters)</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage