// app/cart-context.js
'use client'
import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [takeawayFee, setTakeawayFee] = useState(0)  // 0 = Dine-in, 1000 = Takeaway (in paise)

  const addToCart = (item, variant) => {
    setCart(prev => {
      const key = `${item.id}-${variant.id}`
      const existing = prev.find(i => i.key === key)
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { key, item, variant, quantity: 1 }]
    })
  }

  const removeFromCart = (key) => setCart(prev => prev.filter(i => i.key !== key))

  const updateQuantity = (key, qty) => {
    if (qty <= 0) removeFromCart(key)
    else setCart(prev => prev.map(i => i.key === key ? { ...i, quantity: qty } : i))
  }

  const clearCart = () => setCart([])

  // Cart calculations
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)

  const subtotal = cart.reduce((sum, i) => sum + (i.variant.price / 100) * i.quantity, 0)

  const totalPrice = subtotal + (takeawayFee / 100)  // Add packaging fee if takeaway

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      subtotal,               // Subtotal without fee
      takeawayFee,            // Current fee (in paise)
      setTakeawayFee,         // To toggle dine-in/takeaway
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)