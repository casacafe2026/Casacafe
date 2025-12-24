// app/admin/components/ComboModal.js
import Image from 'next/image'
import { X, Upload } from 'lucide-react'

export default function ComboModal({
  showComboModal,
  setShowComboModal,
  editingCombo,
  comboName,
  setComboName,
  comboDesc,
  setComboDesc,
  comboPrice,
  setComboPrice,
  comboImageFile,
  setComboImageFile,
  comboImagePreview,
  setComboImagePreview,
  allItems,
  selectedComboItems,
  setSelectedComboItems,
  saveCombo
}) {
  if (!showComboModal) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">

        {/* ===== HEADER ===== */}
        <div className="sticky top-0 bg-white z-10 border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-black">
            {editingCombo ? 'Edit Combo' : 'Create New Combo'}
          </h2>
          <button
            onClick={() => setShowComboModal(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* ===== BODY ===== */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">

          {/* Combo Name */}
          <div>
            <label className="block text-sm font-bold mb-2">Combo Name</label>
            <input
              value={comboName}
              onChange={e => setComboName(e.target.value)}
              placeholder="Eg: Breakfast Combo"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-2">Description (optional)</label>
            <textarea
              value={comboDesc}
              onChange={e => setComboDesc(e.target.value)}
              placeholder="What does this combo include?"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base h-24 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-bold mb-2">Combo Price (₹)</label>
            <input
              type="number"
              value={comboPrice}
              onChange={e => setComboPrice(e.target.value)}
              placeholder="Eg: 199"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold mb-3">Combo Image</label>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-6 cursor-pointer hover:border-amber-500 transition bg-gray-50">
              <Upload size={32} className="text-gray-500 mb-2" />
              <p className="text-sm font-semibold text-gray-700">
                Tap to upload image
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPG / PNG recommended
              </p>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setComboImageFile(file)
                    setComboImagePreview(URL.createObjectURL(file))
                  }
                }}
              />
            </label>

            {comboImagePreview && (
              <div className="mt-4 rounded-2xl overflow-hidden border">
                <Image
                  src={comboImagePreview}
                  alt="Preview"
                  width={1200}
                  height={600}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
          </div>

          {/* Select Items */}
          <div>
            <label className="block text-sm font-bold mb-3">
              Select Items in Combo
            </label>

            <div className="bg-gray-50 rounded-2xl border max-h-64 overflow-y-auto p-4 space-y-2">
              {allItems.map(item => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedComboItems.includes(item.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedComboItems([...selectedComboItems, item.id])
                      } else {
                        setSelectedComboItems(
                          selectedComboItems.filter(id => id !== item.id)
                        )
                      }
                    }}
                    className="w-5 h-5 accent-amber-600"
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-4">
          <button
            onClick={saveCombo}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-bold text-base transition"
          >
            Save Combo
          </button>
          <button
            onClick={() => setShowComboModal(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-black py-3 rounded-xl font-bold text-base transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}
