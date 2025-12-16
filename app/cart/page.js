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
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Add some items to get started!</p>
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
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">
          Your Cart ({totalItems} items)
        </h1>

        {/* Order Type Toggle */}
        <div className="bg-white rounded-md shadow p-4 mb-6">
          <p className="text-lg font-semibold mb-3 text-center">Order Type</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={toggleOrderType}
              className={`px-4 py-2 rounded-md text-sm font-semibold ${
                orderType === 'dine-in'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Dine-In
            </button>
            <button
              onClick={toggleOrderType}
              className={`px-4 py-2 rounded-md text-sm font-semibold ${
                orderType === 'takeaway'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Takeaway
            </button>
          </div>
          {orderType === 'takeaway' && (
            <p className="text-center mt-2 text-xs text-gray-600">
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
                <h3 className="text-sm font-semibold">{item.item.name}</h3>
                {(item.variant.size || item.variant.variant) && (
                  <p className="text-xs text-gray-500">
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
                    <span className="text-sm font-bold w-6 text-center">
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
                  <p className="text-sm font-bold text-amber-700">
                    ₹{((item.variant.price / 100) * item.quantity).toFixed(0)}
                  </p>
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.key)}
                className="text-red-600 font-bold text-lg"
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        {/* Total Summary */}
        <div className="bg-white rounded-md shadow p-4 text-right">
          <p className="text-sm">
            Subtotal: <span className="font-bold">₹{subtotal.toFixed(0)}</span>
          </p>
          {takeawayFee > 0 && (
            <p className="text-xs mt-1">
              Packaging Fee:{' '}
              <span className="font-bold">
                ₹{takeawayFee === 500 ? '5' : '10'}
              </span>
            </p>
          )}
          <p className="text-lg font-bold mt-2">
            Total: ₹{totalPrice.toFixed(0)}
          </p>
        </div>

        {/* Checkout */}
        <div className="text-center mt-6">
          <Link
            href="/checkout"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-bold text-sm"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}