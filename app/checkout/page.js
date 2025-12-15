// app/checkout/page.js
'use client'
import { useState } from 'react'
import { useCart } from '../cart-context'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart()
  const [tableNumber, setTableNumber] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // VALIDATION — ALL FIELDS REQUIRED
    if (!tableNumber.trim()) {
      alert('Please enter table number')
      return
    }
    if (!customerName.trim()) {
      alert('Please enter your name')
      return
    }
    if (!phone.trim()) {
      alert('Please enter your phone number')
      return
    }
    if (phone.length < 10) {
      alert('Phone number should be at least 10 digits')
      return
    }

    setLoading(true)

    const orderData = {
      total_amount: Math.round(totalPrice * 100),
      status: 'pending',
      address: {
        table: tableNumber.trim(),
        name: customerName.trim(),
        phone: phone.trim()
      },
      items: cart.map(entry => ({
        item_id: entry.item.id,
        name: entry.item.name,
        variant: entry.variant,
        quantity: entry.quantity,
        price: entry.variant.price
      })),
      created_at: new Date().toISOString()
    }

    const { error } = await supabase.from('orders').insert(orderData)

    if (error) {
      alert('Order failed: ' + error.message)
    } else {
      setSuccess(true)
      clearCart()
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white p-16 rounded-3xl shadow-2xl text-center max-w-2xl">
          <h1 className="text-6xl font-black text-green-600 mb-8">Order Sent! 🎉</h1>
          <p className="text-3xl mb-8">Thank you, {customerName}!</p>
          <p className="text-2xl mb-12">Table {tableNumber} — our staff will bring it soon.</p>
          <Link href="/" className="bg-amber-600 text-white px-20 py-8 rounded-3xl text-4xl font-bold hover:bg-amber-700">
            Order More
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-black text-center mb-16">Checkout</h1>

        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <h2 className="text-4xl font-bold mb-8">Your Order</h2>
          <div className="space-y-6 mb-12">
            {cart.map(entry => (
              <div key={entry.key} className="flex justify-between text-2xl">
                <span>{entry.item.name} × {entry.quantity}</span>
                <span>₹{((entry.variant.price / 100) * entry.quantity).toFixed(0)}</span>
              </div>
            ))}
            <div className="border-t-4 border-amber-200 pt-6 text-4xl font-black text-right">
              Total: ₹{totalPrice.toFixed(0)}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <label className="block text-3xl font-bold mb-4">Table Number *</label>
              <input
                type="text"
                value={tableNumber}
                onChange={e => setTableNumber(e.target.value)}
                placeholder="e.g. Table 5"
                required
                className="w-full px-8 py-6 border-4 border-amber-200 rounded-3xl text-3xl text-center focus:border-amber-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-3xl font-bold mb-4">Your Name *</label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="e.g. John"
                required
                className="w-full px-8 py-6 border-4 border-amber-200 rounded-3xl text-3xl text-center focus:border-amber-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-3xl font-bold mb-4">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                required
                className="w-full px-8 py-6 border-4 border-amber-200 rounded-3xl text-3xl text-center focus:border-amber-600 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-10 rounded-3xl text-5xl font-black shadow-2xl disabled:opacity-70"
            >
              {loading ? 'Sending...' : 'CALL WAITER'}
            </button>
          </form>

          <div className="text-center mt-12">
            <Link href="/menu" className="text-3xl text-amber-600 hover:text-amber-800 underline">
              ← Add more items
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}