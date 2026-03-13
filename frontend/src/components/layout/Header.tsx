import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { useTheme } from '../../hooks/useTheme'

const navItems = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/products', label: 'Sản phẩm' },
]

function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

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
          <button
            type="button"
            className="ghost-btn theme-toggle"
            onClick={toggleTheme}
            aria-label={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          >
            <span className="theme-toggle-icon" aria-hidden="true">
              {isDark ? (
                <svg viewBox="0 0 24 24" role="presentation">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" role="presentation">
                  <path d="M21 13.1A8.9 8.9 0 1 1 10.9 3 7 7 0 0 0 21 13.1z" />
                </svg>
              )}
            </span>
          </button>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? 'ghost-btn cart-link is-active' : 'ghost-btn cart-link'
            }
            aria-label={`Giỏ hàng (${totalItems} sản phẩm)`}
            title="Giỏ hàng"
          >
            <span className="cart-link-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="17" cy="20" r="1.4" />
                <path d="M3 4h2l2.2 10.2h10.4L20 8H7.4" />
              </svg>
            </span>
            {totalItems > 0 ? (
              <span className="cart-link-count">{totalItems > 99 ? '99+' : totalItems}</span>
            ) : null}
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? 'ghost-btn profile-link is-active' : 'ghost-btn profile-link'
                }
                aria-label="Trang hồ sơ"
                title="Trang hồ sơ"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="header-avatar" />
                ) : (
                  <span className="header-avatar-fallback" aria-hidden="true">
                    {user?.fullName?.slice(0, 1).toUpperCase() || 'U'}
                  </span>
                )}
              </NavLink>
              {user?.role === 'admin' ? (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive ? 'ghost-btn admin-link is-active' : 'ghost-btn admin-link'
                  }
                  aria-label="Bảng điều khiển quản trị"
                  title="Bảng điều khiển quản trị"
                >
                  <span className="admin-link-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" role="presentation">
                      <rect x="3" y="3" width="8" height="8" rx="1.8" />
                      <rect x="13" y="3" width="8" height="5" rx="1.8" />
                      <rect x="13" y="10" width="8" height="11" rx="1.8" />
                      <rect x="3" y="13" width="8" height="8" rx="1.8" />
                    </svg>
                  </span>
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
