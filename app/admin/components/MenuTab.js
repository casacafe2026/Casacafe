// app/admin/components/MenuTab.js
import Image from 'next/image'
import { Edit2, Trash2, Plus } from 'lucide-react'

export default function MenuTab({
  categories, saveCategory, catName, setCatName, editingCat,
  setEditingCat, deleteCategory, selectedCat, resetItemForm,
  setShowItemModal, openEditItem, deleteItem,
  toggleAddonCategory  // ← NEW: Toggle add-on category
}) {
  return (
    <div className="space-y-12">
      {/* Category Creation */}
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-4xl font-bold mb-8 text-gray-900">Categories</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <input
            value={catName}
            onChange={e => setCatName(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 px-8 py-5 text-xl border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition"
          />
          <button
            onClick={saveCategory}
            className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-xl transition"
          >
            {editingCat ? 'Update Category' : 'Add Category'}
          </button>
        </div>
      </div>

      {/* Categories List */}
      {categories.map(cat => (
        <div key={cat.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="flex flex-col lg:flex-row justify-between items-start mb-10 gap-6">
              <div>
                <h3 className="text-4xl font-bold text-gray-900">{cat.name}</h3>
                {/* NEW: Add-on Category Toggle */}
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-lg font-medium text-gray-700">Add-on Category?</span>
                  <button
                    onClick={() => toggleAddonCategory(cat.id, cat.is_addon_category)}
                    className={`relative inline-flex h-10 w-20 items-center rounded-full transition duration-300 ${
                      cat.is_addon_category ? 'bg-amber-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition duration-300 ${
                        cat.is_addon_category ? 'translate-x-11' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-600">
                    {cat.is_addon_category ? 'Shown in cart for upselling' : 'Regular menu category'}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => { setEditingCat(cat.id); setCatName(cat.name) }}
                  className="p-4 bg-blue-100 hover:bg-blue-200 rounded-2xl transition"
                >
                  <Edit2 size={28} className="text-blue-700" />
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-4 bg-red-100 hover:bg-red-200 rounded-2xl transition"
                >
                  <Trash2 size={28} className="text-red-700" />
                </button>
                <button
                  onClick={() => { setSelectedCat(cat.id); resetItemForm(); setShowItemModal(true) }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl transition"
                >
                  <Plus size={24} />
                  Add Item
                </button>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {cat.items?.map(item => (
                <div key={item.id} className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition">
                  {item.base_image_url ? (
                    <div className="relative aspect-square">
                      <Image src={item.base_image_url} alt={item.name} fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-t-3xl aspect-square" />
                  )}
                  <div className="p-6">
                    <h4 className="font-bold text-xl mb-3 line-clamp-2">{item.name}</h4>
                    {item.is_special && (
                      <span className="inline-block bg-yellow-500 text-black text-sm font-bold px-4 py-2 rounded-full mb-4">
                        ★ SPECIAL
                      </span>
                    )}
                    <div className="text-base text-gray-600 mb-6 space-y-2">
                      {item.item_variants?.map(v => (
                        <p key={v.id}>
                          {v.size && `${v.size} `}
                          {v.variant && `${v.variant} `}
                          → ₹{(v.price / 100).toFixed(0)}
                        </p>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => openEditItem(item)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition"
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