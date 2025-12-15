// app/layout.js
import './globals.css'
import { CartProvider } from './cart-context'
import Header from './Header'  // Your customer navbar

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />  {/* Customer navbar with Menu, Special, Combos, Cart */}
          {children}
        </CartProvider>
      </body>
    </html>
  )
}