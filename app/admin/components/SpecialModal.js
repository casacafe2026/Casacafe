// app/admin/components/SpecialModal.js
import Image from 'next/image'

export default function SpecialModal({
  showSpecialModal, setShowSpecialModal, editingSpecialItem,
  specialName, setSpecialName, specialPrice, setSpecialPrice,
  specialImageFile, setSpecialImageFile, specialImagePreview, setSpecialImagePreview,
  saveSpecialItem
}) {
  if (!showSpecialModal) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-10">
        <h2 className="text-4xl font-bold mb-10 text-center">{editingSpecialItem ? 'Edit' : 'Add'} Special Item</h2>
        <div className="space-y-8">
          <input
            value={specialName}
            onChange={e => setSpecialName(e.target.value)}
            placeholder="Item Name"
            className="w-full px-8 py-5 text-2xl border-2 border-gray-300 rounded-2xl"
          />
          <input
            type="number"
            value={specialPrice}
            onChange={e => setSpecialPrice(e.target.value)}
            placeholder="Price ₹"
            className="w-full px-8 py-5 text-2xl border-2 border-gray-300 rounded-2xl"
          />
          <input
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) {
                setSpecialImageFile(file)
                setSpecialImagePreview(URL.createObjectURL(file))
              }
            }}
            className="w-full px-8 py-6 border-4 border-dashed border-gray-400 rounded-2xl text-xl bg-gray-50"
          />
          {specialImagePreview && (
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <Image src={specialImagePreview} alt="Preview" width={800} height={600} className="w-full object-cover" />
            </div>
          )}
        </div>
        <div className="flex gap-6 mt-12">
          <button
            onClick={saveSpecialItem}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 rounded-3xl text-3xl font-black shadow-2xl transition"
          >
            Save
          </button>
          <button
            onClick={() => setShowSpecialModal(false)}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-6 rounded-3xl text-3xl font-black shadow-2xl transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}