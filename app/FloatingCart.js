'use client'

import { useCart } from './cart-context'
import Link from 'next/link'

export default function FloatingCart({ hidden = false }) {
  const { totalItems } = useCart()

  return (
    <Link
      href="/cart"
      className={`
        fixed bottom-8 right-8
        bg-gradient-to-br from-amber-600 to-amber-700
        text-white
        w-20 h-20 sm:w-24 sm:h-24
        rounded-full
        shadow-2xl
        flex flex-col items-center justify-center
        z-50
        border-4 border-white/50
        transition-all duration-500 ease-out
        ${hidden ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100 hover:scale-110'}
      `}
    >
      {/* Cart Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 sm:w-12 sm:h-12 mb-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>

      {/* Cart Count */}
      {totalItems > 0 && (
        <span className="absolute -top-4 -right-4 bg-red-600 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-xl sm:text-2xl shadow-lg animate-pulse border-4 border-white">
          {totalItems}
        </span>
      )}
    </Link>
  )
}
