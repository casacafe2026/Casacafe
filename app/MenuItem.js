'use client'

import { useCart } from './cart-context'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { ShoppingCart } from 'lucide-react'
import {
  motion,
  useScroll,
  useTransform
} from 'framer-motion'

export default function MenuItem({ item }) {
  const { addToCart } = useCart()
  const [selectedVariant, setSelectedVariant] = useState(null)
  const imageRef = useRef(null)

  if (!item.item_variants || item.item_variants.length === 0) return null

  useEffect(() => {
    const defaultVariant =
      item.item_variants.find(v => v.is_default) || item.item_variants[0]
    setSelectedVariant(defaultVariant)
  }, [item])

  const hasMultipleVariants = item.item_variants.length > 1
  const currentPrice = selectedVariant
    ? (selectedVariant.price / 100).toFixed(0)
    : 0

  const isOutOfStock = item.is_out_of_stock === true

  /* PARALLAX LOGIC */
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [-18, 18])

  return (
    <motion.div
      className="h-full"
      whileHover={!isOutOfStock ? { y: -3 } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* CARD */}
      <div className={`
        relative h-full flex flex-col
        bg-white
        border border-black/10
        rounded-xl
        shadow-lg
        overflow-hidden
      `}>
        {/* IMAGE */}
        <div
          ref={imageRef}
          className="relative aspect-square flex-[7] overflow-hidden"
        >
          <motion.div
            style={{ y }}
            className="absolute inset-0"
          >
            <Image
              src={
                item.base_image_url ||
                'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=800'
              }
              alt={item.name}
              fill
              className={`object-cover rounded-t-xl ${isOutOfStock ? 'brightness-75' : ''}`}
              unoptimized
            />
          </motion.div>

          {item.is_special && (
            <span className="
              absolute top-3 left-3
              bg-yellow-200
              text-[#0f2e2a]
              px-3 py-1
              text-xs font-semibold uppercase tracking-wide
              rounded-md
              shadow-sm
            ">
              Signature
            </span>
          )}

          {isOutOfStock && (
            <div className="
              absolute top-2 right-2
              bg-red-600 bg-opacity-90
              text-white text-xs sm:text-sm
              font-bold px-2 py-1
              rounded-md
              shadow-md
              z-10
            ">
              OUT OF STOCK
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className={`
          flex-[3]
          p-4
          bg-white
          flex flex-col
          ${isOutOfStock ? 'opacity-80' : ''}
        `}>
          <h3 className="
            font-serif
            text-[14px] sm:text-[15px]
            text-[#0f2e2a]
            leading-tight
            mb-2
            break-words
          ">
            {item.name}
          </h3>

          {item.description && (
            <p className="
              text-[11px]
              text-gray-500
              leading-snug
              mb-3
              line-clamp-2
            ">
              {item.description}
            </p>
          )}

          {/* VARIANTS - OPTION 2 */}
          {hasMultipleVariants && !isOutOfStock && (
            <div className="flex flex-wrap gap-2 mb-4">
              {item.item_variants.map(v => {
                const isSelected = selectedVariant?.id === v.id
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`
                      relative px-3 py-1.5 text-xs font-semibold tracking-tight
                      transition-all duration-200 rounded-md
                      ${isSelected
                        ? 'bg-[#0f2e2a] text-white shadow-md -translate-y-1'
                        : 'bg-white border border-gray-400 text-[#0f2e2a] hover:border-[#0f2e2a] hover:bg-gray-50'
                      }
                    `}
                  >
                    {v.size && `${v.size} `}
                    {v.variant}

                    {isSelected && (
                      <motion.span
                        layoutId={`variant-underline-${item.id}`}
                        className="
                          absolute left-0 -bottom-0.5
                          w-full h-[2px]
                          bg-white
                          rounded-full
                        "
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-auto flex items-center justify-between gap-2">
            <motion.p
              key={currentPrice}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-sm font-semibold text-[#0f2e2a]"
            >
              ₹{currentPrice}
            </motion.p>

            <button
              onClick={() => !isOutOfStock && addToCart(item, selectedVariant)}
              disabled={isOutOfStock}
              className={`
                border px-3 py-1.5 text-[11px] font-semibold rounded-md
                flex items-center gap-1.5 transition whitespace-nowrap
                ${isOutOfStock
                  ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'border-[#0f2e2a] text-[#0f2e2a] hover:bg-[#0f2e2a] hover:text-[#f3d999]'
                }
              `}
            >
              <ShoppingCart size={13} />
              {isOutOfStock ? 'Unavailable' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}