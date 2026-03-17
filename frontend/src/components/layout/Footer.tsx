import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function Footer() {
  const { isAuthenticated, user } = useAuth()

  return (
    <footer className="site-footer nebula-footer-shell">
      <div className="container nebula-footer-grid">
        <section className="nebula-footer-brand">
          <div className="nebula-brand nebula-footer-brandmark">
            <span className="nebula-brand-mark" aria-hidden="true">
              <span className="nebula-brand-dot" />
            </span>
            <span className="nebula-brand-copy">
              <strong>Homelyy</strong>
              <small>Modern home commerce</small>
            </span>
          </div>
        </section>

        <section>
          <h3>Khám phá</h3>
          <ul className="nebula-footer-links">
            <li><Link to="/products">Danh mục sản phẩm</Link></li>
            {!isAuthenticated ? <li><Link to="/login">Đăng nhập</Link></li> : null}
            {!isAuthenticated ? <li><Link to="/register">Tạo tài khoản</Link></li> : null}
            {isAuthenticated ? <li><Link to="/profile">Tài khoản của tôi</Link></li> : null}
          </ul>
        </section>

        <section>
          <h3>Hệ thống</h3>
          <ul className="nebula-footer-links">
            {isAuthenticated ? <li><Link to="/profile">Hồ sơ người dùng</Link></li> : null}
            {isAuthenticated ? <li><Link to="/orders">Lịch sử đơn hàng</Link></li> : null}
            {user?.role === 'admin' ? <li><Link to="/admin">Khu vực quản trị</Link></li> : null}
            {!isAuthenticated ? <li><Link to="/login">Đăng nhập để tiếp tục</Link></li> : null}
          </ul>
        </section>

        <section>
          <h3>Liên hệ</h3>
          <ul className="nebula-footer-meta">
            <li>TP. Hồ Chí Minh, Việt Nam</li>
            <li>support@homelyy.local</li>
            <li>1900 1234</li>
          </ul>
        </section>
      </div>
      <div className="container nebula-footer-bottom">
        <p>{new Date().getFullYear()} Homelyy. Developed by Dang Doanh Toai</p>
      </div>
    </footer>
  )
}

export default Footer
