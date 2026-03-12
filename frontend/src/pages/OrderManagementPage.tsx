import { useEffect, useState } from 'react'
import { fetchAllOrders } from '../services/orderService'
import type { Order } from '../types/order'
import { formatDate, formatOrderStatus, vndFormatter } from '../utils/formatters'

function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetchAllOrders()
      .then((payload) => setOrders(payload))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Quản trị đơn hàng</p>
      <h1 className="page-title">Quản lý đơn hàng</h1>

      {isLoading ? <div className="state-card">Đang tải danh sách đơn hàng...</div> : null}

      {!isLoading ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Người dùng</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.userId}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{formatOrderStatus(order.status)}</td>
                  <td>{vndFormatter.format(order.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

export default OrderManagementPage
