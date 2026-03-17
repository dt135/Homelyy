import { Link, useSearchParams } from 'react-router-dom'

function OrderSuccessPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId') ?? 'N/A'

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Thanh toán thành công</p>
      <h1 className="page-title">Đặt hàng thành công</h1>

      <article className="placeholder-card">
        <p>Cảm ơn bạn đã đặt hàng tại Homelyy.</p>
        <p>
          Mã đơn hàng: <strong>{orderId}</strong>
        </p>
        <div className="button-row">
          <Link to="/orders" className="primary-btn">
            Xem lịch sử đơn hàng
          </Link>
          <Link to="/products" className="ghost-btn">
            Tiếp tục mua sắm
          </Link>
        </div>
      </article>
    </section>
  )
}

export default OrderSuccessPage
