import { useState } from 'react'
import { useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { getErrorMessage } from '../services/apiClient'
import { createOrder } from '../services/orderService'
import type { PaymentMethod } from '../types/order'
import { vndFormatter } from '../utils/formatters'
import { formatRemainingStock, getStockStatus } from '../utils/stock'
import { normalizePhone, normalizeWhitespace } from '../utils/validators'

type CheckoutForm = {
  fullName: string
  phone: string
  city: string
  district: string
  addressLine: string
}

const initialForm: CheckoutForm = {
  fullName: '',
  phone: '',
  city: '',
  district: '',
  addressLine: '',
}

function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, lineItems, subtotal, clearCart } = useCart()
  const [form, setForm] = useState<CheckoutForm>(initialForm)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const invalidStockItems = lineItems.filter((item) => item.stock <= 0 || item.quantity > item.stock)

  const shippingFee = subtotal > 3000000 ? 0 : 35000
  const grandTotal = subtotal + shippingFee

  useEffect(() => {
    setForm((previous) => ({
      ...previous,
      fullName: previous.fullName || normalizeWhitespace(user?.fullName ?? ''),
      phone: previous.phone || normalizePhone(user?.phone ?? ''),
    }))
  }, [user?.fullName, user?.phone])

  function updateField(field: keyof CheckoutForm, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user) {
      setErrorMessage('Vui lòng đăng nhập trước khi thanh toán')
      return
    }
    if (items.length === 0) {
      setErrorMessage('Giỏ hàng đang trống')
      return
    }
    if (invalidStockItems.length > 0) {
      setErrorMessage('Có sản phẩm đã hết hàng hoặc số lượng vượt tồn kho. Vui lòng quay lại giỏ hàng để điều chỉnh.')
      return
    }

    const missingField = Object.values(form).some((value) => value.trim().length === 0)
    if (missingField) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin giao hàng')
      return
    }

    try {
      setErrorMessage('')
      setIsSubmitting(true)

      const created = await createOrder({
        items,
        paymentMethod,
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          city: form.city,
          district: form.district,
          addressLine: form.addressLine,
        },
      })

      clearCart()
      navigate(`/checkout/success?orderId=${created.id}`)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Thanh toán</p>
      <h1 className="page-title">Thanh toán</h1>

      <div className="checkout-layout">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Thông tin giao hàng</h2>
          <label className="field">
            <span>Họ và tên</span>
            <input value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} />
          </label>
          <label className="field">
            <span>Số điện thoại</span>
            <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
          </label>
          <label className="field">
            <span>Thành phố</span>
            <input value={form.city} onChange={(event) => updateField('city', event.target.value)} />
          </label>
          <label className="field">
            <span>Quận / Huyện</span>
            <input value={form.district} onChange={(event) => updateField('district', event.target.value)} />
          </label>
          <label className="field">
            <span>Địa chỉ chi tiết</span>
            <input
              value={form.addressLine}
              onChange={(event) => updateField('addressLine', event.target.value)}
            />
          </label>

          <label className="field">
            <span>Phương thức thanh toán</span>
            <select
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
            >
              <option value="cod">Thanh toán khi nhận hàng (COD)</option>
              <option value="banking">Chuyển khoản ngân hàng</option>
            </select>
          </label>

          {invalidStockItems.length > 0 ? (
            <p className="stock-note stock-note-out">
              Có sản phẩm trong đơn hiện không còn đủ tồn kho. Vui lòng quay lại giỏ hàng để cập nhật trước khi đặt.
            </p>
          ) : null}
          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
          <button type="submit" className="primary-btn" disabled={isSubmitting || invalidStockItems.length > 0}>
            {isSubmitting ? 'Đang tạo đơn...' : 'Xác nhận đặt hàng'}
          </button>
        </form>

        <aside className="cart-summary-card">
          <h2>Tóm tắt đơn hàng</h2>
          <div className="order-preview-list">
            {lineItems.map((item) => {
              const stockStatus = getStockStatus(item.stock)

              return (
                <div key={item.productId} className="summary-row">
                  <div>
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <p className="catalog-muted">{formatRemainingStock(item.stock)}</p>
                  </div>
                  <div className="checkout-summary-item">
                    <strong>{vndFormatter.format(item.price * item.quantity)}</strong>
                    {stockStatus.label ? (
                      <span className={`stock-badge stock-badge-${stockStatus.tone}`}>{stockStatus.label}</span>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="summary-row">
            <span>Tạm tính</span>
            <strong>{vndFormatter.format(subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển</span>
            <strong>{shippingFee === 0 ? 'Miễn phí' : vndFormatter.format(shippingFee)}</strong>
          </div>
          <div className="summary-row summary-total">
            <span>Tổng thanh toán</span>
            <strong>{vndFormatter.format(grandTotal)}</strong>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default CheckoutPage
