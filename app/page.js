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

  const specialItems =
    categories?.flatMap(cat => cat.items || []).filter(item => item.is_special) || []

  return (
    <main className="min-h-screen bg-[#2F0F24] text-[#DEBAA2]">
      {/* TOP SECTION — Bigger Logo, Smaller Button */}
      {/* HERO SECTION */}
<section className="relative flex flex-col items-center justify-center px-6 pt-16 pb-24 lg:pt-24 lg:pb-32 
  bg-gradient-to-r from-[#2F0F24] via-[#3a1a30] to-[#2F0F24] animate-[gradient_15s_ease_infinite]">

  {/* Radial Glow Behind Logo */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-[30rem] h-[30rem] rounded-full bg-[#DEBAA2]/10 blur-3xl"></div>
  </div>

  <div className="w-full max-w-7xl mx-auto text-center relative z-10">
    {/* BIGGER LOGO */}
    <div className="mb-12 lg:mb-20">
      <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[30rem] md:h-[30rem] lg:w-[40rem] lg:h-[40rem] xl:w-[48rem] xl:h-[48rem] mx-auto">
        <Image
          src="/logo.png"
          alt="CASA CAFÉ"
          fill
          className="object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105 hover:rotate-1"
          priority
        />
      </div>
    </div>

    {/* BUTTON WITH PULSE/GLOW */}
    <Link
      href="/menu"
      className="inline-block bg-[#DEBAA2] hover:bg-[#e8c9b8] text-[#2F0F24] px-10 py-4 sm:px-12 sm:py-5 md:px-14 md:py-6 
        rounded-full text-lg sm:text-xl md:text-2xl font-semibold tracking-widest shadow-xl border-2 border-[#DEBAA2]/60
        transition-all duration-500 hover:scale-105 animate-pulse"
    >
      Discover the Menu
    </Link>

    {/* Scroll Cue Arrow */}
    <div className="mt-10 flex justify-center">
      <svg
        className="w-8 h-8 text-[#DEBAA2] animate-bounce"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</section>

      {/* TODAY'S SPECIAL — GOLD BORDER */}
      {specialItems.length > 0 && (
        <section className="py-16 sm:py-24 lg:py-32 px-6 bg-[#3a1a30] border-t-4 border-b-4 border-[#DEBAA2]/40">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-thin text-center text-[#DEBAA2] mb-16 lg:mb-24 drop-shadow-2xl tracking-widest uppercase">
            Today's Masterpiece
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {specialItems.map(item => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* CATEGORIES PREVIEW */}
      <section className="py-16 sm:py-24 lg:py-32 px-6 bg-[#2F0F24]/90 border-t-4 border-[#DEBAA2]/30">
        <div className="max-w-7xl mx-auto space-y-20 sm:space-y-28 lg:space-y-36">
          {categories?.map(category => {
            const regularItems = category.items?.filter(i => !i.is_special) || []
            if (regularItems.length === 0) return null

            return (
              <div
                key={category.id}
                className="border-b-2 border-[#DEBAA2]/20 pb-20 last:border-b-0 last:pb-0"
              >
                <h3 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-thin text-center text-[#DEBAA2] mb-16 lg:mb-20 tracking-widest uppercase drop-shadow-xl">
                  {category.name}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
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