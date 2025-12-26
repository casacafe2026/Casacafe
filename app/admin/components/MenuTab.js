// app/admin/components/MenuTab.js
'use client'

import Image from 'next/image'
import { Edit2, Trash2, Plus } from 'lucide-react'

export default function MenuTab({
  categories,
  saveCategory,
  catName,
  setCatName,
  editingCat,
  setEditingCat,
  deleteCategory,
  setSelectedCat,
  resetItemForm,
  setShowItemModal,
  openEditItem,
  deleteItem,
  toggleAddonCategory
}) {
  return (
    <div className="space-y-12">

      {/* ================= Category Creation ================= */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">Categories</h2>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <input
            value={catName}
            onChange={e => setCatName(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
          />
          <button
            onClick={saveCategory}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 sm:px-12 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg shadow-md hover:shadow-xl transition"
          >
            {editingCat ? 'Update Category' : 'Add Category'}
          </button>
        </div>
      </div>

      {/* ================= Categories List ================= */}
      {categories.map(cat => (
        <div key={cat.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-8">

            {/* Category Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start mb-6 sm:mb-10 gap-4 sm:gap-6">
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{cat.name}</h3>

                {/* Add-on toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-sm sm:text-base font-medium text-gray-700">Add-on Category?</span>
                  <button
                    onClick={() => toggleAddonCategory(cat.id, cat.is_addon_category)}
                    className={`relative inline-flex h-8 w-16 sm:h-10 sm:w-20 items-center rounded-full transition duration-300 ${
                      cat.is_addon_category ? 'bg-amber-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 sm:h-8 sm:w-8 transform rounded-full bg-white shadow-md transition duration-300 ${
                        cat.is_addon_category ? 'translate-x-7 sm:translate-x-11' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {cat.is_addon_category ? 'Shown in cart for upselling' : 'Regular menu category'}
                  </span>
                </div>
              </div>

              {/* Category Actions */}
              <div className="flex flex-wrap gap-3 sm:gap-4 mt-3 sm:mt-0">
                <button
                  onClick={() => { setEditingCat(cat.id); setCatName(cat.name) }}
                  className="p-2 sm:p-3 bg-blue-100 hover:bg-blue-200 rounded-2xl transition"
                >
                  <Edit2 size={20} className="text-blue-700 sm:text-blue-800" />
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-2 sm:p-3 bg-red-100 hover:bg-red-200 rounded-2xl transition"
                >
                  <Trash2 size={20} className="text-red-700 sm:text-red-800" />
                </button>
                <button
                  onClick={() => { setSelectedCat(cat.id); resetItemForm(); setShowItemModal(true) }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-bold flex items-center gap-2 sm:gap-3 shadow-md hover:shadow-xl transition"
                >
                  <Plus size={18} />
                  Add Item
                </button>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {cat.items?.map(item => (
                <div key={item.id} className="bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition">
                  {item.base_image_url ? (
                    <div className="relative aspect-square">
                      <Image src={item.base_image_url} alt={item.name} fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-t-2xl aspect-square" />
                  )}
                  <div className="p-4 sm:p-6">
                    <h4 className="font-bold text-lg sm:text-xl mb-2 line-clamp-2">{item.name}</h4>

                    {item.is_special && (
                      <span className="inline-block bg-yellow-500 text-black text-xs sm:text-sm font-bold px-3 py-1 rounded-full mb-3">
                        ★ SPECIAL
                      </span>
                    )}

                    <div className="text-sm sm:text-base text-gray-600 mb-4 space-y-1">
                      {item.item_variants?.map(v => (
                        <p key={v.id}>
                          {v.size && `${v.size} `}
                          {v.variant && `${v.variant} `}
                          → ₹{(v.price / 100).toFixed(0)}
                        </p>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        onClick={() => openEditItem(item)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-xl font-bold transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 sm:py-3 rounded-xl font-bold transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
