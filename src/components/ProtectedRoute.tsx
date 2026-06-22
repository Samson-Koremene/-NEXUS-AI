import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#070809]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-sm text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
