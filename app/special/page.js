// app/special/page.js
import { supabase } from '../lib/supabase'
import MenuItem from '../MenuItem'
import Header from '../Header'
import FloatingCart from '../FloatingCart'

export default async function SpecialPage() {
  const { data: todaySpecialRaw } = await supabase
    .from('today_special')
    .select('*')

  const todaySpecial = todaySpecialRaw?.map(item => ({
    id: `special-${item.id}`,
    name: item.name,
    base_image_url: item.base_image_url,
    is_special: true,
    item_variants: [{
      id: `special-var-${item.id}`,
      size: null,
      variant: null,
      price: item.price,
      is_default: true
    }]
  })) || []

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#2F0F24] text-[#DEBAA2] pt-20">
        <section className="py-16 sm:py-24 lg:py-32 px-6">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-thin text-center mb-16 lg:mb-24 tracking-widest uppercase drop-shadow-2xl">
            Today's Masterpiece
          </h1>

          {todaySpecial.length === 0 ? (
            <p className="text-center text-2xl text-gray-400">No special items today</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
              {todaySpecial.map(item => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>
      <FloatingCart />
    </>
  )
}