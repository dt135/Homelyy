import type { ReactNode } from 'react'
import AuthProvider from '../contexts/AuthContext'
import CartProvider from '../contexts/CartContext'
import ThemeProvider from '../contexts/ThemeContext'

type AppProvidersProps = {
  children: ReactNode
}

function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default AppProviders
