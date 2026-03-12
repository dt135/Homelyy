import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllOrders } from '../services/orderService'
import { mockProducts } from '../services/mock/data/products'
import type { Order } from '../types/order'

function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetchAllOrders()
      .then((payload) => setOrders(payload))
      .catch(() => setOrders([]))
  }, [])

  const pendingOrders = orders.filter((order) => order.status === 'pending').length
  const totalRevenue = orders.reduce((total, order) => total + order.totalAmount, 0)

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Quản trị</p>
      <h1 className="page-title">Bảng điều khiển quản trị</h1>

      <div className="placeholder-grid">
        <article className="placeholder-card">
          <h2>Tổng sản phẩm</h2>
          <p className="admin-kpi">{mockProducts.length}</p>
        </article>
        <article className="placeholder-card">
          <h2>Đơn chờ xử lý</h2>
          <p className="admin-kpi">{pendingOrders}</p>
        </article>
        <article className="placeholder-card">
          <h2>Doanh thu mock</h2>
          <p className="admin-kpi">{totalRevenue.toLocaleString('vi-VN')} VND</p>
        </article>
      </div>

      <div className="button-row">
        <Link to="/admin/products" className="primary-btn">
          Quản lý sản phẩm
        </Link>
        <Link to="/admin/orders" className="ghost-btn">
          Quản lý đơn hàng
        </Link>
      </div>
    </section>
  )
}

export default AdminDashboardPage
