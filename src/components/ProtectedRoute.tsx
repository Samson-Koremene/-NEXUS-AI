import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Wait for the initial Supabase session to resolve before deciding.
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-7 h-7 border-2 border-white/10 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    // Remember where they were heading so login can send them back.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}
