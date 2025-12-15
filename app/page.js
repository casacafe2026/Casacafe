// app/page.js
import { supabase } from './lib/supabase'
import MenuItem from './MenuItem'
import Link from 'next/link'

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
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-700/95 to-orange-800/95" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white mb-6 drop-shadow-2xl">
            CASA CAFÉ
          </h1>
          <p className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-100 font-medium mb-10 md:mb-14 drop-shadow-lg tracking-wide">
            Fresh • Fast • Delicious
          </p>
          <Link
            href="/menu"
            className="inline-block bg-white text-amber-800 px-10 py-5 sm:px-16 sm:py-7 md:px-20 md:py-10 rounded-full text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
          >
            VIEW MENU
          </Link>
        </div>
      </section>

      {/* TODAY'S SPECIAL */}
      {specialItems.length > 0 && (
        <section className="py-16 sm:py-24 px-6 bg-gradient-to-r from-amber-700 to-orange-700">
          <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-center text-white mb-12 sm:mb-16 drop-shadow-2xl tracking-tight">
            TODAY'S SPECIAL
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {specialItems.map(item => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* CATEGORIES + ITEMS ON LANDING */}
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-24 sm:space-y-32">
          {categories?.map(category => {
            const regularItems = category.items?.filter(i => !i.is_special) || []

            if (regularItems.length === 0) return null

            return (
              <div key={category.id}>
                <h3 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-extrabold text-center text-amber-900 mb-12 sm:mb-16 tracking-tight">
                  {category.name.toUpperCase()}
                </h3>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10">
                  {regularItems.map(item => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* FLOATING CART */}
      <Link
        href="/cart"
        className="fixed bottom-6 right-6 bg-amber-700 text-white w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold z-50 hover:scale-110 hover:bg-amber-800 transition-all duration-300"
      >
        <span className="hidden xs:inline">Cart</span>
        <span className="xs:hidden">🛒</span>
      </Link>
    </main>
  )
}