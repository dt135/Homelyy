import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

const navItems = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/products', label: 'Sản phẩm' },
]

function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()

  return (
    <header className="site-header">
      <div className="container header-row">
        <NavLink to="/" className="brand">
          Homelyy
        </NavLink>

        <nav aria-label="Điều hướng chính">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    isActive ? 'nav-link is-active' : 'nav-link'
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <NavLink to="/cart" className="ghost-btn">
            Giỏ hàng ({totalItems})
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className="ghost-btn">
                {user?.fullName.split(' ')[0]}
              </NavLink>
              {user?.role === 'admin' ? (
                <NavLink to="/admin" className="ghost-btn">
                  Admin
                </NavLink>
              ) : null}
              <button type="button" className="ghost-btn" onClick={logout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <NavLink to="/login" className="ghost-btn">
              Đăng nhập
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
