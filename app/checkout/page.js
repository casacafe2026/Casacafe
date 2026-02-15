'use client'
import { useCart } from '../cart-context'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Checkout() {
  const { cart, totalPrice, takeawayFee, clearCart } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  // OLD TABLE STATE (COMMENTED)
  // const [table, setTable] = useState('')

  const [flatNumber, setFlatNumber] = useState('')
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

        // OLD TABLE FIELD (COMMENTED)
        // table: isTakeaway ? null : table || null,

        flatNumber: flatNumber || null
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
        <div className="text-center max-w-xl">
          <svg className="w-28 h-28 mx-auto text-green-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <h1 className="text-4xl lg:text-6xl font-extrabold text-black mb-4">
            Order Successful!
          </h1>
          <p className="text-lg lg:text-2xl text-black/90 mb-8">
            Thank you! We’re preparing your order with love. We’ll notify you once it’s ready.
          </p>

          <Link
            href="/"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-12 py-4 rounded-full text-xl font-semibold shadow-xl transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-amber-50 py-10 lg:py-20 px-4 sm:px-6 lg:px-16">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl lg:text-6xl font-extrabold text-center text-black mb-10 tracking-wide uppercase">
          Checkout
        </h1>

        <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-10 border border-amber-200/40">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* NAME */}
            <div>
              <label className="block text-lg lg:text-xl font-semibold text-black mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full px-5 py-3 border border-stone-300 rounded-xl text-black placeholder-stone-500 text-base lg:text-lg focus:border-amber-600 outline-none shadow-sm focus:shadow-md transition"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-lg lg:text-xl font-semibold text-black mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                className="w-full px-5 py-3 border border-stone-300 rounded-xl text-black placeholder-stone-500 text-base lg:text-lg focus:border-amber-600 outline-none shadow-sm focus:shadow-md transition"
              />
            </div>

            {/* OLD TABLE DROPDOWN (COMMENTED) */}
            {/*
            {!isTakeaway && (
              <div>
                <label className="block text-lg lg:text-xl font-semibold text-black mb-2">
                  Table Number
                </label>
                <select
                  value={table}
                  onChange={e => setTable(e.target.value)}
                  required={!isTakeaway}
                  className="w-full px-5 py-3 border border-stone-300 rounded-xl bg-white text-black text-base lg:text-lg focus:border-amber-600 outline-none shadow-sm focus:shadow-md transition"
                >
                  <option value="" disabled>Select your table</option>
                  {[1,2,3,4,5,6,7].map(t => (
                    <option key={t} value={t}>Table {t}</option>
                  ))}
                </select>
              </div>
            )}
            */}

            {/* FLAT NUMBER (FOR ALL ORDERS) */}
            <div>
              <label className="block text-lg lg:text-xl font-semibold text-black mb-2">
                Flat Number
              </label>
              <input
                type="text"
                value={flatNumber}
                onChange={e => setFlatNumber(e.target.value)}
                placeholder="Enter your flat number"
                required
                className="w-full px-5 py-3 border border-stone-300 rounded-xl text-black placeholder-stone-500 text-base lg:text-lg focus:border-amber-600 outline-none shadow-sm focus:shadow-md transition"
              />
            </div>

            {/* SUMMARY */}
            <div className="bg-amber-50 rounded-xl p-6 shadow-inner border border-amber-200/40">
              <p className="text-lg lg:text-xl font-semibold text-black mb-2">
                Order Type:
                <span className="font-bold text-black">
                  {isTakeaway ? ' Takeaway' : ' Dine-In'}
                </span>
              </p>

              <p className="text-2xl lg:text-4xl font-bold text-black">
                Total: ₹{totalPrice.toFixed(0)}
              </p>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-4 rounded-full text-xl lg:text-2xl font-semibold shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Placing Order...' : 'Confirm & Place Order'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}
