// app/ClientHome.js
'use client'
import { useCart } from './cart-context'
import Link from 'next/link'
import Image from 'next/image'
import MenuItem from './MenuItem'
import { useEffect } from 'react'

export default function ClientHome({ categories, specialItems }) {
  const { setTakeawayFee } = useCart()
  const orderType = useCart().takeawayFee > 0 ? 'takeaway' : 'dine-in'

  const toggleOrderType = () => {
    setTakeawayFee(orderType === 'dine-in' ? 1000 : 0)  // ₹10 = 1000 paise
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-amber-950 text-white">
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/hero.jpg"  // Put your cafe photo in public/hero.jpg
          alt="CASA CAFÉ"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="relative z-10 text-center px-6">
          <div className="mb-8">
            <Image src="/logo.png" alt="CASA CAFÉ" width={300} height={300} className="mx-auto drop-shadow-2xl" />
          </div>
          <h1 className="text-6xl md:text-8xl font-thin tracking-widest mb-6">CASA CAFÉ</h1>
          <p className="text-2xl md:text-4xl font-light mb-12 italic">Exquisite Flavors • Timeless Elegance</p>

          {/* DINE-IN / TAKEAWAY TOGGLE */}
          <div className="mb-12">
            <div className="inline-flex rounded-full bg-white/10 backdrop-blur p-2">
              <button
                onClick={toggleOrderType}
                className={`px-10 py-4 rounded-full text-xl font-medium transition ${orderType === 'dine-in' ? 'bg-amber-600 text-white' : 'text-amber-200'}`}
              >
                Dine-In
              </button>
              <button
                onClick={toggleOrderType}
                className={`px-10 py-4 rounded-full text-xl font-medium transition ${orderType === 'takeaway' ? 'bg-amber-600 text-white' : 'text-amber-200'}`}
              >
                Takeaway {orderType === 'takeaway' && '(+₹10)'}
              </button>
            </div>
          </div>

          <Link href="/menu" className="inline-block bg-amber-600 hover:bg-amber-700 px-16 py-6 rounded-full text-3xl font-light tracking-wider shadow-2xl">
            Explore Menu
          </Link>
        </div>
      </section>

      {/* TODAY'S SPECIAL */}
      {specialItems.length > 0 && (
        <section className="py-20 px-6">
          <h2 className="text-5xl md:text-7xl font-thin text-center mb-16 tracking-widest uppercase">Chef's Special</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {specialItems.map(item => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* CATEGORY PREVIEW */}
      <section className="py-20 px-6 bg-black/50">
        <div className="max-w-7xl mx-auto space-y-32">
          {categories.map(category => {
            const regularItems = category.items?.filter(i => !i.is_special) || []
            if (regularItems.length === 0) return null
            return (
              <div key={category.id}>
                <h3 className="text-4xl md:text-6xl font-thin text-center mb-16 tracking-widest uppercase">
                  {category.name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                  {regularItems.slice(0, 4).map(item => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}