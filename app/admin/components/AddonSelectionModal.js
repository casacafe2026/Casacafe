// app/components/AddonSelectionModal.js
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'  // Adjust path if needed

export default function AddonSelectionModal({
  isOpen,
  onClose,
  product,
  addToCartFinal,  // Your final addToCart function that adds item + selected addons
}) {
  const [addons, setAddons] = useState([])
  const [selectedAddons, setSelectedAddons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && product) {
      const fetchRelevantAddons = async () => {
        const { data } = await supabase
          .from('addons')
          .select('*')
          .or(`is_global.eq.true,and(is_global.eq.false,category_ids.cs.{${product.category_id}}),and(is_global.eq.false,item_ids.cs.{${product.id}})`)

        setAddons(data || [])
        setLoading(false)
      }
      fetchRelevantAddons()
    }
  }, [isOpen, product])

  const toggleAddon = (addon) => {
    if (selectedAddons.find(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id))
    } else {
      setSelectedAddons([...selectedAddons, addon])
    }
  }

  const confirmAndAdd = () => {
    addToCartFinal(product, 1, selectedAddons)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto p-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          Add Extras to {product.name}
        </h2>

        {loading ? (
          <p className="text-center">Loading add-ons...</p>
        ) : addons.length === 0 ? (
          <p className="text-center text-gray-600">No extra add-ons available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {addons.map(addon => (
              <label
                key={addon.id}
                className={`flex items-center gap-4 p-5 rounded-2xl border-4 cursor-pointer transition ${
                  selectedAddons.find(a => a.id === addon.id)
                    ? 'border-amber-600 bg-amber-50'
                    : 'border-gray-300 hover:border-amber-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!selectedAddons.find(a => a.id === addon.id)}
                  onChange={() => toggleAddon(addon)}
                  className="w-6 h-6"
                />
                <div className="flex-1">
                  <p className="text-xl font-bold">{addon.name}</p>
                  <p className="text-2xl font-black text-amber-600">
                    + ₹{(addon.price / 100).toFixed(0)}
                  </p>
                </div>
                {addon.base_image_url && (
                  <Image src={addon.base_image_url} alt={addon.name} width={80} height={80} className="rounded-xl object-cover" />
                )}
              </label>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={confirmAndAdd}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-5 rounded-3xl text-2xl font-bold shadow-2xl transition"
          >
            Add to Cart
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-5 rounded-3xl text-2xl font-bold shadow-2xl transition"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}