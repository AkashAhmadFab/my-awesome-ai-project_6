import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Send } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'
import Toast from './Toast'

/**
 * Forgot password page component with email validation and reset functionality
 * Features: Email validation, loading states, success/error handling
 */
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState({ show: false, message: '', type: '' })

  /**
   * Email validation function
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Handle email input change with real-time validation
   */
  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    
    if (value && !validateEmail(value)) {
      setError('Please enter a valid email address')
    } else {
      setError('')
    }
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('Email is required')
      return
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    
    setIsSubmitting(true)
    setError('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSuccess(true)
      setToast({
        show: true,
        message: 'Password reset instructions sent to your email!',
        type: 'success'
      })
    } catch (error) {
      setError('Failed to send reset email. Please try again.')
      setToast({
        show: true,
        message: 'Failed to send reset email. Please try again.',
        type: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Close toast notification
   */
  const closeToast = () => {
    setToast({ show: false, message: '', type: '' })
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
        {/* Back to Login Link */}
        <div className="animate-slide-in">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>

        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="text-center animate-slide-in">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 animate-pulse-hover">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-2">
                Forgot Password?
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            {/* Reset Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                        error 
                          ? 'border-red-300 bg-red-50' 
                          : email && !error
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300 bg-gray-50'
                      } hover:border-blue-400 focus:bg-white`}
                      placeholder="Enter your email address"
                      value={email}
                      onChange={handleEmailChange}
                    />
                    {email && !error && (
                      <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                    )}
                    {error && (
                      <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {error && (
                    <p className="text-red-600 text-xs flex items-center gap-1 animate-slide-in">
                      <AlertCircle className="h-3 w-3" />
                      {error}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || error || !email}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="small" color="white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Reset Instructions
                    </>
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="text-center animate-fade-in">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 space-y-4">
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false)
                  setEmail('')
                }}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage