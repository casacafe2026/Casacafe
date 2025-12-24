// app/admin/components/SpecialTab.js
import Image from 'next/image'
import { Plus } from 'lucide-react'

export default function SpecialTab({
  specialItems, allItems, openSpecialModal, deleteSpecialItem, toggleExistingSpecial
}) {
  return (
    <div className="space-y-16">
      <div className="text-center">
        <button
          onClick={() => openSpecialModal()}
          className="bg-amber-600 hover:bg-amber-700 text-white px-16 py-6 rounded-full text-3xl font-bold shadow-2xl flex items-center gap-4 mx-auto transition"
        >
          <Plus size={36} />
          Add New Special Item
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {specialItems.length === 0 ? (
          <p className="text-center text-3xl text-gray-500 col-span-full py-20">No special items yet</p>
        ) : (
          specialItems.map(item => (
            <div key={item.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden text-center">
              {item.base_image_url && (
                <div className="relative w-full h-80">
                  <Image src={item.base_image_url} alt={item.name} fill className="object-cover" unoptimized />
                </div>
              )}
              <div className="p-8">
                <h3 className="text-3xl font-bold mb-4">{item.name}</h3>
                <p className="text-5xl font-black text-amber-600 mb-8">₹{(item.price / 100).toFixed(0)}</p>
                <div className="flex gap-6">
                  <button
                    onClick={() => openSpecialModal(item)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-xl transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteSpecialItem(item.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold text-xl transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-10">
        <h3 className="text-3xl font-bold text-center mb-10">Feature Existing Menu Items</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {allItems.map(item => (
            <div key={item.id} className="bg-gray-50 rounded-2xl p-6 text-center shadow hover:shadow-xl transition">
              <p className="text-2xl font-medium mb-6">{item.name}</p>
              <button
                onClick={() => toggleExistingSpecial(item.id, item.is_special)}
                className={`px-10 py-4 rounded-full font-bold text-xl transition ${
                  item.is_special ? 'bg-amber-600 text-white' : 'bg-gray-300 text-gray-700'
                }`}
              >
                {item.is_special ? '★ Featured' : 'Mark as Special'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}