// app/layout.js
import './globals.css'
import { Inter, Great_Vibes } from 'next/font/google'
import Header from './Header'
import { CartProvider } from './cart-context'

// Body / general text font
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

// Brand / header font (calligraphy / bold)
const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400', // scripts usually use 400
  variable: '--font-greatvibes',
  display: 'swap',
})

export const metadata = {
  title: 'Casa Cafe',
  description: 'Premium Cafe Experience',
}

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${greatVibes.variable}`} lang="en">
      <body className="font-[var(--font-inter)] bg-white text-[#0f2e2a]">
        <CartProvider>
          {/* Customer navbar with Menu, Special, Combos, Cart */}
          <Header />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  )
}
