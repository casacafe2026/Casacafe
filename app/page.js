// app/page.js
import { supabase } from './lib/supabase'
import MenuItem from './MenuItem'
import Link from 'next/link'
import Image from 'next/image'
import FloatingCart from './FloatingCart'

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
    <main className="min-h-screen bg-[#2F0F24] text-[#DEBAA2]">
      {/* MINIMAL TOP SECTION — SMALLER BUTTON + BORDERED FRAME */}
      <section className="flex flex-col items-center justify-center px-6 pt-12 pb-20 md:pt-16 md:pb-24 lg:pt-20 lg:pb-28">
        <div className="w-full max-w-7xl mx-auto text-center">
          {/* BIG LOGO */}
          <div className="mb-10 md:mb-12 lg:mb-16">
            <div className="relative w-72 h-72 xs:w-80 xs:h-80 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] lg:w-[36rem] lg:h-[36rem] xl:w-[44rem] xl:h-[44rem] mx-auto">
              <Image
                src="/logo.png"
                alt="CASA CAFÉ"
                fill
                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
          </div>

          {/* SMALLER & ELEGANT BUTTON */}
          <Link
            href="/menu"
            className="inline-block bg-[#DEBAA2] hover:bg-[#e8c9b8] text-[#2F0F24] px-12 py-6 sm:px-16 sm:py-8 md:px-20 md:py-10 rounded-full text-2xl sm:text-3xl md:text-4xl font-light tracking-widest shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 border-4 border-[#DEBAA2]/60"
          >
            Discover the Menu
          </Link>
        </div>
      </section>

      {/* TODAY'S SPECIAL — WITH GOLD BORDER */}
      {specialItems.length > 0 && (
        <section className="py-16 sm:py-24 lg:py-32 px-6 bg-[#3a1a30] border-t-4 border-b-4 border-[#DEBAA2]/40">
          <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-thin text-center text-[#DEBAA2] mb-12 sm:mb-16 lg:mb-24 drop-shadow-2xl tracking-widest uppercase">
            Today's Masterpiece
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"> {/* Equal columns + gap */}
  {menuItems.map((item) => (
    <MenuItem key={item.id} item={item} />
  ))}
</div>
        </section>
      )}

      {/* CATEGORIES PREVIEW — WITH GOLD BORDERS */}
      <section className="py-16 sm:py-24 lg:py-32 px-6 bg-[#2F0F24]/90 border-t-4 border-[#DEBAA2]/30">
        <div className="max-w-7xl mx-auto space-y-20 sm:space-y-28 lg:space-y-36">
          {categories?.map(category => {
            const regularItems = category.items?.filter(i => !i.is_special) || []

            if (regularItems.length === 0) return null

            return (
              <div key={category.id} className="border-b-2 border-[#DEBAA2]/20 pb-20 last:border-b-0 last:pb-0">
                <h3 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-thin text-center text-[#DEBAA2] mb-12 sm:mb-16 lg:mb-20 tracking-widest uppercase drop-shadow-xl">
                  {category.name}
                </h3>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
                  {regularItems.slice(0, 6).map(item => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* FLOATING CART */}
      <FloatingCart />
    </main>
  )
}