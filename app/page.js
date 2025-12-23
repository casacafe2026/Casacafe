'use client'

import { supabase } from './lib/supabase'
import MenuItem from './MenuItem'
import Link from 'next/link'
import Image from 'next/image'
import FloatingCart from './FloatingCart'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Home() {
  const [categories, setCategories] = useState([])

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

      setCategories(data || [])
    }

    fetchData()
  }, [])

  const specialItems =
    categories.flatMap(cat => cat.items || []).filter(item => item.is_special)

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-[#fdf8f1] overflow-hidden">

        {/* Coffee-themed SVG decorations */}
        <svg className="absolute top-[-5%] left-[5%] w-[15vw] h-[15vw] opacity-20 animate-spin-slow" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="100" fill="#d4af7f" />
        </svg>
        <svg className="absolute bottom-[-5%] right-[10%] w-[12vw] h-[12vw] opacity-20 animate-pulse-slow" viewBox="0 0 200 200">
          <ellipse cx="100" cy="100" rx="100" ry="50" fill="#c4996c" />
        </svg>

        {/* Floating coffee beans (example) */}
        <svg className="absolute top-[20%] left-[25%] w-10 h-10 opacity-40 animate-bounce-slow" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" fill="#a97452" />
        </svg>
        <svg className="absolute top-[35%] right-[20%] w-8 h-8 opacity-30 animate-bounce-slow" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" fill="#a97452" />
        </svg>

        {/* Large Animated Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative z-10 mb-12"
        >
          <div className="relative w-[85vw] h-[85vw] sm:w-[60vw] sm:h-[60vw] md:w-[36rem] md:h-[36rem] lg:w-[48rem] lg:h-[48rem] mx-auto">
            <Image
              src="/logo.png"
              alt="CASA CAFÉ"
              fill
              priority
              className="object-contain drop-shadow-lg"
            />
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9 }}
        >
          <Link
            href="/menu"
            className="inline-flex items-center justify-center
                       bg-[#d4af7f] hover:bg-[#c4996c]
                       text-[#4a3221]
                       px-16 py-6 rounded-full
                       text-xl sm:text-2xl font-bold tracking-widest
                       shadow-lg hover:shadow-2xl
                       transition-all duration-500 hover:scale-110"
          >
            Explore Menu
          </Link>
        </motion.div>

      </section>

      {/* ================= TODAY'S SPECIAL ================= */}
      {specialItems.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2 }}
          className="py-28 px-6 bg-[#fff8f0]"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="
              text-4xl sm:text-5xl md:text-6xl
              font-extralight text-center
              mb-24
              tracking-[0.35em] uppercase
              text-[#4a3221]
            ">
              Today’s Special
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-12">
              {specialItems.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9 }}
                  className="bg-white rounded-3xl overflow-hidden
                             shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                             hover:-translate-y-2 transition-all duration-500"
                >
                  <MenuItem item={item} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* ================= CATEGORY PREVIEW ================= */}
      <section className="py-32 px-6 bg-[#fdf8f6]">
        <div className="max-w-7xl mx-auto space-y-44">
          {categories.map(category => {
            const regularItems = category.items?.filter(i => !i.is_special) || []
            if (!regularItems.length) return null

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ duration: 1.1 }}
              >
                <h3 className="
                  text-3xl sm:text-4xl md:text-5xl
                  font-extralight text-center
                  mb-20
                  tracking-[0.4em] uppercase
                  text-[#4a3221]
                ">
                  {category.name}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-12">
                  {regularItems.slice(0, 10).map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="bg-white rounded-3xl overflow-hidden
                                 shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                                 hover:-translate-y-2 transition-all duration-500"
                    >
                      <MenuItem item={item} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      <FloatingCart />
    </>
  )
}
