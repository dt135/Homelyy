import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../services/apiClient'
import { fetchOrdersByUser } from '../services/orderService'
import { fetchProducts } from '../services/productService'
import type { Order } from '../types/order'
import type { Product } from '../types/product'
import { formatDate, formatOrderStatus, formatPaymentMethod, vndFormatter } from '../utils/formatters'

function OrderHistoryPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const productMap = useMemo(() => new Map(products.map((product) => [product.id, product])), [products])
  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) || null,
    [orders, selectedOrderId],
  )

  useEffect(() => {
    if (!user) {
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    Promise.all([fetchOrdersByUser(), fetchProducts()])
      .then(([ordersPayload, productsPayload]) => {
        setOrders(ordersPayload)
        setProducts(productsPayload)
      })
      .catch((error) => {
        setOrders([])
        setProducts([])
        setErrorMessage(getErrorMessage(error))
      })
      .finally(() => setIsLoading(false))
  }, [user])

  useEffect(() => {
    if (!selectedOrder) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelectedOrderId(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedOrder])

  return (
    <>
      <section className="page-stack reveal-up">
        <p className="eyebrow">Đơn hàng</p>
        <h1 className="page-title">Lịch sử đơn hàng</h1>

        {errorMessage ? <div className="state-card">{errorMessage}</div> : null}
        {isLoading ? <div className="state-card">Đang tải đơn hàng...</div> : null}
        {!isLoading && !errorMessage && orders.length === 0 ? (
          <div className="state-card">Chưa có đơn hàng nào.</div>
        ) : null}

        {!isLoading && orders.length > 0 ? (
          <div className="order-list">
            {orders.map((order) => (
              <article key={order.id} className="order-card order-history-card">
                <div className="summary-row">
                  <h2>{order.id}</h2>
                  <span className="tag">{formatOrderStatus(order.status)}</span>
                </div>
                <p className="catalog-muted">Ngày đặt: {formatDate(order.createdAt)}</p>
                <p className="catalog-muted">Thanh toán: {formatPaymentMethod(order.paymentMethod)}</p>
                <div className="summary-row">
                  <span>Số sản phẩm: {order.items.length}</span>
                  <strong>{vndFormatter.format(order.totalAmount)}</strong>
                </div>

                <div className="order-history-actions">
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      {selectedOrder ? (
        <div className="order-detail-modal-backdrop" onClick={() => setSelectedOrderId(null)}>
          <section
            className="order-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="order-detail-modal-header">
              <div>
                <p className="eyebrow">Chi tiết đơn hàng</p>
                <h2 id="order-detail-title">{selectedOrder.id}</h2>
              </div>
              <button type="button" className="ghost-btn" onClick={() => setSelectedOrderId(null)}>
                Đóng
              </button>
            </div>

            <div className="order-detail-grid">
              <div className="order-detail-section">
                <h3>Thông tin đơn hàng</h3>
                <div className="order-detail-facts">
                  <p>
                    <span>Ngày đặt</span>
                    <strong>{formatDate(selectedOrder.createdAt)}</strong>
                  </p>
                  <p>
                    <span>Trạng thái</span>
                    <strong>{formatOrderStatus(selectedOrder.status)}</strong>
                  </p>
                  <p>
                    <span>Thanh toán</span>
                    <strong>{formatPaymentMethod(selectedOrder.paymentMethod)}</strong>
                  </p>
                  <p>
                    <span>Tổng tiền</span>
                    <strong>{vndFormatter.format(selectedOrder.totalAmount)}</strong>
                  </p>
                </div>
              </div>

              <div className="order-detail-section">
                <h3>Thông tin giao hàng</h3>
                <div className="order-detail-facts">
                  <p>
                    <span>Người nhận</span>
                    <strong>{selectedOrder.shippingAddress.fullName || 'Chưa cập nhật'}</strong>
                  </p>
                  <p>
                    <span>Số điện thoại</span>
                    <strong>{selectedOrder.shippingAddress.phone || 'Chưa cập nhật'}</strong>
                  </p>
                  <p className="order-detail-address">
                    <span>Địa chỉ</span>
                    <strong>
                      {[
                        selectedOrder.shippingAddress.addressLine,
                        selectedOrder.shippingAddress.district,
                        selectedOrder.shippingAddress.city,
                      ]
                        .filter(Boolean)
                        .join(', ') || 'Chưa cập nhật'}
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="order-detail-section">
              <h3>Sản phẩm đã mua</h3>
              <div className="order-detail-items">
                {selectedOrder.items.map((item) => {
                  const product = productMap.get(item.productId)
                  const unitPrice = Number(item.price || 0)

                  return (
                    <article key={`${selectedOrder.id}-${item.productId}`} className="order-detail-item-card">
                      <div className="order-detail-item-main">
                        <strong>{product?.name || item.productId}</strong>
                        <p className="catalog-muted">Mã sản phẩm: {item.productId}</p>
                      </div>
                      <div className="order-detail-item-stats">
                        <span>Số lượng: {item.quantity}</span>
                        <span>Đơn giá: {vndFormatter.format(unitPrice)}</span>
                        <strong>Thành tiền: {vndFormatter.format(unitPrice * item.quantity)}</strong>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}

export default OrderHistoryPage
