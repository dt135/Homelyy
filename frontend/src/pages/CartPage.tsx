import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import { useCart } from '../hooks/useCart'
import { isLikelyImageUrl } from '../utils/images'
import { vndFormatter } from '../utils/formatters'
import { formatRemainingStock, getStockStatus } from '../utils/stock'

function CartPage() {
  const { lineItems, subtotal, increaseQty, decreaseQty, setQuantity, removeFromCart } = useCart()
  const hasBlockingStockIssue = lineItems.some((item) => item.stock <= 0 || item.quantity > item.stock)
  const [quantityInputs, setQuantityInputs] = useState<Record<string, string>>({})
  const [itemMessages, setItemMessages] = useState<Record<string, string>>({})

  useEffect(() => {
    setQuantityInputs((previous) => {
      const next = { ...previous }

      lineItems.forEach((item) => {
        next[item.productId] = String(item.quantity)
      })

      return next
    })
  }, [lineItems])

  function setItemMessage(productId: string, message: string) {
    setItemMessages((previous) => ({
      ...previous,
      [productId]: message,
    }))
  }

  function clearItemMessage(productId: string) {
    setItemMessages((previous) => {
      if (!previous[productId]) {
        return previous
      }

      const next = { ...previous }
      delete next[productId]
      return next
    })
  }

  function handleQuantityInputChange(
    productId: string,
    stock: number,
    currentQuantity: number,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const nextValue = event.target.value.replace(/[^\d]/g, '')

    setQuantityInputs((previous) => ({
      ...previous,
      [productId]: nextValue,
    }))

    if (!nextValue) {
      return
    }

    const parsedQuantity = Number(nextValue)
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      setItemMessage(productId, 'Số lượng phải là số nguyên lớn hơn hoặc bằng 1.')
      return
    }

    if (stock <= 0) {
      setItemMessage(productId, 'Sản phẩm này hiện đã hết hàng.')
      return
    }

    if (parsedQuantity > stock) {
      setItemMessage(productId, `Số lượng vượt tồn kho. ${formatRemainingStock(stock)}.`)
      return
    }

    if (parsedQuantity !== currentQuantity) {
      setQuantity(productId, parsedQuantity)
    }

    clearItemMessage(productId)
  }

  function applyQuantity(productId: string, stock: number, currentQuantity: number) {
    const rawValue = quantityInputs[productId] ?? String(currentQuantity)
    const parsedQuantity = Number(rawValue)

    if (!rawValue.trim()) {
      setQuantityInputs((previous) => ({
        ...previous,
        [productId]: String(currentQuantity),
      }))
      setItemMessage(productId, 'Vui lòng nhập số lượng hợp lệ từ 1 trở lên.')
      return
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      setQuantityInputs((previous) => ({
        ...previous,
        [productId]: String(currentQuantity),
      }))
      setItemMessage(productId, 'Số lượng phải là số nguyên lớn hơn hoặc bằng 1.')
      return
    }

    if (stock <= 0) {
      setQuantityInputs((previous) => ({
        ...previous,
        [productId]: String(currentQuantity),
      }))
      setItemMessage(productId, 'Sản phẩm này hiện đã hết hàng.')
      return
    }

    if (parsedQuantity > stock) {
      setQuantityInputs((previous) => ({
        ...previous,
        [productId]: String(currentQuantity),
      }))
      setItemMessage(productId, `Số lượng vượt tồn kho. ${formatRemainingStock(stock)}.`)
      return
    }

    setQuantity(productId, parsedQuantity)
    setQuantityInputs((previous) => ({
      ...previous,
      [productId]: String(parsedQuantity),
    }))
    clearItemMessage(productId)
  }

  function handleQuantityInputKeyDown(
    productId: string,
    stock: number,
    currentQuantity: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    applyQuantity(productId, stock, currentQuantity)
  }

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
            {lineItems.map((item) => {
              const stockStatus = getStockStatus(item.stock)
              const exceedsStock = item.quantity > item.stock && item.stock > 0

              return (
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
                      <p className="catalog-muted">{formatRemainingStock(item.stock)}</p>
                      {stockStatus.label ? (
                        <div className={`stock-badge stock-badge-${stockStatus.tone}`}>{stockStatus.label}</div>
                      ) : null}
                      {exceedsStock ? (
                        <p className="stock-note stock-note-out">{formatRemainingStock(item.stock)}, vui lòng giảm số lượng.</p>
                      ) : null}
                      {item.stock > 0 && stockStatus.tone === 'low' ? (
                        <p className="stock-note stock-note-low">{formatRemainingStock(item.stock)}</p>
                      ) : null}
                      {itemMessages[item.productId] ? (
                        <p className="form-alert form-alert-error cart-item-alert">{itemMessages[item.productId]}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-group">
                      <button
                        type="button"
                        className="quantity-stepper-btn"
                        onClick={() => {
                          decreaseQty(item.productId)
                          clearItemMessage(item.productId)
                        }}
                        aria-label={`Giảm số lượng ${item.name}`}
                      >
                        <span aria-hidden="true">−</span>
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={quantityInputs[item.productId] ?? String(item.quantity)}
                        onChange={(event) => handleQuantityInputChange(item.productId, item.stock, item.quantity, event)}
                        onBlur={() => applyQuantity(item.productId, item.stock, item.quantity)}
                        onKeyDown={(event) => handleQuantityInputKeyDown(item.productId, item.stock, item.quantity, event)}
                        className="quantity-input"
                        aria-label={`Số lượng của ${item.name}`}
                      />
                      <button
                        type="button"
                        className="quantity-stepper-btn"
                        onClick={() => {
                          if (item.stock <= 0) {
                            setItemMessage(item.productId, 'Sản phẩm này hiện đã hết hàng.')
                            return
                          }

                          if (item.quantity >= item.stock) {
                            setItemMessage(item.productId, `Bạn chỉ có thể mua tối đa. ${formatRemainingStock(item.stock)}.`)
                            return
                          }

                          increaseQty(item.productId)
                          clearItemMessage(item.productId)
                        }}
                        aria-label={`Tăng số lượng ${item.name}`}
                      >
                        <span aria-hidden="true">+</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      className="inline-link"
                      onClick={() => {
                        removeFromCart(item.productId)
                        clearItemMessage(item.productId)
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </article>
              )
            })}
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
              {hasBlockingStockIssue ? (
                <button type="button" className="primary-btn" disabled>
                  Không thể thanh toán
                </button>
              ) : (
                <Link to="/checkout" className="primary-btn">
                  Thanh toán
                </Link>
              )}
            </div>
            {hasBlockingStockIssue ? (
              <p className="stock-note stock-note-out">
                Có sản phẩm đã hết hàng hoặc vượt tồn kho, vui lòng điều chỉnh giỏ hàng trước khi thanh toán.
              </p>
            ) : null}
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
