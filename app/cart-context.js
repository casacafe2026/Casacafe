// app/cart-context.js - MERGES SAME ITEM + SAME VARIANT, 2-SECOND TOAST
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [takeawayFee, setTakeawayFee] = useState(0)

  // Add-on modal state
  const [showAddonModal, setShowAddonModal] = useState(false)
  const [currentProductForAddons, setCurrentProductForAddons] = useState(null)
  const [selectedAddons, setSelectedAddons] = useState([])

  // Toast notification state
  const [toastItems, setToastItems] = useState([])

  // Recalculate takeaway fee
  useEffect(() => {
    if (takeawayFee > 0) {
      const itemsCount = cart.reduce((sum, i) => sum + i.quantity, 0)
      const newFee = itemsCount === 1 ? 500 : itemsCount > 1 ? 1000 : 0
      setTakeawayFee(newFee)
    }
  }, [cart])

  // Trigger add-on modal
  const addToCartWithAddons = (product, variant) => {
    setCurrentProductForAddons({ product, variant })
    setSelectedAddons([])
    setShowAddonModal(true)
  }

  // Confirm add with add-ons + merge logic
  const confirmAddToCart = () => {
    if (!currentProductForAddons) return

    const { product, variant } = currentProductForAddons

    addToCart(product, variant, selectedAddons)

    setShowAddonModal(false)
    setCurrentProductForAddons(null)
    setSelectedAddons([])
  }

  // Main addToCart — merges same item + same variant
  const addToCart = (product, variant, selectedAddons = []) => {
    const matchKey = `${product.id}-${variant.id}`

    setCart(prev => {
      const existingIndex = prev.findIndex(i => i.key === matchKey)

      if (existingIndex !== -1) {
        // Same item + same variant → increase quantity
        const updated = [...prev]
        updated[existingIndex].quantity += 1
        return updated
      } else {
        // New combination → add as new entry
        return [...prev, {
          key: matchKey,
          item: product,
          variant,
          quantity: 1,
          addons: selectedAddons
        }]
      }
    })

    // Show toast
    setToastItems(prev => [...prev, {
      name: product.name,
      variant: variant.size || variant.variant ? `${variant.size || ''} ${variant.variant || ''}`.trim() : 'Standard',
      addonsCount: selectedAddons.length
    }])
  }

  // Auto-clear toast after 2 seconds
  useEffect(() => {
    if (toastItems.length > 0) {
      const timer = setTimeout(() => {
        setToastItems(prev => prev.slice(1))
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [toastItems])

  const removeFromCart = (key) => setCart(prev => prev.filter(i => i.key !== key))

  const updateQuantity = (key, qty) => {
    if (qty <= 0) {
      removeFromCart(key)
    } else {
      setCart(prev => prev.map(i => i.key === key ? { ...i, quantity: qty } : i))
    }
  }

  const clearCart = () => setCart([])

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)

  const subtotalInRupees = cart.reduce((sum, cartItem) => {
    const itemPrice = (cartItem.variant.price / 100) * cartItem.quantity
    const addonsPrice = cartItem.addons.reduce((aSum, addon) => aSum + (addon.price / 100), 0) * cartItem.quantity
    return sum + itemPrice + addonsPrice
  }, 0)

  const takeawayFeeInRupees = takeawayFee / 100
  const totalPrice = subtotalInRupees + takeawayFeeInRupees

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      addToCartWithAddons,
      confirmAddToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      subtotal: subtotalInRupees,
      takeawayFee,
      setTakeawayFee,
      showAddonModal,
      setShowAddonModal,
      currentProductForAddons,
      selectedAddons,
      setSelectedAddons,
      toastItems,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)