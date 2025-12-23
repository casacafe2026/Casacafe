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

  /* PARALLAX LOGIC */
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [-18, 18])

  return (
    <motion.div
      className="h-full"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* CARD */}
      <div className="
        h-full flex flex-col
        bg-white
        border border-black/10
        rounded-lg
        overflow-hidden
      ">
        {/* IMAGE — 70% */}
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
              className="object-cover"
              unoptimized
            />
          </motion.div>

          {item.is_special && (
            <span className="
              absolute top-3 left-3
              bg-[#e6c48f]
              text-[#0f2e2a]
              px-3 py-1
              text-xs font-semibold uppercase tracking-wide
            ">
              Signature
            </span>
          )}
        </div>

        {/* CONTENT — 30% */}
        <div className="
          flex-[3]
          p-3
          bg-white
          rounded-b-xl
          flex flex-col
        ">
          {/* ITEM NAME */}
          <h3 className="
            font-serif
            text-[14px] sm:text-[15px]
            text-[#0f2e2a]
            leading-tight
            mb-1
            break-words
          ">
            {item.name}
          </h3>

          {/* DESCRIPTION */}
          {item.description && (
            <p className="
              text-[11px]
              text-gray-600
              leading-snug
              mb-2
              line-clamp-2
            ">
              {item.description}
          </p>
          )}

          {/* VARIANTS — UNDERLINE ANIMATION */}
          {hasMultipleVariants && (
            <div className="flex gap-3 mb-3 relative">
              {item.item_variants.map(v => {
                const isSelected = selectedVariant?.id === v.id

                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`
                      relative pb-1
                      text-[11px] sm:text-xs
                      transition-colors
                      ${
                        isSelected
                          ? 'text-[#0f2e2a] font-semibold'
                          : 'text-gray-500 hover:text-[#0f2e2a]'
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
                          w-full h-[1.5px]
                          bg-[#0f2e2a]
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
              onClick={() => addToCart(item, selectedVariant)}
              className="
                border border-[#0f2e2a]
                text-[#0f2e2a]
                px-3 py-1.5
                text-[11px] font-semibold
                rounded-md
                flex items-center gap-1.5
                hover:bg-[#0f2e2a]
                hover:text-[#e6c48f]
                transition
                whitespace-nowrap
              "
            >
              <ShoppingCart size={13} />
              Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
