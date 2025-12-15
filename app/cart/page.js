// app/cart/page.js
'use client'
import { useCart } from '../cart-context'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart()

  if (totalItems === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="bg-white p-16 rounded-3xl shadow-2xl text-center">
          <h1 className="text-6xl font-bold mb-8">Your cart is empty</h1>
          <Link href="/menu" className="bg-amber-600 text-white px-20 py-8 rounded-3xl text-4xl font-bold hover:bg-amber-700">
            Start Ordering
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-6 bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-black text-center mb-16">Your Cart ({totalItems})</h1>

        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
          {cart.map(entry => (
            <div key={entry.key} className="flex gap-6 items-center border-b pb-8 last:border-0">
              {entry.item.base_image_url ? (
                <Image 
                  src={entry.item.base_image_url} 
                  alt={entry.item.name}
                  width={120} 
                  height={120} 
                  className="rounded-2xl object-cover" 
                  unoptimized 
                />
              ) : (
                <div className="bg-gray-200 w-30 h-30 rounded-2xl" />
              )}
              <div className="flex-1">
                <h3 className="text-3xl font-bold">{entry.item.name}</h3>
                <p className="text-xl text-gray-600">{entry.variant.size} {entry.variant.variant}</p>
                <div className="flex items-center gap-6 mt-6">
                  <button onClick={() => updateQuantity(entry.key, entry.quantity - 1)} className="bg-red-500 hover:bg-red-600 text-white w-12 h-12 rounded-full text-4xl font-bold">
                    −
                  </button>
                  <span className="text-4xl font-black">{entry.quantity}</span>
                  <button onClick={() => updateQuantity(entry.key, entry.quantity + 1)} className="bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full text-4xl font-bold">
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-amber-600">
                  ₹{((entry.variant.price / 100) * entry.quantity).toFixed(0)}
                </p>
                <button onClick={() => removeFromCart(entry.key)} className="text-red-600 mt-4 text-xl">
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="border-t-4 border-amber-200 pt-8">
            <p className="text-5xl font-black text-right mb-12">
              Total: ₹{totalPrice.toFixed(0)}
            </p>

            <div className="flex justify-between items-center">
              {/* CONTINUE SHOPPING */}
              <Link href="/menu" className="bg-gray-600 hover:bg-gray-700 text-white px-16 py-8 rounded-3xl text-3xl font-bold">
                Continue Shopping
              </Link>

              {/* PLACE ORDER → GOES TO CHECKOUT */}
              <Link href="/checkout" className="bg-green-600 hover:bg-green-700 text-white px-20 py-8 rounded-3xl text-4xl font-bold">
                Place Order →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}