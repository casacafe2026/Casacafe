// app/page.js
import { supabase } from './lib/supabase'
import MenuItem from './MenuItem'
import Link from 'next/link'
import Image from 'next/image'
import FloatingCart from './FloatingCart'  // ← Floating cart component

export default async function Home() {
  const { data: categories } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      items (
        id,
        name,
        base_image_url,
        is_special,
        item_variants (
          id,
          size,
          variant,
          price,
          is_default
        )
      )
    `)
    .order('display_order')

  const specialItems = categories
    ?.flatMap(cat => cat.items || [])
    .filter(item => item.is_special) || []

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-amber-950 text-white">
      {/* LUXURY HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-cafe.jpg"  // Your luxury cafe photo in public/
            alt="CASA CAFÉ Interior"
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-amber-900/40 to-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Luxury Brand Logo */}
          <div className="mb-10">
            <div className="relative w-56 h-56 xs:w-64 xs:h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto">
              <Image
                src="/logo.png"  // Your elegant logo in public/logo.png
                alt="CASA CAFÉ"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-thin tracking-widest text-white mb-6 drop-shadow-2xl uppercase">
            Casa Café
          </h1>
          <p className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-200 font-light mb-12 drop-shadow-lg tracking-wide italic">
            Where Elegance Meets Flavor
          </p>

          <Link
            href="/menu"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-12 py-6 sm:px-20 sm:py-8 md:px-24 md:py-10 rounded-full text-2xl sm:text-3xl md:text-4xl font-light tracking-wider shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 border-2 border-white/30"
          >
            Discover the Menu
          </Link>
        </div>
      </section>

      {/* TODAY'S SPECIAL */}
      {specialItems.length > 0 && (
        <section className="py-20 sm:py-32 px-6 bg-gradient-to-r from-amber-900 to-amber-800">
          <h2 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-thin text-center text-white mb-16 sm:mb-24 drop-shadow-2xl tracking-widest uppercase">
            Today's Masterpiece
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
            {specialItems.map(item => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* CATEGORIES PREVIEW */}
      <section className="py-20 sm:py-32 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto space-y-32 sm:space-y-48">
          {categories?.map(category => {
            const regularItems = category.items?.filter(i => !i.is_special) || []

            if (regularItems.length === 0) return null

            return (
              <div key={category.id}>
                <h3 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-thin text-center text-amber-900 mb-16 sm:mb-24 tracking-widest uppercase">
                  {category.name}
                </h3>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-12 md:gap-16">
                  {regularItems.slice(0, 6).map(item => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* FLOATING CART — VISIBLE ON THIS PAGE */}
      <FloatingCart />
    </main>
  )
}