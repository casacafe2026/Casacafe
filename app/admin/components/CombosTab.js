import Image from 'next/image'
import { Plus, Trash2, Edit3 } from 'lucide-react'

export default function CombosTab({ combos, openComboModal, deleteCombo }) {
  return (
    <div className="space-y-10">

      {/* ADD COMBO BUTTON */}
      <div className="flex justify-center">
        <button
          onClick={() => openComboModal()}
          className="flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white 
          px-10 py-4 rounded-full text-xl sm:text-2xl font-bold shadow-xl 
          transition active:scale-95"
        >
          <Plus size={28} />
          Add New Combo
        </button>
      </div>

      {/* EMPTY STATE */}
      {combos.length === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl font-bold text-gray-500">No combos created yet</p>
          <p className="text-gray-400 mt-2">Create your first combo offer</p>
        </div>
      )}

      {/* COMBOS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {combos.map(combo => (
          <div
            key={combo.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden 
            hover:shadow-xl transition"
          >

            {/* IMAGE */}
            <div className="relative w-full h-48 bg-gray-100">
              {combo.base_image_url ? (
                <Image
                  src={combo.base_image_url}
                  alt={combo.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No Image Uploaded
                </div>
              )}

              {/* PRICE BADGE */}
              <span className="absolute top-3 right-3 bg-white/95 px-3 py-1 rounded-full 
                text-sm font-black text-amber-600 shadow">
                ₹{(combo.price / 100).toFixed(0)}
              </span>
            </div>

            {/* CONTENT */}
            <div className="p-5 text-center space-y-3">

              <h3 className="text-xl font-bold text-black leading-tight">
                {combo.name}
              </h3>

              {combo.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {combo.description}
                </p>
              )}

              <p className="text-sm text-gray-500">
                Includes <span className="font-bold">{combo.item_ids?.length || 0}</span> items
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => openComboModal(combo)}
                  className="flex-1 flex items-center justify-center gap-2 
                  bg-blue-600 hover:bg-blue-700 text-white 
                  py-2.5 rounded-xl font-bold transition active:scale-95"
                >
                  <Edit3 size={18} />
                  Edit
                </button>

                <button
                  onClick={() => deleteCombo(combo.id)}
                  className="flex-1 flex items-center justify-center gap-2 
                  bg-red-600 hover:bg-red-700 text-white 
                  py-2.5 rounded-xl font-bold transition active:scale-95"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
