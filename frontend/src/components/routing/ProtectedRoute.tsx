import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

type ProtectedRouteProps = {
  allowAdmin?: boolean
  redirectAuthenticatedTo?: string
}

function ProtectedRoute({ allowAdmin = true, redirectAuthenticatedTo = '/access-denied' }: ProtectedRouteProps) {
  const { user, isAuthenticated, isAuthReady } = useAuth()
  const location = useLocation()

  if (!isAuthReady) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!allowAdmin && user?.role === 'admin') {
    return <Navigate to={redirectAuthenticatedTo} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
