import { Link } from 'react-router-dom'

const voiceCommands = [
  'vào trang chủ',
  'mở trang sản phẩm',
  'tìm nồi chiên không dầu',
  'mở giỏ hàng',
]

const trustBadges = ['Chính hãng 100%', 'Đổi trả 30 ngày', 'Hỗ trợ 7 ngày/tuần']

function HeroBanner() {
  return (
    <section className="home-hero reveal-up">
      <div className="home-hero-content">
        <p className="eyebrow">Homelyy Voice Commerce</p>
        <h1>Đồ gia dụng hiện đại, tìm nhanh hơn với Voice Control</h1>
        <p>
          Không cần click qua nhiều bước. Bạn có thể điều hướng và tìm sản phẩm
          bằng lệnh giọng nói đơn giản trong toàn bộ website.
        </p>

        <ul className="hero-badge-list" aria-label="Cam kết nổi bật">
          {trustBadges.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="home-hero-actions">
          <Link to="/products" className="primary-btn">
            Mua ngay
          </Link>
          <Link to="/register" className="ghost-btn">
            Tạo tài khoản
          </Link>
        </div>
      </div>

      <aside className="voice-preview" aria-label="Gợi ý lệnh giọng nói">
        <p className="voice-preview-label">Lệnh giọng nói sẵn sàng</p>
        <ul>
          {voiceCommands.map((command) => (
            <li key={command}>
              <span className="dot" />
              {command}
            </li>
          ))}
        </ul>
      </aside>
    </section>
  )
}

export default HeroBanner
