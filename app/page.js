'use client'

import { supabase } from './lib/supabase'
import MenuItem from './MenuItem'
import Link from 'next/link'
import Image from 'next/image'
import FloatingCart from './FloatingCart'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [topSelling, setTopSelling] = useState([])
  const [recommended, setRecommended] = useState([])
  const heroRef = useRef(null)
  const [hideFloatingCart, setHideFloatingCart] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
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

      if (data) {
        setCategories(data)
        const allItems = data.flatMap(cat => cat.items || [])
        setTopSelling(allItems.filter(i => i.is_top_selling && !i.is_out_of_stock))
        setRecommended(allItems.filter(i => i.is_recommended && !i.is_out_of_stock))
      }
    }

    fetchData()

    const channel = supabase
      .channel('landing-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, fetchData)
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

  /* LEFT TITLE */
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

  /* COMPACT CAROUSEL */
  const Carousel = ({ title, subtitle, items }) => {
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
                  className="flex-shrink-0
                    w-[62vw] sm:w-[38vw] md:w-[26vw] lg:w-[22vw] xl:w-[20vw]"
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl overflow-hidden
                      shadow-[0_12px_36px_rgba(79,25,60,0.1)]"
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

  return (
    <>
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center bg-[#4f193c] overflow-hidden pt-20"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="relative z-10 -translate-y-20 md:-translate-y-28"
        >
          <div className="w-[100vw] h-[100vw] sm:w-[86vw] sm:h-[86vw] md:w-[56rem] md:h-[56rem] lg:w-[72rem] lg:h-[72rem] mx-auto">
            <Image
              src="/logo.png"
              alt="CASA CAFÉ"
              fill
              priority
              className="object-contain drop-shadow-[0_50px_140px_rgba(0,0,0,0.55)]"
            />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="relative z-10 -translate-y-8"
        >
          <Link
            href="/menu"
            className="
              relative inline-flex items-center justify-center
              bg-[#d4af7f] hover:bg-[#c4996c]
              text-[#4f193c]
              px-10 py-4 sm:px-14 sm:py-5
              text-sm sm:text-base md:text-lg
              rounded-full tracking-[0.35em]
              transition-all duration-300
              hover:scale-105
              shadow-[0_0_0_2px_rgba(212,175,127,0.4),0_18px_45px_rgba(0,0,0,0.25)]
            "
          >
            Explore Menu
          </Link>
        </motion.div>
      </section>

      {/* TOP SELLING */}
      <Carousel
        title="Top Selling"
        subtitle="Customer Favorites"
        items={topSelling}
      />

      {/* RECOMMENDED */}
      <Carousel
        title="Recommended For You"
        subtitle="Handpicked"
        items={recommended}
      />

      {/* TODAY'S SPECIAL */}
      {specialItems.length > 0 && (
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[#fdf8f6]">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              title="Today’s Special"
              subtitle="Limited & Fresh"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
              {specialItems.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-2xl overflow-hidden
                    shadow-[0_12px_36px_rgba(0,0,0,0.08)]"
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
