import { createContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getCartItems, persistCartItems } from '../services/cartService'
import { mockProducts } from '../services/mock/data/products'
import type { CartItem } from '../types/cart'

export type CartLineItem = CartItem & {
  name: string
  price: number
  stock: number
  thumbnail: string
}

type CartContextValue = {
  items: CartItem[]
  lineItems: CartLineItem[]
  totalItems: number
  subtotal: number
  addToCart: (productId: string, quantity?: number) => void
  removeFromCart: (productId: string) => void
  increaseQty: (productId: string) => void
  decreaseQty: (productId: string) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)

type CartProviderProps = {
  children: ReactNode
}

function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    setItems(getCartItems())
  }, [])

  useEffect(() => {
    persistCartItems(items)
  }, [items])

  const value = useMemo<CartContextValue>(() => {
    const lineItems = items
      .map((item) => {
        const product = mockProducts.find((entry) => entry.id === item.productId)
        if (!product) {
          return null
        }
        return {
          ...item,
          name: product.name,
          price: product.price,
          stock: product.stock,
          thumbnail: product.thumbnail,
        }
      })
      .filter((entry): entry is CartLineItem => entry !== null)

    const totalItems = lineItems.reduce((total, item) => total + item.quantity, 0)
    const subtotal = lineItems.reduce((total, item) => total + item.price * item.quantity, 0)

    return {
      items,
      lineItems,
      totalItems,
      subtotal,
      addToCart: (productId, quantity = 1) => {
        setItems((previous) => {
          const existing = previous.find((item) => item.productId === productId)
          if (existing) {
            return previous.map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.min(item.quantity + quantity, 99) }
                : item,
            )
          }
          return [...previous, { productId, quantity }]
        })
      },
      removeFromCart: (productId) => {
        setItems((previous) => previous.filter((item) => item.productId !== productId))
      },
      increaseQty: (productId) => {
        setItems((previous) =>
          previous.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        )
      },
      decreaseQty: (productId) => {
        setItems((previous) =>
          previous
            .map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        )
      },
      clearCart: () => {
        setItems([])
      },
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider
