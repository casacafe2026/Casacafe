// app/cart/page.js
'use client'
import { useCart } from '../cart-context'
import Link from 'next/link'
import Image from 'next/image'

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
    if (orderType === 'dine-in') {
      const itemsCount = cart.reduce((sum, i) => sum + i.quantity, 0)
      const fee = itemsCount === 1 ? 500 : itemsCount > 1 ? 1000 : 0
      setTakeawayFee(fee)
    } else {
      setTakeawayFee(0)
    }
  }

  const subtotal = totalPrice - takeawayFee / 100

  if (totalItems === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-white">
        <h2 className="text-2xl font-bold mb-4 text-black">Your Cart is Empty</h2>
        <p className="text-black mb-6">Add some items to get started!</p>
        <Link
          href="/menu"
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-semibold"
        >
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          Your Cart ({totalItems} items)
        </h1>

        {/* Order Type Toggle */}
        <div className="bg-white rounded-md shadow p-4 mb-6">
          <p className="text-lg font-semibold mb-3 text-center text-black">Order Type</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={toggleOrderType}
              className={`px-4 py-2 rounded-md text-sm font-semibold ${
                orderType === 'dine-in'
                  ? 'bg-amber-600 text-black'
                  : 'bg-gray-100 text-black'
              }`}
            >
              Dine-In
            </button>
            <button
              onClick={toggleOrderType}
              className={`px-4 py-2 rounded-md text-sm font-semibold ${
                orderType === 'takeaway'
                  ? 'bg-amber-600 text-black'
                  : 'bg-gray-100 text-black'
              }`}
            >
              Takeaway
            </button>
          </div>
          {orderType === 'takeaway' && (
            <p className="text-center mt-2 text-xs text-black">
              + ₹{takeawayFee === 500 ? '5' : '10'} packaging fee applied
            </p>
          )}
        </div>

        {/* Cart Items List */}
        <ul className="space-y-3 mb-8">
          {cart.map((item) => (
            <li
              key={item.key}
              className="bg-white rounded-md shadow p-3 flex items-center gap-3"
            >
              {/* Thumbnail */}
              <Image
                src={
                  item.item.base_image_url ||
                  'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=800'
                }
                alt={item.item.name}
                width={64}
                height={64}
                className="rounded object-cover"
              />

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-black">{item.item.name}</h3>
                {(item.variant.size || item.variant.variant) && (
                  <p className="text-xs text-black">
                    {item.variant.size && `${item.variant.size} `}
                    {item.variant.variant && item.variant.variant}
                  </p>
                )}
                <div className="flex justify-between items-center mt-2">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.key, item.quantity - 1)
                      }
                      className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold w-6 text-center text-black">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.key, item.quantity + 1)
                      }
                      className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <p className="text-sm font-bold text-black">
                    ₹{((item.variant.price / 100) * item.quantity).toFixed(0)}
                  </p>
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.key)}
                className="text-black font-bold text-lg"
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        {/* Total Summary */}
        <div className="bg-white rounded-md shadow p-4 text-right">
          <p className="text-sm text-black">
            Subtotal: <span className="font-bold">₹{subtotal.toFixed(0)}</span>
          </p>
          {takeawayFee > 0 && (
            <p className="text-xs mt-1 text-black">
              Packaging Fee:{' '}
              <span className="font-bold">
                ₹{takeawayFee === 500 ? '5' : '10'}
              </span>
            </p>
          )}
          <p className="text-lg font-bold mt-2 text-black">
            Total: ₹{totalPrice.toFixed(0)}
          </p>
        </div>

        {/* Checkout + Continue Shopping */}
        <div className="flex justify-center gap-4 mt-6">
          <Link
            href="/menu"
            className="bg-gray-200 hover:bg-gray-300 text-black px-6 py-3 rounded-md font-bold text-sm shadow transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/checkout"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-bold text-sm shadow transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}