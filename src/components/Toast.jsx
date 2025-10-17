import React, { useEffect } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

/**
 * Toast notification component for success/error messages
 * @param {string} message - The message to display
 * @param {string} type - Type: 'success', 'error', 'warning'
 * @param {function} onClose - Function to call when toast is closed
 * @param {number} duration - Auto-close duration in milliseconds (default: 5000)
 */
const Toast = ({ message, type = 'success', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        }
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: AlertCircle,
          iconColor: 'text-red-600'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: AlertCircle,
          iconColor: 'text-yellow-600'
        }
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: CheckCircle,
          iconColor: 'text-blue-600'
        }
    }
  }

  const styles = getToastStyles()
  const Icon = styles.icon

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`max-w-sm w-full ${styles.bg} border rounded-lg shadow-lg p-4`}>
        <div className="flex items-start gap-3">
          <Icon className={`h-5 w-5 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${styles.text} leading-relaxed`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`${styles.text} hover:opacity-70 transition-opacity flex-shrink-0`}
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toast