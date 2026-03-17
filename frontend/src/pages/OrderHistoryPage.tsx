import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { fetchOrdersByUser } from '../services/orderService'
import type { Order } from '../types/order'
import { formatDate, formatOrderStatus, formatPaymentMethod, vndFormatter } from '../utils/formatters'

function OrderHistoryPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      return
    }

    setIsLoading(true)
    fetchOrdersByUser()
      .then((payload) => setOrders(payload))
      .finally(() => setIsLoading(false))
  }, [user])

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Đơn hàng</p>
      <h1 className="page-title">Lịch sử đơn hàng</h1>

      {isLoading ? <div className="state-card">Đang tải đơn hàng...</div> : null}
      {!isLoading && orders.length === 0 ? <div className="state-card">Chưa có đơn hàng nào.</div> : null}

      {!isLoading && orders.length > 0 ? (
        <div className="order-list">
          {orders.map((order) => (
            <article key={order.id} className="order-card">
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
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default OrderHistoryPage
