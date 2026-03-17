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

  const statCards = [
    {
      title: 'Tổng người dùng',
      value: stats.totalUsers,
      toneClassName: 'admin-kpi-card tone-blue',
    },
    {
      title: 'Tổng sản phẩm',
      value: stats.totalProducts,
      toneClassName: 'admin-kpi-card tone-violet',
    },
    {
      title: 'Tổng danh mục',
      value: stats.totalCategories,
      toneClassName: 'admin-kpi-card tone-amber',
    },
    {
      title: 'Đơn chờ xử lý',
      value: stats.pendingOrders,
      toneClassName: 'admin-kpi-card tone-emerald',
    },
    {
      title: 'Tổng doanh thu',
      value: `${stats.totalRevenue.toLocaleString('vi-VN')} VND`,
      toneClassName: 'admin-kpi-card tone-slate',
    },
  ]

  useEffect(() => {
    setIsLoading(true)
    fetchAdminDashboardStats()
      .then((payload) => setStats(payload))
      .catch(() => setStats(initialStats))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <section className="page-stack reveal-up">
      <div className="admin-section-head">
        <p className="eyebrow">Quản trị</p>
        <h1 className="page-title">Bảng điều khiển quản trị</h1>
      </div>

      {isLoading ? <div className="state-card">Đang tải dữ liệu quản trị...</div> : null}

      <div className="placeholder-grid admin-kpi-grid">
        {statCards.map((item) => (
          <article key={item.title} className={item.toneClassName}>
            <h2>{item.title}</h2>
            <p className="admin-kpi">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AdminDashboardPage
