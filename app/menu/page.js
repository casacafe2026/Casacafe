'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import FloatingCart from '../FloatingCart'
import { motion } from 'framer-motion'
import ParallaxMenuItem from '../ParallaxMenuItem'

export default function MenuPage() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const categoryRefs = useRef({})

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
      if (data?.length) setSelectedCategory(data[0])
      setLoading(false)
    }

    fetchData()
  }, [])

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 150
      for (let cat of categories) {
        const ref = categoryRefs.current[cat.id]
        if (ref) {
          const offsetTop = ref.offsetTop
          const offsetBottom = offsetTop + ref.offsetHeight
          if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
            if (selectedCategory?.id !== cat.id) setSelectedCategory(cat)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [categories, selectedCategory])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF3E7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 border-4 border-t-[#5C2D1F] border-gray-300 rounded-full animate-spin"></div>
          <p className="text-xl sm:text-2xl font-bold text-[#5C2D1F] tracking-widest">
            Brewing Your Menu...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF3E7] relative text-[#5C2D1F]">
      {/* Fixed Category Bar */}
      <div className="fixed top-[72px] left-0 w-full bg-[#FDF3E7]/95 backdrop-blur-md border-b border-[#cfa26c]/40 shadow-sm md:z-50 z-30">
        <div className="overflow-x-auto px-4 py-3">
          <div className="flex gap-2 min-w-max">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  const target = document.getElementById(`category-${cat.id}`)
                  target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  setSelectedCategory(cat)
                }}
                className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 border"
                style={{
                  backgroundColor:
                    selectedCategory?.id === cat.id ? '#cfa26c' : '#FDF3E7',
                  color: selectedCategory?.id === cat.id ? '#FDF3E7' : '#6b4f3c',
                  borderColor: '#cfa26c',
                }}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-20"></div>

      {/* Menu Items */}
      <div className="px-4 py-8 lg:py-12 pb-32 relative z-10">
        {categories.map(cat => (
          <div
            key={cat.id}
            id={`category-${cat.id}`}
            ref={el => (categoryRefs.current[cat.id] = el)}
            className="mb-12"
          >
            <h1 className="text-4xl lg:text-6xl font-serif text-center mb-8 lg:mb-12 uppercase tracking-wide text-[#cfa26c]">
              {cat.name}
            </h1>

            {cat.items?.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-2xl text-[#6b4f3c] font-medium">No items yet — coming soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                {cat.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <ParallaxMenuItem item={item} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating Cart */}
      <FloatingCart />
    </div>
  )
}
