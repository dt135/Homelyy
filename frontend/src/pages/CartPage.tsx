import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { isLikelyImageUrl } from '../utils/images'
import { vndFormatter } from '../utils/formatters'

function CartPage() {
  const { lineItems, subtotal, increaseQty, decreaseQty, removeFromCart } = useCart()

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Giỏ hàng</p>
      <h1 className="page-title">Giỏ hàng</h1>

      {lineItems.length === 0 ? (
        <div className="placeholder-card">
          <p>Giỏ hàng hiện đang trống. Hãy thêm sản phẩm để tiếp tục.</p>
          <div className="button-row">
            <Link to="/products" className="primary-btn">
              Tiếp tục mua hàng
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {lineItems.map((item) => (
              <article key={item.productId} className="cart-item-card">
                <div>
                  {isLikelyImageUrl(item.thumbnail) ? (
                    <img src={item.thumbnail} alt={item.name} className="cart-item-thumb" />
                  ) : (
                    <p className="tag">{item.thumbnail}</p>
                  )}
                  <div>
                    <h2>{item.name}</h2>
                    <p className="catalog-muted">{vndFormatter.format(item.price)}</p>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-group">
                    <button type="button" className="ghost-btn" onClick={() => decreaseQty(item.productId)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" className="ghost-btn" onClick={() => increaseQty(item.productId)}>
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="inline-link"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    Xóa
                  </button>
                </div>
              </article>
            ))}
          </div>

          <article className="cart-summary-card">
            <h2>Tổng kết đơn hàng</h2>
            <div className="summary-row">
              <span>Tạm tính</span>
              <strong>{vndFormatter.format(subtotal)}</strong>
            </div>
            <p className="catalog-muted">Phí vận chuyển sẽ được tính ở bước checkout.</p>

            <div className="button-row">
              <Link to="/products" className="ghost-btn">
                Tiếp tục mua hàng
              </Link>
              <Link to="/checkout" className="primary-btn">
                Thanh toán
              </Link>
            </div>
          </article>
        </>
      )}

      <Link to="/products" className="inline-link">
        Quay về trang sản phẩm
      </Link>
    </section>
  )
}

export default CartPage
