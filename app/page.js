'use client'

import { supabase } from './lib/supabase'
import MenuItem from './MenuItem'
import Link from 'next/link'
import Image from 'next/image'
import FloatingCart from './FloatingCart'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { BsCupHot } from 'react-icons/bs'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [topSelling, setTopSelling] = useState([])
  const [recommended, setRecommended] = useState([])
  const [combos, setCombos] = useState([])
  const heroRef = useRef(null)
  const [hideFloatingCart, setHideFloatingCart] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: categoriesData } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          items (
            id,
            name,
            description,
            base_image_url,
            is_special,
            is_out_of_stock,
            is_top_selling,
            is_recommended,
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

      const { data: combosData } = await supabase
        .from('combos')
        .select('*')
        .order('id')

      if (categoriesData) {
        setCategories(categoriesData)
        const allItems = categoriesData.flatMap(cat => cat.items || [])
        setTopSelling(allItems.filter(i => i.is_top_selling && !i.is_out_of_stock))
        setRecommended(allItems.filter(i => i.is_recommended && !i.is_out_of_stock))
      }

      setCombos(combosData || [])
    }

    fetchData()

    const channel = supabase
      .channel('landing-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'combos' }, fetchData)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHideFloatingCart(entry.isIntersecting),
      { threshold: 0.4 }
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  const specialItems = categories
    .flatMap(cat => cat.items || [])
    .filter(i => i.is_special && !i.is_out_of_stock)

  const SectionHeader = ({ title, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="mb-8"
    >
      <div className="flex items-center gap-3">
        <div className="h-px w-10 bg-[#d4af7f]" />
        <span className="uppercase tracking-[0.3em] text-[10px] text-[#d4af7f]">
          {subtitle}
        </span>
      </div>
      <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extralight text-[#4f193c]">
        {title}
      </h2>
    </motion.div>
  )

  const ItemCarousel = ({ title, subtitle, items }) => {
    if (!items.length) return null

    return (
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[#fff8f0]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title={title} subtitle={subtitle} />

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 sm:gap-4 md:gap-5 pb-2">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-[62vw] sm:w-[38vw] md:w-[26vw] lg:w-[22vw] xl:w-[20vw]"
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(79,25,60,0.1)]"
                  >
                    <MenuItem item={item} />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  const ComboCarousel = () => {
    if (!combos.length) return null

    return (
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[#fdf8f6]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Combo Deals" subtitle="Save More" />

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 sm:gap-6 md:gap-8 pb-4">
              {combos.map(combo => (
                <div
                  key={combo.id}
                  className="flex-shrink-0 w-[75vw] sm:w-[50vw] md:w-[35vw] lg:w-[30vw] xl:w-[26vw]"
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.4 }}
                    className="bg-gradient-to-br from-amber-50 to-white rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(79,25,60,0.12)]"
                  >
                    {combo.base_image_url ? (
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={combo.base_image_url}
                          alt={combo.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute top-3 right-3 bg-green-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                          COMBO
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-lg">Combo Image</span>
                      </div>
                    )}

                    <div className="p-6 text-center">
                      <h3 className="text-2xl font-bold text-[#4f193c] mb-2">
                        {combo.name}
                      </h3>
                      {combo.description && (
                        <p className="text-gray-600 text-sm mb-4">{combo.description}</p>
                      )}
                      <p className="text-4xl font-black text-green-600">
                        ₹{(combo.price / 100).toFixed(0)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 mb-6">
                        Includes {combo.item_ids?.length || 0} items
                      </p>

                      {/* VIEW BUTTON */}
                      <Link
                        href={`/combos#combo-${combo.id}`}
                        className="inline-block bg-[#4f193c] hover:bg-[#3d1430] text-white px-8 py-3 rounded-full font-semibold text-lg transition duration-300 shadow-lg hover:shadow-xl"
                      >
                        View Combo
                      </Link>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* VIEW ALL COMBOS BUTTON */}
          <div className="text-center mt-10">
            <Link
              href="/combos"
              className="inline-block bg-[#d4af7f] hover:bg-[#c4996c] text-[#4f193c] px-10 py-4 rounded-full font-bold text-lg tracking-wide transition duration-300 shadow-lg hover:shadow-xl"
            >
              View All Combos →
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* HERO */}
      {/* HERO */}
<section ref={heroRef} className="relative min-h-screen flex flex-col items-center bg-gradient-to-b from-[#4f193c] via-[#3a122d] to-[#1a0a14] overflow-hidden pt-20" >
      {/* Logo - slightly bigger */}
      <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: "easeOut" }} className="relative z-10 -translate-y-12 md:-translate-y-20" >
        <div className="w-[75vw] h-[75vw] sm:w-[55vw] sm:h-[55vw] md:w-[34rem] md:h-[34rem] lg:w-[44rem] lg:h-[44rem] mx-auto">
          <Image src="/logo.png" alt="CASA CAFÉ" fill priority className="object-contain drop-shadow-[0_40px_120px_rgba(0,0,0,0.55)]" />
        </div>
      </motion.div>

      {/* Premium Button - smaller */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }} className="relative z-10 -translate-y-6" >
        <Link href="/menu" className=" group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-base md:text-lg font-serif text-[#d4af7f] rounded-full border-2 border-[#d4af7f]/50 transition-all duration-500 hover:border-[#d4af7f] hover:shadow-[0_0_40px_rgba(212,175,127,0.7)] hover:scale-105 " >
          <BsCupHot className="text-[#d4af7f] text-lg md:text-xl" />
          <span className="capitalize">Explore menu</span>
        </Link>
      </motion.div>
    </section>

      {/* TOP SELLING */}
      <ItemCarousel title="Top Selling" subtitle="Customer Favorites" items={topSelling} />

      {/* RECOMMENDED */}
      <ItemCarousel title="Recommended For You" subtitle="Handpicked" items={recommended} />

      {/* COMBOS */}
      <ComboCarousel />

      {/* TODAY'S SPECIAL */}
      {specialItems.length > 0 && (
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[#fdf8f6]">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="Today’s Special" subtitle="Limited & Fresh" />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
              {specialItems.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.08)]"
                >
                  <MenuItem item={item} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <FloatingCart hidden={hideFloatingCart} />
    </>
  )
}