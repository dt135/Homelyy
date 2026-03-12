import { Link } from 'react-router-dom'

function AccessDeniedPage() {
  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">403</p>
      <h1 className="page-title">Bạn không có quyền truy cập</h1>
      <p className="page-copy">Trang này dành cho tài khoản admin.</p>
      <Link to="/" className="primary-btn">
        Quay lại trang chủ
      </Link>
    </section>
  )
}

export default AccessDeniedPage
