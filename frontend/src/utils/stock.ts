const LOW_STOCK_THRESHOLD = 5

export type StockStatus =
  | {
      label: 'Hết hàng'
      tone: 'out'
      canPurchase: false
    }
  | {
      label: 'Sắp hết hàng'
      tone: 'low'
      canPurchase: true
    }
  | {
      label: ''
      tone: 'normal'
      canPurchase: true
    }

export function getStockStatus(stock: number): StockStatus {
  const normalizedStock = Number.isFinite(stock) ? Number(stock) : 0

  if (normalizedStock <= 0) {
    return {
      label: 'Hết hàng',
      tone: 'out',
      canPurchase: false,
    }
  }

  if (normalizedStock < LOW_STOCK_THRESHOLD) {
    return {
      label: 'Sắp hết hàng',
      tone: 'low',
      canPurchase: true,
    }
  }

  return {
    label: '',
    tone: 'normal',
    canPurchase: true,
  }
}

export function formatRemainingStock(stock: number): string {
  const normalizedStock = Math.max(Number.isFinite(stock) ? Number(stock) : 0, 0)
  return `Còn lại: ${normalizedStock} sản phẩm`
}

export function getStockContextMessage(stock: number): string {
  const normalizedStock = Math.max(Number.isFinite(stock) ? Number(stock) : 0, 0)

  if (normalizedStock <= 0) {
    return 'Còn lại: 0 sản phẩm'
  }

  return `Còn lại: ${normalizedStock} sản phẩm`
}

export function isOutOfStock(stock: number): boolean {
  return getStockStatus(stock).tone === 'out'
}
