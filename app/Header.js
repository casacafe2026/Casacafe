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

  const sidebarPosition = pathname === '/' ? 'left-0' : 'right-0'

  return (
    <header className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center bg-[#5C2D1F]">
        {/* Logo / Brand */}
        {pathname !== '/' && (
          <Link
            href="/"
            className="text-3xl sm:text-4xl font-serif tracking-wide text-[#FDF3E7]"
          >
            CASA CAFE
          </Link>
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-lg lg:text-xl font-medium">
          <Link href="/menu" className="transition text-[#FDF3E7]">
            Menu
          </Link>
          <Link href="/menu#special" className="transition text-[#FDF3E7]">
            Today's Special
          </Link>
          <Link href="/menu#combos" className="transition text-[#FDF3E7]">
            Combos
          </Link>

          <Link href="/cart" className="relative">
            <ShoppingCart size={32} className="lg:w-10 lg:h-10 text-[#FDF3E7]" />
            {totalItems > 0 && (
              <span
                className="absolute -top-2 -right-2 rounded-full flex items-center justify-center font-bold text-sm lg:text-base shadow-lg animate-pulse"
                style={{
                  backgroundColor: '#FDF3E7',
                  color: '#5C2D1F',
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
          className="md:hidden text-[#FDF3E7]"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={toggleMobileMenu}
        >
          <div
            className={`fixed ${sidebarPosition} top-0 h-full w-72 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto z-50`}
            style={{
              background:
                'linear-gradient(to bottom right, rgba(92,45,31,0.95), rgba(92,45,31,0.8))',
              backdropFilter: 'blur(14px)',
              color: '#FDF3E7',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pt-14">
              <button
                onClick={toggleMobileMenu}
                className="absolute top-6 right-6 text-[#FDF3E7]"
              >
                <X size={32} />
              </button>

              <nav className="flex flex-col gap-8 mt-6">
                <Link
                  href="/menu"
                  onClick={toggleMobileMenu}
                  className="text-2xl font-medium text-center transition"
                >
                  Menu
                </Link>
                <Link
                  href="/menu#special"
                  onClick={toggleMobileMenu}
                  className="text-2xl font-medium text-center transition"
                >
                  Today's Special
                </Link>
                <Link
                  href="/menu#combos"
                  onClick={toggleMobileMenu}
                  className="text-2xl font-medium text-center transition"
                >
                  Combos
                </Link>

                {/* Cart Button */}
                <Link
                  href="/cart"
                  onClick={toggleMobileMenu}
                  className="flex flex-col items-center gap-3 py-4 rounded-xl transition"
                  style={{ backgroundColor: '#FDF3E7', color: '#5C2D1F' }}
                >
                  <div className="relative">
                    <ShoppingCart size={48} />
                    {totalItems > 0 && (
                      <span
                        className="absolute -top-3 -right-3 rounded-full flex items-center justify-center font-bold text-lg shadow-lg animate-pulse border-2"
                        style={{
                          backgroundColor: '#FDF3E7',
                          color: '#5C2D1F',
                          width: '2.5rem',
                          height: '2.5rem',
                          borderColor: '#5C2D1F',
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
