const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^0\d{9}$/

function createValidationError(message) {
  const error = new Error(message)
  error.statusCode = 422
  return error
}

function normalizeWhitespace(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

function validateEmail(value, label = 'Email') {
  if (!value) {
    throw createValidationError(`${label} là bắt buộc`)
  }

  if (value.length > 254 || !EMAIL_REGEX.test(value)) {
    throw createValidationError('Định dạng email chưa hợp lệ')
  }

  return value
}

function normalizePhone(value) {
  const raw = String(value || '').trim()
  if (!raw) {
    return ''
  }

  const compact = raw.replace(/[\s().-]/g, '')

  if (!/^\+?\d+$/.test(compact)) {
    throw createValidationError('Số điện thoại chỉ được chứa chữ số')
  }

  let normalized = compact

  if (normalized.startsWith('+84')) {
    normalized = `0${normalized.slice(3)}`
  } else if (normalized.startsWith('84')) {
    normalized = `0${normalized.slice(2)}`
  }

  if (!PHONE_REGEX.test(normalized)) {
    throw createValidationError('Số điện thoại không hợp lệ (ví dụ: 09xxxxxxxx)')
  }

  return normalized
}

function validateFullName(value, label = 'Họ và tên') {
  const normalized = normalizeWhitespace(value)

  if (!normalized) {
    throw createValidationError(`${label} là bắt buộc`)
  }

  if (normalized.length < 2 || normalized.length > 80) {
    throw createValidationError(`${label} cần từ 2 đến 80 ký tự`)
  }

  return normalized
}

function validatePassword(value, options = {}) {
  const { minLength = 8, allowEmpty = false } = options
  const password = String(value || '')

  if (!password) {
    if (allowEmpty) {
      return ''
    }
    throw createValidationError('Mật khẩu là bắt buộc')
  }

  if (password.length < minLength || password.length > 64) {
    throw createValidationError(`Mật khẩu cần từ ${minLength} đến 64 ký tự`)
  }

  if (/\s/.test(password)) {
    throw createValidationError('Mật khẩu không được chứa khoảng trắng')
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw createValidationError('Mật khẩu cần có ít nhất 1 chữ cái và 1 chữ số')
  }

  return password
}

function validateRole(value, options = {}) {
  const { defaultToUser = false } = options

  if (value == null || value === '') {
    if (defaultToUser) {
      return 'user'
    }
    throw createValidationError('Vai trò người dùng là bắt buộc')
  }

  if (value !== 'user' && value !== 'admin') {
    throw createValidationError('Vai trò người dùng không hợp lệ')
  }

  return value
}

module.exports = {
  createValidationError,
  normalizeEmail,
  normalizePhone,
  validateEmail,
  validateFullName,
  validatePassword,
  validateRole,
}
