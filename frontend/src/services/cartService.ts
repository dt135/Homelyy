import { STORAGE_KEYS } from '../constants/storageKeys'
import type { CartItem } from '../types/cart'
import { readStorage, writeStorage } from '../utils/localStorage'

export function getCartItems(): CartItem[] {
  return readStorage<CartItem[]>(STORAGE_KEYS.cart, [])
}

export function persistCartItems(items: CartItem[]): void {
  writeStorage(STORAGE_KEYS.cart, items)
}
