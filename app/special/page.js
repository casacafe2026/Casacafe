// app/special/page.js - SHOWS BOTH TYPES OF SPECIALS
'use client'

import { supabase } from '../lib/supabase'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function SpecialPage() {
  const [specialItems, setSpecialItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSpecials = async () => {
      // Fetch from today_special table
      const { data: todaySpecialData } = await supabase
        .from('today_special')
        .select('*')

      // Fetch regular items marked as special
      const { data: regularSpecialData } = await supabase
        .from('items')
        .select(`
          id, name, base_image_url, price:base_price, item_variants(price, is_default)
        `)
        .eq('is_special', true)

      // Combine both
      const combined = [
        ...(todaySpecialData || []).map(item => ({
          ...item,
          item_variants: [{ price: item.price, is_default: true }]
        })),
        ...(regularSpecialData || [])
      ]

      setSpecialItems(combined)
      setLoading(false)
    }

    fetchSpecials()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <p className="text-3xl font-bold text-amber-900">Loading specials...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6 text-amber-900 tracking-wider">
          TODAY'S SPECIAL
        </h1>
        <p className="text-xl md:text-2xl text-amber-700 font-medium mb-16">
          Handcrafted with love — available only today!
        </p>

        {specialItems.length === 0 ? (
          <div className="py-32">
            <p className="text-4xl font-medium text-amber-800 mb-6">
              No specials today
            </p>
            <p className="text-2xl text-amber-600">
              Check back tomorrow! ✨
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {specialItems.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-6"
              >
                <div className="relative aspect-square">
                  {item.base_image_url ? (
                    <Image
                      src={item.base_image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                      <span className="text-amber-800 text-2xl font-bold">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-xl shadow-2xl animate-pulse">
                    ★ SPECIAL
                  </div>
                </div>

                <div className="p-8 bg-gradient-to-b from-white to-amber-50 text-center">
                  <h3 className="text-3xl font-bold mb-4 text-amber-900">{item.name}</h3>
                  <p className="text-5xl font-black text-amber-600">
                    ₹{(item.item_variants?.[0]?.price || item.price || 0) / 100}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}