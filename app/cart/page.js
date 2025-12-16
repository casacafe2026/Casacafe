// app/cart/page.js
'use client'
import { useCart } from '../cart-context'
import Link from 'next/link'

export default function CartPage() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    totalItems, 
    totalPrice, 
    takeawayFee, 
    setTakeawayFee 
  } = useCart()

  const orderType = takeawayFee > 0 ? 'takeaway' : 'dine-in'

  const toggleOrderType = () => {
    setTakeawayFee(orderType === 'dine-in' ? 1000 : 0)  // ₹10 = 1000 paise
  }

  const subtotal = totalPrice - (takeawayFee / 100)

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center max-w-md">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-amber-900 mb-8">Your Cart is Empty</h2>
          <p className="text-xl text-gray-700 mb-12">Discover our delicious menu and add your favorites!</p>
          <Link 
            href="/menu" 
            className="inline-block bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-16 py-6 rounded-full text-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-12 lg:py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-center text-amber-900 mb-12 tracking-wide uppercase">
          Your Cart
        </h1>

        {/* Order Type Toggle - Elegant Pill Style */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10">
          <p className="text-2xl font-bold text-center text-gray-800 mb-6">Order Type</p>
          <div className="flex justify-center">
            <div className="inline-flex rounded-full bg-amber-100 p-2 shadow-inner">
              <button
                onClick={toggleOrderType}
                className={`px-12 py-5 rounded-full text-xl font-bold transition-all duration-300 ${
                  orderType === 'dine-in' 
                    ? 'bg-amber-600 text-white shadow-lg' 
                    : 'text-amber-800 hover:text-amber-900'
                }`}
              >
                Dine-In
              </button>
              <button
                onClick={toggleOrderType}
                className={`px-12 py-5 rounded-full text-xl font-bold transition-all duration-300 ${
                  orderType === 'takeaway' 
                    ? 'bg-amber-600 text-white shadow-lg' 
                    : 'text-amber-800 hover:text-amber-900'
                }`}
              >
                Takeaway
              </button>
            </div>
          </div>
          {orderType === 'takeaway' && (
            <p className="text-center mt-4 text-lg text-gray-600">
              + ₹10 packaging fee applied
            </p>
          )}
        </div>

        {/* Cart Items - Beautiful Cards */}
        <div className="space-y-8 mb-12">
          {cart.map((item) => (
            <div 
              key={item.key} 
              className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-6 lg:gap-10 hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Item Name & Variant */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                  {item.item.name}
                </h3>
                {(item.variant.size || item.variant.variant) && (
                  <p className="text-lg text-gray-600">
                    {item.variant.size && `${item.variant.size} `}
                    {item.variant.variant && item.variant.variant}
                  </p>
                )}
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-5">
                <button
                  onClick={() => updateQuantity(item.key, item.quantity - 1)}
                  className="w-12 h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transition"
                >
                  −
                </button>
                <span className="text-3xl font-extrabold text-amber-700 w-16 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.key, item.quantity + 1)}
                  className="w-12 h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transition"
                >
                  +
                </button>
              </div>

              {/* Price */}
              <p className="text-2xl lg:text-3xl font-extrabold text-amber-700 w-40 text-center">
                ₹{((item.variant.price / 100) * item.quantity).toFixed(0)}
              </p>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.key)}
                className="text-red-600 hover:text-red-700 text-3xl font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Total Summary - Luxury Card */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl shadow-2xl p-10 lg:p-12 text-white text-right">
          <p className="text-2xl lg:text-3xl font-medium">
            Subtotal: <span className="font-bold">₹{subtotal.toFixed(0)}</span>
          </p>
          {takeawayFee > 0 && (
            <p className="text-xl lg:text-2xl mt-2">
              Packaging Fee: <span className="font-bold">₹10</span>
            </p>
          )}
          <p className="text-4xl lg:text-6xl font-extrabold mt-6">
            Total: ₹{totalPrice.toFixed(0)}
          </p>
        </div>

        {/* Checkout Button */}
        <div className="text-center mt-16">
          <Link
            href="/checkout"
            className="inline-block bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white px-20 py-8 rounded-full text-3xl lg:text-4xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-500"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}