// app/Header.js
'use client'
import { useCart } from './cart-context'
import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const { totalItems } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  // Decide sidebar side based on route
  const sidebarPosition = pathname === '/' ? 'left-0' : 'right-0'

  return (
    <header
      className="sticky top-0 z-50 shadow-2xl"
      style={{ backgroundColor: '#2f0f24', color: '#DCBF98' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo / Brand Name - hide on landing page */}
          {pathname !== '/' && (
            <Link
              href="/"
              className="text-3xl sm:text-4xl font-bold tracking-wide"
              style={{ fontFamily: 'Inter, sans-serif', color: '#DCBF98' }}
            >
              CASA CAFE
            </Link>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-lg lg:text-xl font-medium">
            <Link href="/menu" className="transition" style={{ color: '#DCBF98' }}>
              Menu
            </Link>
            <Link href="/menu#special" className="transition" style={{ color: '#DCBF98' }}>
              Today's Special
            </Link>
            <Link href="/menu#combos" className="transition" style={{ color: '#DCBF98' }}>
              Combos
            </Link>

            <Link href="/cart" className="relative">
              <ShoppingCart size={32} className="lg:w-10 lg:h-10" style={{ color: '#DCBF98' }} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-2 -right-2 rounded-full flex items-center justify-center font-bold text-sm lg:text-base shadow-lg animate-pulse"
                  style={{
                    backgroundColor: '#DCBF98',
                    color: '#2f0f24',
                    width: '1.75rem',
                    height: '1.75rem',
                  }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden"
            aria-label="Toggle menu"
            style={{ color: '#DCBF98' }}
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
            className={`fixed ${sidebarPosition} top-0 h-full w-72 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto`}
            style={{ backgroundColor: '#2f0f24', color: '#DCBF98' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pt-14">
              <button
                onClick={toggleMobileMenu}
                className="absolute top-6 right-6"
                style={{ color: '#DCBF98' }}
              >
                <X size={32} />
              </button>

              <nav className="flex flex-col gap-8 mt-6">
                <Link
                  href="/menu"
                  onClick={toggleMobileMenu}
                  className="text-2xl font-medium text-center transition"
                  style={{ color: '#DCBF98' }}
                >
                  Menu
                </Link>
                <Link
                  href="/menu#special"
                  onClick={toggleMobileMenu}
                  className="text-2xl font-medium text-center transition"
                  style={{ color: '#DCBF98' }}
                >
                  Today's Special
                </Link>
                <Link
                  href="/menu#combos"
                  onClick={toggleMobileMenu}
                  className="text-2xl font-medium text-center transition"
                  style={{ color: '#DCBF98' }}
                >
                  Combos
                </Link>

                {/* Cart Button in Mobile Menu */}
                <Link
                  href="/cart"
                  onClick={toggleMobileMenu}
                  className="flex flex-col items-center gap-3 py-4 rounded-xl transition"
                  style={{ backgroundColor: '#DCBF98', color: '#2f0f24' }}
                >
                  <div className="relative">
                    <ShoppingCart size={48} />
                    {totalItems > 0 && (
                      <span
                        className="absolute -top-3 -right-3 rounded-full flex items-center justify-center font-bold text-lg shadow-lg animate-pulse border-2"
                        style={{
                          backgroundColor: '#DCBF98',
                          color: '#2f0f24',
                          width: '2.5rem',
                          height: '2.5rem',
                          borderColor: '#2f0f24',
                        }}
                      >
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