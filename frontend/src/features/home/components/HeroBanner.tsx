import { Link } from 'react-router-dom'

const trustBadges = ['Chính hãng 100%', 'Đổi trả 30 ngày', 'Hỗ trợ 7 ngày/tuần']
const heroStats = [
  { value: '50+', label: 'Mẫu gia dụng' },
  { value: '10K+', label: 'Lượt quan tâm' },
  { value: '4.9/5', label: 'Đánh giá demo' },
]

function HeroBanner() {
  return (
    <section className="home-hero nebula-home-hero reveal-up">
      <div className="home-hero-content nebula-hero-copy">
        <h1>
          Đồ gia dụng hiện đại,
          <span> trải nghiệm mua sắm sáng rõ hơn</span>
        </h1>
        <ul className="hero-badge-list" aria-label="Cam kết nổi bật">
          {trustBadges.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="home-hero-actions nebula-hero-actions">
          <Link to="/products" className="primary-btn">
            Khám phá sản phẩm
          </Link>
          <Link to="/register" className="ghost-btn">
            Tạo tài khoản mới
          </Link>
        </div>

        <div className="nebula-hero-stats">
          {heroStats.map((item) => (
            <div key={item.label} className="nebula-stat-card">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="nebula-hero-visual" aria-hidden="true">
        <div className="nebula-device-frame">
          <div className="nebula-device-top">
            <div className="nebula-device-chip" />
            <p>Xem trước</p>
            <h3>Homelyy</h3>
          </div>
          <div className="nebula-device-grid">
            <div className="nebula-device-panel is-tall" />
            <div className="nebula-device-panel" />
            <div className="nebula-device-panel" />
            <div className="nebula-device-panel is-wide" />
          </div>
        </div>

        <div className="nebula-floating-card is-secure">
          <span className="nebula-floating-dot" />
          <strong>Thanh toán an toàn</strong>
          <small>Luồng đặt hàng và đăng nhập sẵn sàng</small>
        </div>

        <div className="nebula-floating-card is-rating">
          <strong>4.9 / 5.0</strong>
          <small>Giao diện chỉn chu cho phần đánh giá dự án</small>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
