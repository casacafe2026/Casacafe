// app/Header.js
'use client'
import { useCart } from './cart-context'
import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const { totalItems } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <header className="bg-gradient-to-r from-amber-700 to-orange-700 text-white sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo / Brand Name - top left, premium font */}
          <Link
            href="/"
            className="text-3xl sm:text-4xl font-bold tracking-wide"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            CASA CAFE
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-lg lg:text-xl font-medium">
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
              <ShoppingCart size={32} className="lg:w-10 lg:h-10" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 lg:w-9 lg:h-9 flex items-center justify-center font-bold text-sm lg:text-base shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        >
          <div
            className="fixed right-0 top-0 h-full w-72 bg-gradient-to-b from-amber-700 to-orange-700 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pt-14">
              <button
                onClick={toggleMobileMenu}
                className="absolute top-6 right-6 text-white"
              >
                <X size={32} />
              </button>

              <nav className="flex flex-col gap-8 mt-6">
                <Link
                  href="/menu"
                  onClick={toggleMobileMenu}
                  className="text-2xl font-medium hover:text-amber-200 transition text-center"
                >
                  Menu
                </Link>
                <Link
                  href="/menu#special"
                  onClick={toggleMobileMenu}
                  className="text-2xl font-medium hover:text-amber-200 transition text-center"
                >
                  Today's Special
                </Link>
                <Link
                  href="/menu#combos"
                  onClick={toggleMobileMenu}
                  className="text-2xl font-medium hover:text-amber-200 transition text-center"
                >
                  Combos
                </Link>

                {/* Cart Button in Mobile Menu */}
                <Link
                  href="/cart"
                  onClick={toggleMobileMenu}
                  className="flex flex-col items-center gap-3 py-4 bg-white/10 rounded-xl hover:bg-white/20 transition"
                >
                  <div className="relative">
                    <ShoppingCart size={48} />
                    {totalItems > 0 && (
                      <span className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg animate-pulse border-2 border-white">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <span className="text-2xl font-medium">Cart</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}