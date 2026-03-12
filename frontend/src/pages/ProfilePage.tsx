import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { fetchOrdersByUser } from '../services/orderService'
import type { Order } from '../types/order'
import { normalizePhone, normalizeWhitespace, validateFullName, validatePhone } from '../utils/validators'
import { formatDate, formatOrderStatus } from '../utils/formatters'

function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [orders, setOrders] = useState<Order[]>([])
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    setFullName(user?.fullName ?? '')
    setPhone(user?.phone ?? '')
    if (!user) {
      return
    }

    fetchOrdersByUser(user.id)
      .then((payload) => setOrders(payload))
      .catch(() => setOrders([]))
  }, [user])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const fullNameError = validateFullName(fullName)
    if (fullNameError) {
      setStatusMessage(fullNameError)
      return
    }

    const phoneError = validatePhone(phone)
    if (phoneError) {
      setStatusMessage(phoneError)
      return
    }

    try {
      await updateProfile({
        fullName: normalizeWhitespace(fullName),
        phone: normalizePhone(phone),
      })
      setStatusMessage('Cập nhật hồ sơ thành công')
    } catch {
      setStatusMessage('Có lỗi khi cập nhật hồ sơ')
    }
  }

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Hồ sơ người dùng</p>
      <h1 className="page-title">Tài khoản của bạn</h1>

      <div className="placeholder-grid">
        <form className="placeholder-card" onSubmit={handleSubmit}>
          <h2>Thông tin cá nhân</h2>
          <p className="catalog-muted">Email: {user?.email}</p>
          <label className="field">
            <span>Họ và tên</span>
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} />
          </label>
          <label className="field">
            <span>Số điện thoại</span>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>
          <button type="submit" className="ghost-btn">
            Cập nhật hồ sơ
          </button>
          {statusMessage ? <p className="catalog-muted">{statusMessage}</p> : null}
        </form>

        <article className="placeholder-card">
          <h2>Lịch sử đơn hàng</h2>
          {orders.length === 0 ? <p>Bạn chưa có đơn hàng nào.</p> : null}
          {orders.slice(0, 3).map((order) => (
            <div key={order.id} className="summary-row">
              <span>
                {order.id} - {formatDate(order.createdAt)}
              </span>
              <strong>{formatOrderStatus(order.status)}</strong>
            </div>
          ))}
          <Link to="/orders" className="inline-link">
            Xem toàn bộ đơn hàng
          </Link>
        </article>
      </div>
    </section>
  )
}

export default ProfilePage
