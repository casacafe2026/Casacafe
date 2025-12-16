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
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-4xl sm:text-5xl font-black tracking-wide">
            CASA CAFE
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10 lg:gap-12 text-xl lg:text-2xl font-bold">
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
              <ShoppingCart size={40} className="lg:w-12 lg:h-12" />
              {totalItems > 0 && (
                <span className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-9 h-9 lg:w-12 lg:h-12 flex items-center justify-center font-bold text-lg lg:text-2xl shadow-lg animate-pulse">
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
            {isMobileMenuOpen ? <X size={40} /> : <Menu size={40} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Menu — Beautiful Cart Alignment */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMobileMenu}>
          <div
            className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-amber-700 to-orange-700 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 pt-16">
              <button
                onClick={toggleMobileMenu}
                className="absolute top-8 right-8 text-white"
              >
                <X size={40} />
              </button>

              <nav className="flex flex-col gap-10 mt-8">
                <Link 
                  href="/menu" 
                  onClick={toggleMobileMenu} 
                  className="text-3xl font-bold hover:text-amber-200 transition text-center"
                >
                  Menu
                </Link>
                <Link 
                  href="/menu#special" 
                  onClick={toggleMobileMenu} 
                  className="text-3xl font-bold hover:text-amber-200 transition text-center"
                >
                  Today's Special
                </Link>
                <Link 
                  href="/menu#combos" 
                  onClick={toggleMobileMenu} 
                  className="text-3xl font-bold hover:text-amber-200 transition text-center"
                >
                  Combos
                </Link>

                {/* Beautiful Cart Button in Mobile Menu */}
                <Link 
                  href="/cart" 
                  onClick={toggleMobileMenu} 
                  className="flex flex-col items-center gap-4 py-6 bg-white/10 rounded-2xl hover:bg-white/20 transition"
                >
                  <div className="relative">
                    <ShoppingCart size={60} />
                    {totalItems > 0 && (
                      <span className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-14 h-14 flex items-center justify-center font-extrabold text-2xl shadow-2xl animate-pulse border-4 border-white">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <span className="text-3xl font-bold">Cart</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}