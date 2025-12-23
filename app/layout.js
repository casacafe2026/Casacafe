// app/layout.js
import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import Header from './Header'
import { CartProvider } from './cart-context'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata = {
  title: 'Casa Cafe',
  description: 'Premium Cafe Experience',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
    >
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
