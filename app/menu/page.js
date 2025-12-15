// app/menu/page.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import MenuItem from '../MenuItem'

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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <p className="text-4xl sm:text-5xl font-bold text-amber-800">Loading menu...</p>
      </div>
    )
  }

  const selectedItems = selectedCategory?.items || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-5xl sm:text-7xl font-black text-center text-amber-800 mb-12 sm:mb-16">
          CASA CAFÉ SIGNATURE MENU
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* LEFT SIDE - CATEGORIES */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 sticky top-24">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-amber-700">
                Categories
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full py-4 sm:py-6 px-6 sm:px-8 rounded-2xl text-xl sm:text-2xl font-bold transition-all shadow-md ${
                      selectedCategory?.id === cat.id
                        ? 'bg-amber-600 text-white shadow-lg scale-105'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                    }`}
                  >
                    {cat.name.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - ITEMS */}
          <div className="lg:col-span-3">
            <h2 className="text-4xl sm:text-6xl font-black text-center mb-12 sm:mb-16 text-amber-700">
              {selectedCategory?.name.toUpperCase() || 'Select a category'}
            </h2>

            {selectedItems.length === 0 ? (
              <div className="text-center py-20 sm:py-32">
                <p className="text-3xl sm:text-4xl text-gray-600">No items in this category yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-12">
                {selectedItems.map(item => (
                  <MenuItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}