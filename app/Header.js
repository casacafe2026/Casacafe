'use client'

import { useCart } from './cart-context'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const { totalItems } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const sidebarPosition = pathname === '/' ? 'left-0' : 'right-0'

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto'
  }, [isMobileMenuOpen])

  return (
    <header className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center bg-[#4f193c]">

        {/* BRAND LOGO */}
        {pathname !== '/' && (
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition"
            aria-label="Casa Cafe Home"
          >
            <div className="relative w-48 sm:w-58 lg:w-56 h-10 sm:h-12 lg:h-14">
   
              <Image
                src="/brand-logo.png"   // <-- your brand logo
                alt="Casa Cafe"
                fill
                priority
                className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
              />
            </div>
          </Link>
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-lg lg:text-xl font-medium">
          <Link href="/menu" className="text-[#FDF3E7] hover:text-amber-200 transition">
            Menu
          </Link>
          <Link href="/special" className="text-[#FDF3E7] hover:text-amber-200 transition">
            Today's Special
          </Link>
          <Link href="/combos" className="text-[#FDF3E7] hover:text-amber-200 transition">
            Combos
          </Link>

          <Link href="/cart" className="relative">
            <ShoppingCart size={32} className="lg:w-10 lg:h-10 text-[#FDF3E7]" />
            {totalItems > 0 && (
              <span
                className="absolute -top-2 -right-2 rounded-full flex items-center justify-center font-bold text-sm lg:text-base shadow-lg animate-pulse"
                style={{
                  backgroundColor: '#FDF3E7',
                  color: '#4f193c',
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
          aria-expanded={isMobileMenuOpen}
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
            role="dialog"
            aria-modal="true"
            className={`fixed ${sidebarPosition} top-0 h-full w-72 shadow-2xl z-50`}
            style={{
              background:
                'linear-gradient(to bottom right, rgba(79,25,60,0.95), rgba(79,25,60,0.85))',
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
                <Link href="/menu" onClick={toggleMobileMenu} className="text-2xl text-center hover:text-amber-200">
                  Menu
                </Link>
                <Link href="/special" onClick={toggleMobileMenu} className="text-2xl text-center hover:text-amber-200">
                  Today's Special
                </Link>
                <Link href="/combos" onClick={toggleMobileMenu} className="text-2xl text-center hover:text-amber-200">
                  Combos
                </Link>

                <Link
                  href="/cart"
                  onClick={toggleMobileMenu}
                  className="flex flex-col items-center gap-3 py-4 rounded-xl mt-6"
                  style={{ backgroundColor: '#FDF3E7', color: '#4f193c' }}
                >
                  <div className="relative">
                    <ShoppingCart size={48} />
                    {totalItems > 0 && (
                      <span
                        className="absolute -top-3 -right-3 rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-2 animate-pulse"
                        style={{
                          backgroundColor: '#FDF3E7',
                          color: '#4f193c',
                          width: '2.5rem',
                          height: '2.5rem',
                          borderColor: '#4f193c',
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
