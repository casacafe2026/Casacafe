// app/menu/page.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import MenuItem from '../MenuItem'
import FloatingCart from '../FloatingCart'

export default function MenuPage() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)

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
      if (data && data.length > 0) {
        setSelectedCategory(data[0])
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 flex items-center justify-center">
        <p className="text-3xl font-bold text-red-600">Loading Delicious Menu...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
      {/* HORIZONTAL CATEGORIES — SMALLER BUTTONS, ALWAYS VISIBLE */}
      <div className="bg-white shadow-lg sticky top-0 z-40">
        <div className="overflow-x-auto scrollbar-hide px-4 py-4">
          <div className="flex gap-3 min-w-max">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-full text-sm sm:text-base font-bold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory?.id === cat.id
                    ? 'bg-red-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-800 hover:bg-red-100'
                }`}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN ITEMS GRID */}
      <div className="px-4 py-8 lg:py-12 pb-32">
        <h1 className="text-4xl lg:text-6xl font-black text-center text-red-700 mb-8 lg:mb-12 uppercase tracking-wide">
          {selectedCategory?.name || 'Our Menu'}
        </h1>

        {selectedCategory?.items?.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600 font-medium">No items yet — coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-10">
            {selectedCategory?.items?.map(item => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* FLOATING CART */}
      <FloatingCart />
    </div>
  )
}