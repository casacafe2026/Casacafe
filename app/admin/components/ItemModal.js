'use client'
import Image from 'next/image'
import { X, Plus } from 'lucide-react'

export default function ItemModal({
  showItemModal, setShowItemModal, editingItem, itemName, setItemName,
  imageFile, setImageFile, imagePreview, setImagePreview,
  isVeg, setIsVeg, isSpecial, setIsSpecial,
  isOutOfStock, setIsOutOfStock,
  isTopSelling, setIsTopSelling,
  isRecommended, setIsRecommended,
  toggleTopSelling,
  toggleRecommended,
  variants, addVariant, removeVariant, updateVariant,
  saveItem, resetItemForm
}) {
  if (!showItemModal) return null

  const handleToggleTopSelling = async () => {
    if (!editingItem) return
    setIsTopSelling(prev => !prev)
    await toggleTopSelling(editingItem.id, isTopSelling)
  }

  const handleToggleRecommended = async () => {
    if (!editingItem) return
    setIsRecommended(prev => !prev)
    await toggleRecommended(editingItem.id, isRecommended)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl my-8">
        <div className="p-6 sm:p-10">
          {/* Header */}
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>

          {/* Item Name */}
          <input
            value={itemName}
            onChange={e => setItemName(e.target.value)}
            placeholder="Item Name"
            className="w-full px-6 py-4 text-2xl border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 mb-6 transition"
          />

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-2xl font-bold mb-3">Item Image</label>
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
              className="w-full px-6 py-4 border-4 border-dashed border-gray-400 rounded-2xl text-xl bg-gray-50 cursor-pointer"
            />
            {imagePreview && (
              <div className="mt-6 rounded-2xl overflow-hidden shadow-lg max-h-[400px] sm:max-h-[500px] w-full flex justify-center">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={800}
                  height={400}
                  className="object-contain w-auto max-w-full max-h-full"
                />
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6 items-center">
            {/* Veg / Non-Veg */}
            <div className="text-center col-span-2 md:col-span-1">
              <p className="text-xl font-bold mb-2">Veg / Non-Veg</p>
              <div className="flex justify-center gap-6">
                <label className="flex items-center gap-2 text-xl cursor-pointer">
                  <input type="radio" checked={isVeg} onChange={() => setIsVeg(true)} className="w-6 h-6" />
                  <span className="text-green-700 font-black">VEG</span>
                </label>
                <label className="flex items-center gap-2 text-xl cursor-pointer">
                  <input type="radio" checked={!isVeg} onChange={() => setIsVeg(false)} className="w-6 h-6" />
                  <span className="text-red-700 font-black">NON-VEG</span>
                </label>
              </div>
            </div>

            {/* Today's Special */}
            <div className="text-center">
              <label className="flex flex-col items-center gap-2 text-xl">
                <input
                  type="checkbox"
                  checked={isSpecial}
                  onChange={e => setIsSpecial(e.target.checked)}
                  className="w-6 h-6 accent-amber-500"
                />
                <span className="font-black text-amber-700">Today's Special</span>
              </label>
            </div>

            {/* Out of Stock */}
            <div className="text-center">
              <label className="flex flex-col items-center gap-2 text-xl">
                <input
                  type="checkbox"
                  checked={isOutOfStock}
                  onChange={e => setIsOutOfStock(e.target.checked)}
                  className="w-6 h-6 accent-red-600"
                />
                <span className="font-black text-red-600">Out of Stock</span>
              </label>
            </div>

            {/* Top Selling */}
            <div className="text-center">
              <label className="flex flex-col items-center gap-2 text-xl">
                <input
                  type="checkbox"
                  checked={isTopSelling}
                  onChange={handleToggleTopSelling}
                  disabled={!editingItem}
                  className="w-6 h-6 accent-orange-600"
                />
                <span className="font-black text-orange-700">Top Selling</span>
              </label>
            </div>

            {/* Recommended */}
            <div className="text-center">
              <label className="flex flex-col items-center gap-2 text-xl">
                <input
                  type="checkbox"
                  checked={isRecommended}
                  onChange={handleToggleRecommended}
                  disabled={!editingItem}
                  className="w-6 h-6 accent-purple-600"
                />
                <span className="font-black text-purple-700">Recommended</span>
              </label>
            </div>
          </div>

          {/* Variants */}
          <div className="mb-6">
            <h3 className="text-3xl font-bold mb-4">Variants</h3>
            <div className="space-y-4">
              {variants.map((v, i) => (
                <div key={i} className="flex flex-col lg:flex-row gap-4 items-center">
                  <input
                    value={v.size}
                    onChange={e => updateVariant(i, 'size', e.target.value)}
                    placeholder="Size (e.g. Small, Large)"
                    className="flex-1 px-4 py-3 text-lg border-2 border-gray-300 rounded-2xl"
                  />
                  <input
                    value={v.variant}
                    onChange={e => updateVariant(i, 'variant', e.target.value)}
                    placeholder="Variant (e.g. Spicy, Mild)"
                    className="flex-1 px-4 py-3 text-lg border-2 border-gray-300 rounded-2xl"
                  />
                  <input
                    type="number"
                    value={v.price}
                    onChange={e => updateVariant(i, 'price', e.target.value)}
                    placeholder="Price ₹"
                    className="w-40 px-4 py-3 text-lg border-2 border-gray-300 rounded-2xl"
                  />
                  {variants.length > 1 && (
                    <button
                      onClick={() => removeVariant(i)}
                      className="p-3 bg-red-100 hover:bg-red-200 rounded-2xl transition"
                    >
                      <X size={28} className="text-red-600" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addVariant}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-md transition"
              >
                <Plus size={20} />
                Add Another Variant
              </button>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={saveItem}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-3xl text-2xl font-black shadow-lg transition"
            >
              {editingItem ? 'Update Item' : 'Save Item'}
            </button>
            <button
              onClick={() => { setShowItemModal(false); resetItemForm() }}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-4 rounded-3xl text-2xl font-black shadow-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
