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
      {/* Equal box with flex column */}
      <div className="flex flex-col h-full rounded-2xl overflow-hidden border-2 border-[#DCBF98]/30 hover:border-[#DCBF98]/70 transition-all duration-500 shadow-md hover:shadow-xl">
        {/* Image fixed ratio */}
        <div className="aspect-square relative">
          <Image
            src={item.base_image_url || 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=800'}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-90"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            unoptimized
          />
          {item.is_special && (
            <div className="absolute top-3 right-3 bg-[#DCBF98] text-[#2F0F24] px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg border border-[#2F0F24]/50">
              Special
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="flex flex-col flex-grow justify-between p-4 bg-[#2F0F24] text-center">
          <div>
            <h3 className="text-base lg:text-lg font-bold text-[#DCBF98] mb-2 line-clamp-2">
              {item.name}
            </h3>

            {hasMultipleVariants && (
              <select
                value={selectedVariant?.id || ''}
                onChange={(e) => {
                  const variant = item.item_variants.find(v => v.id === Number(e.target.value))
                  setSelectedVariant(variant)
                }}
                className="mb-3 px-3 py-2 rounded-full bg-[#DCBF98]/15 text-[#DCBF98] text-xs lg:text-sm font-medium border border-[#DCBF98]/40 focus:outline-none focus:border-[#DCBF98] transition w-full"
              >
                {item.item_variants.map(v => (
                  <option key={v.id} value={v.id} className="bg-[#2F0F24] text-[#DCBF98]">
                    {v.size && `${v.size} `}{v.variant && v.variant} — ₹{(v.price / 100).toFixed(0)}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Price + Button aligned consistently */}
          <div>
            <p className="text-xl lg:text-2xl font-extrabold text-[#DCBF98] mb-4">
              ₹{currentPrice}
            </p>
            <button
              onClick={() => addToCart(item, selectedVariant)}
              className="w-full bg-[#DCBF98] hover:bg-[#e8c9b8] text-[#2F0F24] py-3 px-6 rounded-full text-sm lg:text-base font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-300 border border-[#DCBF98]/50"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}