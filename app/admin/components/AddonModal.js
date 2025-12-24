// app/admin/components/AddonModal.js
import Image from 'next/image'

export default function AddonModal({
  showAddonModal, setShowAddonModal, editingAddon,
  addonName, setAddonName, addonPrice, setAddonPrice,
  addonImageFile, setAddonImageFile, addonImagePreview, setAddonImagePreview,
  isAddonGlobal, setIsAddonGlobal,
  selectedAddonCategories, setSelectedAddonCategories,
  selectedAddonItems, setSelectedAddonItems,
  categories, allItems,  // from useAdminData
  saveAddon
}) {
  if (!showAddonModal) return null

  const toggleCategory = (catId) => {
    if (selectedAddonCategories.includes(catId)) {
      setSelectedAddonCategories(selectedAddonCategories.filter(id => id !== catId))
    } else {
      setSelectedAddonCategories([...selectedAddonCategories, catId])
    }
  }

  const toggleItem = (itemId) => {
    if (selectedAddonItems.includes(itemId)) {
      setSelectedAddonItems(selectedAddonItems.filter(id => id !== itemId))
    } else {
      setSelectedAddonItems([...selectedAddonItems, itemId])
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-8">
        <div className="p-10">
          <h2 className="text-4xl font-bold mb-10 text-center">
            {editingAddon ? 'Edit Addon' : 'Add New Addon'}
          </h2>

          <div className="space-y-8">
            <input
              value={addonName}
              onChange={e => setAddonName(e.target.value)}
              placeholder="Addon Name (e.g. Extra Cheese)"
              className="w-full px-8 py-5 text-2xl border-2 border-gray-300 rounded-2xl"
            />
            <input
              type="number"
              value={addonPrice}
              onChange={e => setAddonPrice(e.target.value)}
              placeholder="Price ₹"
              className="w-full px-8 py-5 text-2xl border-2 border-gray-300 rounded-2xl"
            />

            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) {
                  setAddonImageFile(file)
                  setAddonImagePreview(URL.createObjectURL(file))
                }
              }}
              className="w-full px-8 py-6 border-4 border-dashed border-gray-400 rounded-2xl text-xl bg-gray-50"
            />
            {addonImagePreview && (
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image src={addonImagePreview} alt="Preview" width={800} height={600} className="w-full object-cover" />
              </div>
            )}

            {/* Global vs Specific */}
            <div className="space-y-6">
              <label className="flex items-center gap-4 text-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAddonGlobal}
                  onChange={e => setIsAddonGlobal(e.target.checked)}
                  className="w-8 h-8"
                />
                <span className="font-bold">Global Addon (shown for all items)</span>
              </label>

              {!isAddonGlobal && (
                <>
                  <div>
                    <p className="text-2xl font-bold mb-4">Apply to Categories</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {categories.map(cat => (
                        <label key={cat.id} className="flex items-center gap-3 text-xl">
                          <input
                            type="checkbox"
                            checked={selectedAddonCategories.includes(cat.id)}
                            onChange={() => toggleCategory(cat.id)}
                            className="w-6 h-6"
                          />
                          <span>{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-2xl font-bold mb-4">Apply to Specific Items</p>
                    <div className="bg-gray-50 rounded-2xl p-6 max-h-80 overflow-y-auto">
                      {allItems.map(item => (
                        <label key={item.id} className="flex items-center gap-3 py-2 text-lg">
                          <input
                            type="checkbox"
                            checked={selectedAddonItems.includes(item.id)}
                            onChange={() => toggleItem(item.id)}
                            className="w-5 h-5"
                          />
                          <span>{item.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-6 mt-12">
            <button
              onClick={saveAddon}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 rounded-3xl text-3xl font-black shadow-2xl transition"
            >
              Save Addon
            </button>
            <button
              onClick={() => setShowAddonModal(false)}
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