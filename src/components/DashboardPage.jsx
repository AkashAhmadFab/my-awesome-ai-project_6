import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, Shield, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

/**
 * Dashboard page component - shown after successful login
 * Features: User info display, logout functionality, welcome message
 */
const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  /**
   * Handle logout with confirmation
   */
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      navigate('/login')
    }
  }

  const stats = [
    { label: 'Login Status', value: 'Active', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Session Time', value: '5 min', icon: Clock, color: 'text-blue-600' },
    { label: 'Security Level', value: 'High', icon: Shield, color: 'text-purple-600' },
    { label: 'Activity', value: 'Online', icon: TrendingUp, color: 'text-orange-600' }
  ]

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium text-gray-900">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Welcome to your Dashboard!
              </h2>
              <p className="text-gray-600">
                You have successfully logged in. Your session is secure and active.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-xl shadow-sm border p-6 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    <p className={`text-lg font-bold ${stat.color} mt-1`}>{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* User Information */}
        <div className="bg-white rounded-xl shadow-sm border p-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-gray-600 font-medium">Email Address</span>
              <span className="text-gray-900">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-gray-600 font-medium">Login Method</span>
              <span className="text-gray-900">Email & Password</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-gray-600 font-medium">Account Status</span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600 font-medium">Remember Me</span>
              <span className="text-gray-900">{user?.rememberMe ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <User className="h-4 w-4" />
            Edit Profile
          </button>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            <Shield className="h-4 w-4" />
            Security Settings
          </button>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage