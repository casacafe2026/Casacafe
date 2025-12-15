// app/Header.js
'use client'
import { useCart } from './cart-context'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

export default function Header() {
  const { totalItems } = useCart()

  return (
    <header className="bg-gradient-to-r from-amber-700 to-orange-700 text-white sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-5xl font-black tracking-wide">
            CASA CAFE&apos;
          </Link>

          <nav className="flex items-center gap-12 text-2xl font-bold">
            <Link href="/menu" className="hover:text-amber-200 transition">
              Menu
            </Link>
            <Link href="/menu#special" className="hover:text-amber-200 transition">
              Today's Special
            </Link>
            <Link href="/menu#combos" className="hover:text-amber-200 transition">
              Combos
            </Link>

            <Link href="/cart" className="relative">
              <ShoppingCart size={48} />
              {totalItems > 0 && (
                <span className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-2xl shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}