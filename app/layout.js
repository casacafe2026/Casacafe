// app/layout.js
import './globals.css'
import { Playfair_Display } from 'next/font/google'
import Header from './Header'
import { CartProvider } from './cart-context'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata = {
  title: 'Casa Cafe',
  description: 'Premium Cafe Experience',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={playfair.className}>
        <CartProvider>
          {/* Customer navbar with Menu, Special, Combos, Cart */}
          <Header />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  )
}