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
      <div className="min-h-screen flex items-center justify-center bg-[#2f0f24]">
        <p className="text-3xl font-bold text-[#DCBF98]">Loading Delicious Menu...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#2f0f24]">
      {/* Categories Bar */}
      <div className="sticky top-0 z-40 bg-[#2f0f24] border-b border-[#DCBF98]/30">
        <div className="overflow-x-auto px-4 py-4">
          <div className="flex gap-3 min-w-max">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-full text-sm sm:text-base font-bold whitespace-nowrap transition-all duration-300 border`}
                style={{
                  backgroundColor: selectedCategory?.id === cat.id ? '#DCBF98' : '#2f0f24',
                  color: selectedCategory?.id === cat.id ? '#2f0f24' : '#DCBF98',
                  borderColor: '#DCBF98'
                }}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="px-4 py-8 lg:py-12 pb-32">
        <h1
          className="text-4xl lg:text-6xl font-black text-center mb-8 lg:mb-12 uppercase tracking-wide"
          style={{ color: '#DCBF98' }}
        >
          {selectedCategory?.name || 'Our Menu'}
        </h1>

        {selectedCategory?.items?.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-[#DCBF98] font-medium">No items yet — coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-10">
            {selectedCategory?.items?.map(item => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart */}
      <FloatingCart />
    </div>
  )
}