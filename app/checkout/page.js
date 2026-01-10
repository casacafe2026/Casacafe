'use client'
import { useCart } from '../cart-context'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Checkout() {
  const { cart, totalPrice, takeawayFee, clearCart } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [table, setTable] = useState('')
  const [loading, setLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const isTakeaway = takeawayFee > 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const orderItems = cart.map(i => ({
      quantity: i.quantity,
      name: i.item.name,
      variant: {
        size: i.variant.size || null,
        variant: i.variant.variant || null,
        price: i.variant.price
      }
    }))

    const { error } = await supabase.from('orders').insert({
      items: orderItems,
      total_amount: totalPrice * 100,
      address: {
        name,
        phone,
        table: isTakeaway ? null : table || null
      },
      status: 'pending'
    })

    if (error) alert('Order failed: ' + error.message)
    else {
      clearCart()
      setOrderSuccess(true)
    }

    setLoading(false)
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-xl">
          <svg className="w-28 h-28 mx-auto text-green-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">Order Placed!</h1>
          <p className="text-lg sm:text-xl text-black/90 mb-8">
            Thank you for your order. We’ll notify you when it’s ready!
          </p>
          <Link
            href="/"
            className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-3 rounded-full text-lg shadow-lg transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-amber-50 py-10 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-center text-4xl sm:text-5xl font-extrabold mb-10">Checkout</h1>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* NAME */}
            <div>
              <label className="block text-black font-medium mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter name"
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-xl text-black text-base placeholder-stone-500 focus:border-amber-600 outline-none"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-black font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter phone number"
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-xl text-black text-base placeholder-stone-500 focus:border-amber-600 outline-none"
              />
            </div>

            {/* TABLE NUMBER */}
            {!isTakeaway && (
              <div>
                <label className="block text-black font-medium mb-1">Table Number</label>
                <select
                  value={table}
                  onChange={e => setTable(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl text-black text-base bg-white focus:border-amber-600 outline-none"
                >
                  <option value="" disabled>Select table</option>
                  {[1,2,3,4,5,6,7].map(t => (
                    <option key={t} value={t}>Table {t}</option>
                  ))}
                </select>
              </div>
            )}

            {/* ORDER */}
            <div className="bg-amber-50 rounded-xl p-4 flex justify-between items-center shadow-inner">
              <span className="text-black font-medium">
                {isTakeaway ? 'Takeaway' : 'Dine-In'}
              </span>
              <span className="text-2xl font-bold text-black">₹{totalPrice.toFixed(0)}</span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white py-3 rounded-full text-lg font-semibold shadow-lg transition"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
