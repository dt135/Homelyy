const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^0\d{9}$/

export function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

export function normalizePhone(value: string): string {
  const raw = value.trim()
  if (!raw) {
    return ''
  }

  const compact = raw.replace(/[\s().-]/g, '')

  if (!/^\+?\d+$/.test(compact)) {
    return raw
  }

  if (compact.startsWith('+84')) {
    return `0${compact.slice(3)}`
  }

  if (compact.startsWith('84')) {
    return `0${compact.slice(2)}`
  }

  return compact
}

export function validateFullName(value: string): string | null {
  const normalized = normalizeWhitespace(value)

  if (!normalized) {
    return 'Họ và tên là bắt buộc'
  }

  if (normalized.length < 2 || normalized.length > 80) {
    return 'Họ và tên cần từ 2 đến 80 ký tự'
  }

  return null
}

export function validateEmail(value: string): string | null {
  const normalized = normalizeEmail(value)

  if (!normalized) {
    return 'Email là bắt buộc'
  }

  if (normalized.length > 254 || !EMAIL_REGEX.test(normalized)) {
    return 'Định dạng email chưa hợp lệ'
  }

  return null
}

export function validatePhone(value: string): string | null {
  const normalized = normalizePhone(value)

  if (!normalized) {
    return null
  }

  if (!PHONE_REGEX.test(normalized)) {
    return 'Số điện thoại không hợp lệ (ví dụ: 09xxxxxxxx)'
  }

  return null
}

export function validatePassword(value: string, minLength = 8): string | null {
  if (!value) {
    return 'Mật khẩu là bắt buộc'
  }

  if (value.length < minLength || value.length > 64) {
    return `Mật khẩu cần từ ${minLength} đến 64 ký tự`
  }

  if (/\s/.test(value)) {
    return 'Mật khẩu không được chứa khoảng trắng'
  }

  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return 'Mật khẩu cần có ít nhất 1 chữ cái và 1 chữ số'
  }

  return null
}
