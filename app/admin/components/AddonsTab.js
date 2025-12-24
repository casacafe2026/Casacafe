// app/admin/components/AddonsTab.js
import Image from 'next/image'
import { Plus } from 'lucide-react'

export default function AddonsTab({ addons, openAddonModal, deleteAddon }) {
  return (
    <div className="space-y-16">
      <div className="text-center">
        <button
          onClick={() => openAddonModal()}
          className="bg-amber-600 hover:bg-amber-700 text-white px-16 py-6 rounded-full text-3xl font-bold shadow-2xl flex items-center gap-4 mx-auto transition"
        >
          <Plus size={36} />
          Add New Addon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {addons.length === 0 ? (
          <p className="text-center text-3xl text-gray-500 col-span-full py-20">No addons yet</p>
        ) : (
          addons.map(addon => (
            <div key={addon.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden text-center">
              {addon.base_image_url ? (
                <div className="relative w-full h-64">
                  <Image src={addon.base_image_url} alt={addon.name} fill className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="bg-gray-200 h-64 flex items-center justify-center rounded-t-3xl">
                  <span className="text-gray-500 text-xl">No Image</span>
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3">{addon.name}</h3>
                <p className="text-4xl font-black text-amber-600 mb-8">
                  + ₹{(addon.price / 100).toFixed(0)}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => openAddonModal(addon)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAddon(addon.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}