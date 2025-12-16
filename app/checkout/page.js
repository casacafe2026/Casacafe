// app/checkout/page.js
'use client'
import { useCart } from '../cart-context'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Checkout() {
  const { cart, totalPrice, takeawayFee, clearCart } = useCart()
  const router = useRouter()
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

    if (error) {
      alert('Order failed: ' + error.message)
    } else {
      clearCart()
      setOrderSuccess(true)
    }
    setLoading(false)
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-2xl">
          <div className="mb-12">
            <svg className="w-32 h-32 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-black mb-8">
            Order Placed Successfully!
          </h1>
          <p className="text-2xl lg:text-3xl text-black mb-12">
            Thank you for your order. Our team is preparing it with love. We'll notify you when it's ready!
          </p>
          <Link
            href="/"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-16 py-6 rounded-full text-2xl lg:text-3xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-amber-50 py-12 lg:py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl lg:text-7xl font-thin text-center text-black mb-12 tracking-widest uppercase">
          Checkout
        </h1>

        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-xl lg:text-2xl font-medium text-black mb-3">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full px-6 py-4 border-2 border-amber-200 rounded-xl text-lg focus:border-amber-600 outline-none transition text-black"
              />
            </div>

            <div>
              <label className="block text-xl lg:text-2xl font-medium text-black mb-3">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                className="w-full px-6 py-4 border-2 border-amber-200 rounded-xl text-lg focus:border-amber-600 outline-none transition text-black"
              />
            </div>

            {/* Table Number — Only for Dine-In */}
            {!isTakeaway && (
              <div>
                <label className="block text-xl lg:text-2xl font-medium text-black mb-3">Table Number</label>
                <select
                  value={table}
                  onChange={e => setTable(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-amber-200 rounded-xl text-lg focus:border-amber-600 outline-none transition bg-white text-black"
                  required={!isTakeaway}
                >
                  <option value="" disabled>
                    Please select your table
                  </option>
                  <option value="1">Table 1</option>
                  <option value="2">Table 2</option>
                  <option value="3">Table 3</option>
                  <option value="4">Table 4</option>
                  <option value="5">Table 5</option>
                </select>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-amber-50 rounded-2xl p-6 lg:p-8">
              <p className="text-xl lg:text-2xl font-medium text-black mb-4">
                Order Type: <span className="font-bold text-black">{isTakeaway ? 'Takeaway' : 'Dine-In'}</span>
              </p>
              <p className="text-3xl lg:text-4xl font-bold text-black">
                Total: ₹{totalPrice.toFixed(0)}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:opacity-70 disabled:cursor-not-allowed text-white py-6 rounded-full text-2xl lg:text-3xl font-medium shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              {loading ? 'Placing Order...' : 'Confirm & Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}