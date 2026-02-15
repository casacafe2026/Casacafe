// app/layout.js
import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import Header from './Header'
import { CartProvider } from './cart-context'
import ClientToastWrapper from './ClientToastWrapper'  // ← NEW client wrapper

// Body / general text font
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

// Brand / header font
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-brand',
  display: 'swap',
})

export const metadata = {
  title: 'Casa Cafe',
  description: 'Serving Happiness',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-[var(--font-inter)] bg-white text-[#0f2e2a]">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <ClientToastWrapper />  {/* ← Toast is now safe (client-only) */}
        </CartProvider>
      </body>
    </html>
  )
}
