import { STORAGE_KEYS } from '../constants/storageKeys'
import type { CartItem } from '../types/cart'
import { readStorage, writeStorage } from '../utils/localStorage'

function resolveCartStorageKey(userId?: string | null): string | null {
  const normalizedUserId = String(userId || '').trim()
  if (!normalizedUserId) {
    return null
  }

  return `${STORAGE_KEYS.cart}:${normalizedUserId}`
}

export function getCartItems(userId?: string | null): CartItem[] {
  const key = resolveCartStorageKey(userId)
  if (!key) {
    return []
  }

  return readStorage<CartItem[]>(key, [])
}

export function persistCartItems(items: CartItem[], userId?: string | null): void {
  const key = resolveCartStorageKey(userId)
  if (!key) {
    return
  }

  writeStorage(key, items)
}
