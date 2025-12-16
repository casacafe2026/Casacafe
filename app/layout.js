// app/layout.js
import './globals.css'
import { Inter } from 'next/font/google'
import Header from './Header'
import { CartProvider } from './cart-context'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata = {
  title: 'Casa Cafe',
  description: 'Premium Cafe Experience',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {/* Customer navbar with Menu, Special, Combos, Cart */}
          <Header />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  )
}