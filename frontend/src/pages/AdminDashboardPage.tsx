import { useEffect, useState } from 'react'
import { fetchAdminDashboardStats, type AdminDashboardStats } from '../services/adminService'

const initialStats: AdminDashboardStats = {
  totalUsers: 0,
  totalProducts: 0,
  totalCategories: 0,
  pendingOrders: 0,
  totalRevenue: 0,
}

function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats>(initialStats)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetchAdminDashboardStats()
      .then((payload) => setStats(payload))
      .catch(() => setStats(initialStats))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Quản trị</p>
      <h1 className="page-title">Bảng điều khiển quản trị</h1>

      {isLoading ? <div className="state-card">Đang tải số liệu quản trị...</div> : null}

      <div className="placeholder-grid">
        <article className="placeholder-card">
          <h2>Tổng người dùng</h2>
          <p className="admin-kpi">{stats.totalUsers}</p>
        </article>
        <article className="placeholder-card">
          <h2>Tổng sản phẩm</h2>
          <p className="admin-kpi">{stats.totalProducts}</p>
        </article>
        <article className="placeholder-card">
          <h2>Tổng danh mục</h2>
          <p className="admin-kpi">{stats.totalCategories}</p>
        </article>
        <article className="placeholder-card">
          <h2>Đơn chờ xử lý</h2>
          <p className="admin-kpi">{stats.pendingOrders}</p>
        </article>
        <article className="placeholder-card">
          <h2>Tổng doanh thu</h2>
          <p className="admin-kpi">{stats.totalRevenue.toLocaleString('vi-VN')} VND</p>
        </article>
      </div>
    </section>
  )
}

export default AdminDashboardPage
