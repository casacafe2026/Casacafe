'use client'
import { useCart } from '../cart-context'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'  // Adjust if needed

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalPrice,        // In rupees (e.g. 250.00)
    takeawayFee,       // In paise (1000 or 0)
    setTakeawayFee,
    addToCart
  } = useCart()

  const [addonCategories, setAddonCategories] = useState([])
  const [loadingAddons, setLoadingAddons] = useState(true)

  // Always show ₹10 fee when cart has items
  useEffect(() => {
    if (totalItems > 0) {
      setTakeawayFee(1000) // fixed ₹10 = 1000 paise
    } else {
      setTakeawayFee(0)
    }
  }, [totalItems, setTakeawayFee])

  const takeawayFeeInRupees = takeawayFee / 100
  const subtotal = totalPrice - takeawayFeeInRupees

  // Fetch add-on categories
  useEffect(() => {
    const fetchAddonCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, items(id, name, base_image_url, item_variants(price))')
        .eq('is_addon_category', true)
        .order('display_order')

      if (!error && data) {
        setAddonCategories(data)
      }
      setLoadingAddons(false)
    }

    fetchAddonCategories()
  }, [])

  const addRecommendedItem = (item) => {
    const defaultVariant = item.item_variants?.[0] || { price: 0 }
    addToCart({
      id: item.id,
      name: item.name,
      base_image_url: item.base_image_url,
      variants: item.item_variants || []
    }, defaultVariant)
  }

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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          Your Cart ({totalItems} items)
        </h1>

        {/* Order Type Info – now fixed as Takeaway */}
        <div className="bg-white rounded-md shadow p-4 mb-6">
          <p className="text-lg font-semibold mb-2 text-center text-black">Order Type</p>
          <div className="flex justify-center">
            <div className="px-6 py-2 rounded-md text-sm font-semibold bg-amber-600 text-white">
              Takeaway
            </div>
          </div>
          <p className="text-center mt-2 text-xs text-black">
            + ₹10 packaging fee
          </p>
        </div>

        {/* Cart Items List */}
        <ul className="space-y-3 mb-8">
          {cart.map((item) => (
            <li
              key={item.key}
              className="bg-white rounded-md shadow p-3 flex items-center gap-3"
            >
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

              <div className="flex-1">
                <h3 className="text-sm font-semibold text-black">{item.item.name}</h3>
                {(item.variant?.size || item.variant?.variant) && (
                  <p className="text-xs text-black">
                    {item.variant.size && `${item.variant.size} `}
                    {item.variant.variant && item.variant.variant}
                  </p>
                )}
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold w-6 text-center text-black">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-sm font-bold text-black">
                    ₹{((item.variant.price / 100) * item.quantity).toFixed(0)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.key)}
                className="text-red-600 font-bold text-lg"
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        {/* RECOMMENDED ADD-ONS SECTION */}
        {!loadingAddons && addonCategories.length > 0 && (
          <div className="mt-6 mb-8">
            <h2 className="text-base font-black text-center mb-1 text-black">
              Add Extras
            </h2>
            <p className="text-center text-gray-500 mb-3 text-[11px]">
              Popular add-ons
            </p>

            {addonCategories.map((category) => (
              <div key={category.id} className="mb-5">
                <h3 className="text-[10px] font-bold mb-1 px-0.5 uppercase tracking-widest text-black">
                  {category.name}
                </h3>

                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                  {category.items.map((item) => {
                    const defaultPrice = item.item_variants?.[0]?.price || 0

                    return (
                      <div
                        key={item.id}
                        className="min-w-[86px] max-w-[86px] bg-white rounded-md border border-gray-200 shadow-sm flex-shrink-0"
                      >
                        <div className="relative">
                          <Image
                            src={
                              item.base_image_url ||
                              'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800'
                            }
                            alt={item.name}
                            width={120}
                            height={90}
                            className="w-full h-10 object-cover rounded-t-md"
                          />

                          <span className="absolute bottom-0.5 right-0.5 bg-white/95 px-1 py-[1px] rounded-full text-[8px] font-bold text-black shadow">
                            ₹{(defaultPrice / 100).toFixed(0)}
                          </span>
                        </div>

                        <div className="p-1 flex flex-col gap-0.5">
                          <p className="text-[10px] font-semibold text-black leading-tight truncate">
                            {item.name}
                          </p>

                          <button
                            onClick={() => addRecommendedItem(item)}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-[3px] rounded-full text-[9px] font-bold transition active:scale-95"
                          >
                            ADD
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-6 text-right border-2 border-amber-200">
          <p className="text-lg text-black">
            Subtotal: <span className="font-bold text-xl">₹{subtotal.toFixed(0)}</span>
          </p>
          <p className="text-sm mt-2 text-black">
            Packaging Fee:{' '}
            <span className="font-bold">₹{takeawayFeeInRupees.toFixed(0)}</span>
          </p>
          <p className="text-3xl font-black mt-4 text-amber-600">
            Total: ₹{totalPrice.toFixed(0)}
          </p>
        </div>

        {/* Checkout + Continue Shopping */}
        <div className="flex justify-center gap-6 mt-10">
          <Link
            href="/menu"
            className="bg-gray-200 hover:bg-gray-300 text-black px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/checkout"
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}
