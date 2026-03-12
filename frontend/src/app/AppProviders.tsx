import type { ReactNode } from 'react'
import AuthProvider from '../contexts/AuthContext'
import CartProvider from '../contexts/CartContext'

type AppProvidersProps = {
  children: ReactNode
}

function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  )
}

export default AppProviders
