// app/MenuItem.js
'use client'
import { useCart } from './cart-context'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function MenuItem({ item }) {
  const { addToCart } = useCart()
  const [selectedVariant, setSelectedVariant] = useState(null)

  if (!item.item_variants || item.item_variants.length === 0) return null

  useEffect(() => {
    const defaultVariant = item.item_variants.find(v => v.is_default) || item.item_variants[0]
    setSelectedVariant(defaultVariant)
  }, [item])

  const hasMultipleVariants = item.item_variants.length > 1
  const currentPrice = selectedVariant ? (selectedVariant.price / 100).toFixed(0) : 0

  return (
    <div className="w-full">
      {/* Perfect Square Card with Full Image Cover */}
      <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group relative bg-gray-200">
        <Image
          src={item.base_image_url || 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=800'}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          unoptimized
        />

        {/* Special Badge */}
        {item.is_special && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider shadow-xl">
            Special
          </div>
        )}
      </div>

      {/* Content Below — Perfectly Centered */}
      <div className="mt-6 text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 leading-tight">
          {item.name}
        </h3>

        {hasMultipleVariants && (
          <select
            value={selectedVariant?.id || ''}
            onChange={(e) => {
              const variant = item.item_variants.find(v => v.id === Number(e.target.value))
              setSelectedVariant(variant)
            }}
            className="mb-4 px-4 py-2 rounded-full bg-amber-100 text-gray-700 text-sm font-medium border border-amber-300 focus:outline-none focus:border-amber-600 transition w-full max-w-xs"
          >
            {item.item_variants.map(v => (
              <option key={v.id} value={v.id}>
                {v.size && `${v.size} `}{v.variant && v.variant} — ₹{(v.price / 100).toFixed(0)}
              </option>
            ))}
          </select>
        )}

        <p className="text-2xl font-extrabold text-amber-700 mb-5">
          ₹{currentPrice}
        </p>

        <button
          onClick={() => addToCart(item, selectedVariant)}
          className="w-full max-w-xs bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 px-8 rounded-full text-base font-bold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}