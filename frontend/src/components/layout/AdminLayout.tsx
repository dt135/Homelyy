import { NavLink, Outlet } from 'react-router-dom'

const adminNavigation = [
  { to: '/admin/products', label: 'Quản lý sản phẩm' },
  { to: '/admin/categories', label: 'Quản lý danh mục' },
  { to: '/admin/orders', label: 'Quản lý đơn hàng' },
  { to: '/admin/users', label: 'Quản lý người dùng' },
]

function AdminLayout() {
  return (
    <section className="admin-shell">
      <aside className="admin-sidebar nebula-admin-sidebar">
        <p className="eyebrow">Quản trị</p>
        <h2 className="admin-sidebar-title">Bảng điều khiển</h2>
        <p className="admin-sidebar-copy">
          Khu vực vận hành Homelyy với giao diện đồng bộ cùng storefront Nebula.
        </p>

        <nav className="admin-sidebar-nav" aria-label="Điều hướng quản trị">
          {adminNavigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'admin-sidebar-link is-active' : 'admin-sidebar-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="admin-content">
        <Outlet />
      </div>
    </section>
  )
}

export default AdminLayout
