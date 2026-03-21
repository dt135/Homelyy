import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { getCartItems, persistCartItems } from '../services/cartService'
import { fetchProductById, fetchProducts } from '../services/productService'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'

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
  addToCart: (productId: string, quantity?: number, stockOverride?: number) => void
  removeFromCart: (productId: string) => void
  increaseQty: (productId: string) => void
  decreaseQty: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)

type CartProviderProps = {
  children: ReactNode
}

function CartProvider({ children }: CartProviderProps) {
  const auth = useContext(AuthContext)
  const [items, setItems] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const activeUserId = auth?.user?.id || null
  const cartProductIdsKey = useMemo(
    () => [...new Set(items.map((item) => item.productId).filter(Boolean))].sort().join('|'),
    [items],
  )

  useEffect(() => {
    if (!auth?.isAuthReady) {
      return
    }

    setItems(getCartItems(activeUserId))
  }, [activeUserId, auth?.isAuthReady])

  useEffect(() => {
    let isMounted = true

    fetchProducts()
      .then((payload) => {
        if (!isMounted) {
          return
        }
        setProducts(payload)
      })
      .catch(() => {
        if (!isMounted) {
          return
        }
        setProducts([])
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!auth?.isAuthReady) {
      return
    }

    persistCartItems(items, activeUserId)
  }, [activeUserId, auth?.isAuthReady, items])

  useEffect(() => {
    if (!cartProductIdsKey) {
      return
    }

    let isMounted = true
    const uniqueProductIds = cartProductIdsKey.split('|').filter(Boolean)

    Promise.allSettled(uniqueProductIds.map((productId) => fetchProductById(productId)))
      .then((results) => {
        if (!isMounted) {
          return
        }

        const fetchedProducts = results
          .filter((result): result is PromiseFulfilledResult<Product> => result.status === 'fulfilled')
          .map((result) => result.value)

        if (fetchedProducts.length === 0) {
          return
        }

        setProducts((previous) => {
          const nextById = new Map(previous.map((product) => [product.id, product]))

          fetchedProducts.forEach((product) => {
            nextById.set(product.id, product)
          })

          return [...nextById.values()]
        })
      })
      .catch(() => {
        // Keep the previous snapshot if refreshing cart product details fails.
      })

    return () => {
      isMounted = false
    }
  }, [cartProductIdsKey])

  useEffect(() => {
    if (products.length === 0) {
      return
    }

    setItems((previous) => {
      let hasChanged = false

      const nextItems = previous
        .map((item) => {
          const product = products.find((entry) => entry.id === item.productId)
          if (!product || product.stock <= 0) {
            return item
          }

          const nextQuantity = Math.min(item.quantity, product.stock)
          if (nextQuantity !== item.quantity) {
            hasChanged = true
            return {
              ...item,
              quantity: nextQuantity,
            }
          }

          return item
        })
        .filter((item) => item.quantity > 0)

      return hasChanged || nextItems.length !== previous.length ? nextItems : previous
    })
  }, [products])

  const value = useMemo<CartContextValue>(() => {
    function resolveStock(productId: string, stockOverride?: number): number {
      if (Number.isFinite(stockOverride)) {
        return Math.max(Number(stockOverride), 0)
      }

      const product = products.find((entry) => entry.id === productId)
      return Math.max(product?.stock ?? 0, 0)
    }

    const lineItems = items
      .map((item) => {
        const product = products.find((entry) => entry.id === item.productId)
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
      addToCart: (productId, quantity = 1, stockOverride) => {
        setItems((previous) => {
          if (!activeUserId) {
            return previous
          }

          const stock = resolveStock(productId, stockOverride)
          if (stock <= 0) {
            return previous
          }

          const safeQuantity = Math.max(Math.floor(quantity), 1)
          const existing = previous.find((item) => item.productId === productId)
          if (existing) {
            const nextQuantity = Math.min(existing.quantity + safeQuantity, stock)
            if (nextQuantity === existing.quantity) {
              return previous
            }

            return previous.map((item) =>
              item.productId === productId
                ? { ...item, quantity: nextQuantity }
                : item,
            )
          }

          return [...previous, { productId, quantity: Math.min(safeQuantity, stock) }]
        })

        if (Number.isFinite(stockOverride)) {
          setProducts((previous) =>
            previous.map((product) =>
              product.id === productId
                ? {
                    ...product,
                    stock: Math.max(Number(stockOverride), 0),
                  }
                : product,
            ),
          )
        }
      },
      removeFromCart: (productId) => {
        setItems((previous) => previous.filter((item) => item.productId !== productId))
      },
      increaseQty: (productId) => {
        setItems((previous) => {
          if (!activeUserId) {
            return previous
          }

          const stock = resolveStock(productId)
          if (stock <= 0) {
            return previous
          }

          return previous.map((item) => {
            if (item.productId !== productId) {
              return item
            }

            return {
              ...item,
              quantity: Math.min(item.quantity + 1, stock),
            }
          })
        })
      },
      decreaseQty: (productId) => {
        setItems((previous) =>
          !activeUserId
            ? previous
            :
          previous
            .map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        )
      },
      setQuantity: (productId, quantity) => {
        setItems((previous) => {
          if (!activeUserId) {
            return previous
          }

          const stock = resolveStock(productId)
          if (stock <= 0) {
            return previous
          }

          const safeQuantity = Math.max(1, Math.min(Math.floor(quantity), stock))

          return previous.map((item) =>
            item.productId === productId ? { ...item, quantity: safeQuantity } : item,
          )
        })
      },
      clearCart: () => {
        setItems([])
      },
    }
  }, [activeUserId, items, products])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider
