// app/components/ClientToastWrapper.js
'use client'

import { useCart } from './cart-context'
import AddToCartToast from './AddToCartToast'

export default function ClientToastWrapper() {
  const { toastItems } = useCart()

  return <AddToCartToast toastItems={toastItems} />
}