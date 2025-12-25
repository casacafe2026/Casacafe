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

    const channel = supabase
      .channel('landing-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items' },
        fetchData
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // Hide floating cart while hero is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideFloatingCart(entry.isIntersecting)
      },
      { threshold: 0.4 }
    )

    if (heroRef.current) observer.observe(heroRef.current)

    return () => observer.disconnect()
  }, [])

  const specialItems = categories
    .flatMap(cat => cat.items || [])
    .filter(item => item.is_special && !item.is_out_of_stock)

  return (
    <>
      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center bg-[#4f193c] overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 w-[180vw] h-[180vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(212,175,127,0.25),transparent_65%)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
          transition={{
            opacity: { duration: 1.2 },
            scale: { duration: 1.2 },
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="relative z-10"
        >
          <div className="w-[96vw] h-[96vw] sm:w-[82vw] sm:h-[82vw] md:w-[52rem] md:h-[52rem] lg:w-[66rem] lg:h-[66rem] xl:w-[80rem] xl:h-[80rem] 2xl:w-[96rem] 2xl:h-[96rem] mx-auto">
            <Image
              src="/logo.png"
              alt="CASA CAFÉ"
              fill
              priority
              className="object-contain drop-shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative z-10 mt-6"
        >
          <Link
            href="/menu"
            className="inline-flex items-center justify-center bg-[#d4af7f] hover:bg-[#c4996c] text-[#4f193c] px-10 py-3 text-sm rounded-full tracking-widest shadow-lg transition-all duration-300"
          >
            Explore Menu
          </Link>
        </motion.div>
      </section>

      {/* TODAY'S SPECIAL */}
      {specialItems.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2 }}
          className="py-28 px-6 bg-[#fff8f0]"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extralight text-center mb-24 tracking-[0.35em] uppercase text-[#4a3221]">
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
                  className="bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500"
                >
                  <MenuItem item={item} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* CATEGORY PREVIEW */}
      <section className="py-32 px-6 bg-[#fdf8f6]">
        <div className="max-w-7xl mx-auto space-y-44">
          {categories.map(category => {
            const regularItems =
              category.items?.filter(i => !i.is_special && !i.is_out_of_stock) || []

            if (!regularItems.length) return null

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ duration: 1.1 }}
              >
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-extralight text-center mb-20 tracking-[0.4em] uppercase text-[#4a3221]">
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
                      className="bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500"
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

      {/* FLOATING CART (HIDDEN IN HERO) */}
      <FloatingCart hidden={hideFloatingCart} />
    </>
  )
}
