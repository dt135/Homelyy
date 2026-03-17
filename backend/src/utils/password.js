const crypto = require('crypto')

const HASH_PREFIX = 'scrypt'
const SALT_BYTES = 16
const KEY_LENGTH = 64

function isPasswordHash(value) {
  return typeof value === 'string' && value.startsWith(`${HASH_PREFIX}$`)
}

function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_BYTES).toString('hex')
  const derivedKey = crypto.scryptSync(String(password), salt, KEY_LENGTH).toString('hex')
  return `${HASH_PREFIX}$${salt}$${derivedKey}`
}

function verifyHashedPassword(password, hashedPassword) {
  const [, salt, storedKey] = String(hashedPassword || '').split('$')
  if (!salt || !storedKey) {
    return false
  }

  const derivedKey = crypto.scryptSync(String(password), salt, KEY_LENGTH)
  const storedBuffer = Buffer.from(storedKey, 'hex')

  if (storedBuffer.length !== derivedKey.length) {
    return false
  }

  return crypto.timingSafeEqual(storedBuffer, derivedKey)
}

function verifyPassword(password, storedPassword) {
  if (!storedPassword) {
    return false
  }

  if (isPasswordHash(storedPassword)) {
    return verifyHashedPassword(password, storedPassword)
  }

  return String(password) === String(storedPassword)
}

function ensureStoredPassword(password) {
  if (!password) {
    return ''
  }

  return isPasswordHash(password) ? password : hashPassword(password)
}

module.exports = {
  ensureStoredPassword,
  hashPassword,
  isPasswordHash,
  verifyPassword,
}
