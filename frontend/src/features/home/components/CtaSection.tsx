import { Link } from 'react-router-dom'

function CtaSection() {
  return (
    <section className="home-cta reveal-up">
      <div>
        <p className="eyebrow">Sẵn sàng thanh toán</p>
        <h2>Bắt đầu mua sắm cho căn nhà của bạn</h2>
        <p>
          Tiếp tục với Product Listing để trải nghiệm search, filter, sorting và
          luồng mua hàng đầy đủ trong phase tiếp theo.
        </p>
      </div>

      <div className="button-row">
        <Link to="/products" className="primary-btn">
          Khám phá sản phẩm
        </Link>
        <Link to="/cart" className="ghost-btn">
          Đi đến giỏ hàng
        </Link>
      </div>
    </section>
  )
}

export default CtaSection
