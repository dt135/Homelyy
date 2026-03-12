import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import AdminRoute from '../components/routing/AdminRoute'
import ProtectedRoute from '../components/routing/ProtectedRoute'
import AccessDeniedPage from '../pages/AccessDeniedPage'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import CartPage from '../pages/CartPage'
import CheckoutPage from '../pages/CheckoutPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import OrderHistoryPage from '../pages/OrderHistoryPage'
import OrderManagementPage from '../pages/OrderManagementPage'
import OrderSuccessPage from '../pages/OrderSuccessPage'
import ProductManagementPage from '../pages/ProductManagementPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import ProductListPage from '../pages/ProductListPage'
import ProfilePage from '../pages/ProfilePage'
import RegisterPage from '../pages/RegisterPage'

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'products',
        element: <ProductListPage />,
      },
      {
        path: 'products/:productId',
        element: <ProductDetailPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'profile',
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <ProfilePage />,
          },
        ],
      },
      {
        path: 'orders',
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <OrderHistoryPage />,
          },
        ],
      },
      {
        path: 'checkout',
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <CheckoutPage />,
          },
          {
            path: 'success',
            element: <OrderSuccessPage />,
          },
        ],
      },
      {
        path: 'admin',
        element: <AdminRoute />,
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          {
            path: 'products',
            element: <ProductManagementPage />,
          },
          {
            path: 'orders',
            element: <OrderManagementPage />,
          },
        ],
      },
      {
        path: 'access-denied',
        element: <AccessDeniedPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
