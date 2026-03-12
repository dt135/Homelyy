export const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value))
}

export function formatOrderStatus(status: string): string {
  switch (status) {
    case 'pending':
      return 'Chờ xử lý'
    case 'processing':
      return 'Đang xử lý'
    case 'completed':
      return 'Hoàn thành'
    default:
      return status
  }
}

export function formatPaymentMethod(method: string): string {
  switch (method) {
    case 'cod':
      return 'Thanh toán khi nhận hàng'
    case 'banking':
      return 'Chuyển khoản ngân hàng'
    default:
      return method
  }
}
