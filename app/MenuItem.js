// app/MenuItem.js
'use client'
import { useCart } from './cart-context'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function MenuItem({ item }) {
  const { addToCart } = useCart()
  const [selectedVariant, setSelectedVariant] = useState(null)

  if (!item.item_variants || item.item_variants.length === 0) return null

  // Auto select default variant on load
  useEffect(() => {
    const defaultVariant = item.item_variants.find(v => v.is_default) || item.item_variants[0]
    setSelectedVariant(defaultVariant)
  }, [item])

  const hasMultipleVariants = item.item_variants.length > 1
  const currentPrice = selectedVariant ? (selectedVariant.price / 100).toFixed(0) : 0

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-amber-100 hover:border-amber-400 transition-all duration-300">
      <div className="relative h-64 sm:h-72">
        <Image
          src={item.base_image_url || 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=800'}
          alt={item.name}
          fill
          className="object-cover"
          unoptimized
        />
        {item.is_special && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-full font-black text-lg sm:text-xl shadow-lg">
            SPECIAL
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8">
        <h3 className="text-2xl sm:text-3xl font-black text-center mb-4 text-gray-800">
          {item.name}
        </h3>

        {/* Variant Dropdown — only if multiple variants */}
        {hasMultipleVariants && (
          <div className="mb-6 sm:mb-8">
            <label className="block text-lg sm:text-xl font-bold text-gray-700 mb-3 text-center">
              Choose Variant
            </label>
            <select
              value={selectedVariant?.id || ''}
              onChange={(e) => {
                const variant = item.item_variants.find(v => v.id === Number(e.target.value))
                setSelectedVariant(variant)
              }}
              className="w-full px-6 py-4 border-4 border-amber-200 rounded-2xl text-lg sm:text-xl font-bold text-center focus:border-amber-600 outline-none bg-amber-50 transition"
            >
              {item.item_variants.map(v => (
                <option key={v.id} value={v.id}>
                  {v.size && `${v.size} `}{v.variant && `${v.variant} `}— ₹{(v.price / 100).toFixed(0)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price */}
        <p className="text-3xl sm:text-4xl font-black text-center text-amber-600 mb-6 sm:mb-8">
          ₹{currentPrice}
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(item, selectedVariant)}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-5 sm:py-6 rounded-2xl text-2xl sm:text-3xl font-black shadow-2xl transition transform hover:scale-105 active:scale-100"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}