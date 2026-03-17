import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">404</p>
      <h1 className="page-title">Không tìm thấy trang</h1>
      <p className="page-copy">
        Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển.
      </p>
      <Link to="/" className="primary-btn">
        Về trang chủ
      </Link>
    </section>
  )
}

export default NotFoundPage
