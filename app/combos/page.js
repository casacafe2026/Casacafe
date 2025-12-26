// app/combos/page.js
'use client'

import { supabase } from '../lib/supabase'
import Image from 'next/image'
import { useCart } from '../cart-context'
import { ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function CombosPage() {
  const [combos, setCombos] = useState([])
  const [comboItems, setComboItems] = useState({})
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchCombos = async () => {
      const { data: combosData } = await supabase
        .from('combos')
        .select('*')
        .order('id')

      if (!combosData || combosData.length === 0) {
        setCombos([])
        setLoading(false)
        return
      }

      setCombos(combosData)

      const allItemIds = [...new Set(combosData.flatMap(c => c.item_ids || []))]

      if (allItemIds.length === 0) {
        setLoading(false)
        return
      }

      const { data: itemsData } = await supabase
        .from('items')
        .select(`
          id,
          name,
          base_image_url,
          item_variants (
            id,
            price,
            is_default
          )
        `)
        .in('id', allItemIds)

      const itemsByCombo = {}
      combosData.forEach(combo => {
        const items = (combo.item_ids || [])
          .map(id => itemsData?.find(item => item.id === id))
          .filter(Boolean)
        itemsByCombo[combo.id] = items
      })

      setComboItems(itemsByCombo)
      setLoading(false)
    }

    fetchCombos()
  }, [])

  const calculateIndividualTotal = (items) => {
    return items.reduce((sum, item) => {
      const defaultVariant = item.item_variants?.find(v => v.is_default) || item.item_variants?.[0]
      return sum + (defaultVariant?.price || 0)
    }, 0) / 100
  }

  // Safe add combo to cart — no variant.id access
  const handleAddComboToCart = (combo, items) => {
    // Create a dummy variant with the combo price
    const dummyVariant = {
      id: `combo-${combo.id}`,
      price: combo.price  // ← Use combo's actual price in cents
    }

    addToCart(
      {
        id: combo.id,
        name: combo.name + ' (Combo)',
        base_image_url: combo.base_image_url,
        description: combo.description || 'Delicious combo deal'
      },
      dummyVariant,  // ← Safe variant with correct price
      []  // No add-ons
    )
  }

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
            {combos.map(combo => {
              const items = comboItems[combo.id] || []
              const individualTotal = calculateIndividualTotal(items)
              const comboPrice = combo.price / 100
              const savings = individualTotal - comboPrice

              return (
                <div
                  id={`combo-${combo.id}`}
                  key={combo.id}
                  className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition transform hover:-translate-y-4 duration-500"
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
                        SAVE ₹{savings.toFixed(0)}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-200 aspect-square flex items-center justify-center">
                      <span className="text-gray-500 text-xl">No Image</span>
                    </div>
                  )}

                  <div className="p-8">
                    <h3 className="text-3xl font-bold mb-4 text-center text-amber-900">
                      {combo.name}
                    </h3>
                    {combo.description && (
                      <p className="text-center text-gray-700 mb-6">{combo.description}</p>
                    )}

                    {/* Included Items */}
                    <div className="mb-6">
                      <p className="font-semibold text-gray-800 mb-3 text-center">Includes:</p>
                      <ul className="space-y-2 text-gray-700">
                        {items.map(item => (
                          <li key={item.id} className="flex items-center justify-center gap-2">
                            <span className="text-amber-600">•</span>
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pricing */}
                    <div className="text-center mb-8">
                      <p className="text-2xl text-gray-500 line-through">
                        ₹{individualTotal.toFixed(0)}
                      </p>
                      <p className="text-5xl font-black text-green-600">
                        ₹{comboPrice.toFixed(0)}
                      </p>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddComboToCart(combo, items)}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition duration-300"
                    >
                      <ShoppingCart size={28} />
                      Add Combo to Cart
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}