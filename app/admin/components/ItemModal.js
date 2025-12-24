// app/admin/components/ItemModal.js
import Image from 'next/image'
import { X, Plus } from 'lucide-react'

export default function ItemModal({
  showItemModal, setShowItemModal, editingItem, itemName, setItemName,
  imageFile, setImageFile, imagePreview, setImagePreview,
  isVeg, setIsVeg, isSpecial, setIsSpecial,
  variants, addVariant, removeVariant, updateVariant,
  saveItem, resetItemForm
}) {
  if (!showItemModal) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl my-8">
        <div className="p-8 sm:p-12">
          <h2 className="text-4xl font-bold mb-10 text-center text-gray-900">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>

          <div className="space-y-8">
            <input
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              placeholder="Item Name"
              className="w-full px-8 py-5 text-2xl border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-amber-500 transition"
            />

            <div>
              <label className="block text-2xl font-bold mb-4">Item Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setImageFile(file)
                    setImagePreview(URL.createObjectURL(file))
                  }
                }}
                className="w-full px-8 py-6 border-4 border-dashed border-gray-400 rounded-2xl text-xl bg-gray-50 cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-8 rounded-3xl overflow-hidden shadow-2xl">
                  <Image src={imagePreview} alt="Preview" width={1200} height={600} className="w-full object-cover" />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-12 items-center">
              <div className="flex-1 text-center">
                <p className="text-2xl font-bold mb-6">Veg / Non-Veg</p>
                <div className="flex justify-center gap-12">
                  <label className="flex items-center gap-4 text-2xl cursor-pointer">
                    <input type="radio" checked={isVeg} onChange={() => setIsVeg(true)} className="w-8 h-8" />
                    <span className="text-green-700 font-black">VEG</span>
                  </label>
                  <label className="flex items-center gap-4 text-2xl cursor-pointer">
                    <input type="radio" checked={!isVeg} onChange={() => setIsVeg(false)} className="w-8 h-8" />
                    <span className="text-red-700 font-black">NON-VEG</span>
                  </label>
                </div>
              </div>
              <label className="flex items-center gap-6 text-2xl">
                <input type="checkbox" checked={isSpecial} onChange={e => setIsSpecial(e.target.checked)} className="w-8 h-8" />
                <span className="font-black text-amber-700">Today's Special</span>
              </label>
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-8">Variants</h3>
              <div className="space-y-6">
                {variants.map((v, i) => (
                  <div key={i} className="flex flex-col lg:flex-row gap-6 items-center">
                    <input
                      value={v.size}
                      onChange={e => updateVariant(i, 'size', e.target.value)}
                      placeholder="Size (e.g. Small, Large)"
                      className="flex-1 px-8 py-5 text-xl border-2 border-gray-300 rounded-2xl"
                    />
                    <input
                      value={v.variant}
                      onChange={e => updateVariant(i, 'variant', e.target.value)}
                      placeholder="Variant (e.g. Spicy, Mild)"
                      className="flex-1 px-8 py-5 text-xl border-2 border-gray-300 rounded-2xl"
                    />
                    <input
                      type="number"
                      value={v.price}
                      onChange={e => updateVariant(i, 'price', e.target.value)}
                      placeholder="Price ₹"
                      className="w-64 px-8 py-5 text-xl border-2 border-gray-300 rounded-2xl"
                    />
                    {variants.length > 1 && (
                      <button
                        onClick={() => removeVariant(i)}
                        className="p-5 bg-red-100 hover:bg-red-200 rounded-2xl transition"
                      >
                        <X size={32} className="text-red-600" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addVariant}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 shadow-2xl transition"
                >
                  <Plus size={28} />
                  Add Another Variant
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 mt-16">
            <button
              onClick={saveItem}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 rounded-3xl text-3xl font-black shadow-2xl transition"
            >
              {editingItem ? 'Update Item' : 'Save Item'}
            </button>
            <button
              onClick={() => { setShowItemModal(false); resetItemForm() }}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-6 rounded-3xl text-3xl font-black shadow-2xl transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}