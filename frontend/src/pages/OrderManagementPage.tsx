import { useEffect, useState } from 'react'
import { deleteAdminOrder, fetchAdminOrders, updateAdminOrder } from '../services/adminService'
import { getErrorMessage } from '../services/apiClient'
import type { Order } from '../types/order'
import { formatDate, formatOrderStatus, formatPaymentMethod, vndFormatter } from '../utils/formatters'

function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [pendingOrderId, setPendingOrderId] = useState('')

  async function loadOrders() {
    try {
      setIsLoading(true)
      setErrorMessage('')
      const payload = await fetchAdminOrders()
      setOrders(payload)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  async function handleStatusChange(orderId: string, status: 'pending' | 'processing' | 'completed') {
    try {
      setPendingOrderId(orderId)
      setErrorMessage('')
      await updateAdminOrder(orderId, { status })
      await loadOrders()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setPendingOrderId('')
    }
  }

  async function handleDelete(orderId: string) {
    const shouldDelete = window.confirm('Bạn có chắc muốn xóa đơn hàng này?')
    if (!shouldDelete) {
      return
    }

    try {
      setPendingOrderId(orderId)
      setErrorMessage('')
      await deleteAdminOrder(orderId)
      await loadOrders()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setPendingOrderId('')
    }
  }

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Quản trị đơn hàng</p>
      <h1 className="page-title">Quản lý đơn hàng</h1>

      {errorMessage ? <div className="state-card">{errorMessage}</div> : null}
      {isLoading ? <div className="state-card">Đang tải danh sách đơn hàng...</div> : null}

      {!isLoading ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Người dùng</th>
                <th>Ngày tạo</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Tổng tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.userId}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{formatPaymentMethod(order.paymentMethod)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(event) =>
                        handleStatusChange(
                          order.id,
                          event.target.value as 'pending' | 'processing' | 'completed',
                        )
                      }
                      disabled={pendingOrderId === order.id}
                    >
                      <option value="pending">{formatOrderStatus('pending')}</option>
                      <option value="processing">{formatOrderStatus('processing')}</option>
                      <option value="completed">{formatOrderStatus('completed')}</option>
                    </select>
                  </td>
                  <td>{vndFormatter.format(order.totalAmount)}</td>
                  <td>
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() => handleDelete(order.id)}
                      disabled={pendingOrderId === order.id}
                    >
                      Xóa
                    </button>
                  </td>
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
