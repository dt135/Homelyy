import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { createOrder } from '../services/orderService'
import type { PaymentMethod } from '../types/order'
import { vndFormatter } from '../utils/formatters'

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

  const shippingFee = subtotal > 3000000 ? 0 : 35000
  const grandTotal = subtotal + shippingFee

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
    } catch {
      setErrorMessage('Thanh toán thất bại. Vui lòng thử lại.')
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

          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
          <button type="submit" className="primary-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo đơn...' : 'Xác nhận đặt hàng'}
          </button>
        </form>

        <aside className="cart-summary-card">
          <h2>Tóm tắt đơn hàng</h2>
          <div className="order-preview-list">
            {lineItems.map((item) => (
              <div key={item.productId} className="summary-row">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <strong>{vndFormatter.format(item.price * item.quantity)}</strong>
              </div>
            ))}
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
