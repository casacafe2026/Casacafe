// app/combos/page.js
'use client'

import { supabase } from '../lib/supabase'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function CombosPage() {
  const [combos, setCombos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCombos = async () => {
      const { data } = await supabase
        .from('combos')
        .select('*')
        .order('id')

      setCombos(data || [])
      setLoading(false)
    }

    fetchCombos()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <p className="text-3xl font-bold text-amber-900">Loading combos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black text-center mb-4 text-amber-900">
          COMBO DEALS
        </h1>
        <p className="text-xl md:text-2xl text-center mb-16 text-amber-700 font-medium">
          Save more with our perfect pairings
        </p>

        {combos.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-3xl text-amber-800 font-medium">
              No combos available right now — check back soon! 🍽️
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {combos.map(combo => (
              <div
                key={combo.id}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition transform hover:-translate-y-4"
              >
                {combo.base_image_url ? (
                  <div className="relative aspect-square">
                    <Image
                      src={combo.base_image_url}
                      alt={combo.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                      SAVE!
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-200 aspect-square flex items-center justify-center">
                    <span className="text-gray-500 text-xl">No Image</span>
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-3xl font-bold mb-4 text-center">{combo.name}</h3>
                  {combo.description && (
                    <p className="text-center text-gray-700 mb-6">{combo.description}</p>
                  )}
                  <div className="text-center">
                    <p className="text-4xl font-black text-green-600 line-through mb-2">
                      ₹{(combo.price * 1.2 / 100).toFixed(0)} {/* Fake original price */}
                    </p>
                    <p className="text-5xl font-black text-amber-600">
                      ₹{(combo.price / 100).toFixed(0)}
                    </p>
                  </div>
                  <p className="text-center mt-6 text-gray-600">
                    Includes {combo.item_ids?.length || 0} items
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