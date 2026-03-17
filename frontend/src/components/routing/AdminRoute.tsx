import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function AdminRoute() {
  const { user, isAuthReady } = useAuth()

  if (!isAuthReady) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/access-denied" replace />
  }

  return <Outlet />
}

export default AdminRoute
