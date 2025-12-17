// app/combos/page.js
import { supabase } from '../lib/supabase'
import ComboItem from '../ComboItem'
import Header from '../Header'
import FloatingCart from '../FloatingCart'

export default async function CombosPage() {
  const { data: combos } = await supabase
    .from('combos')
    .select('*')

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#2F0F24] text-[#DEBAA2] pt-20">
        <section className="py-16 sm:py-24 lg:py-32 px-6">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-thin text-center mb-16 lg:mb-24 tracking-widest uppercase drop-shadow-2xl">
            Exclusive Combos
          </h1>

          {combos && combos.length === 0 ? (
            <p className="text-center text-2xl text-gray-400">No combos available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
              {combos?.map(combo => (
                <ComboItem key={combo.id} combo={combo} />
              ))}
            </div>
          )}
        </section>
      </main>
      <FloatingCart />
    </>
  )
}