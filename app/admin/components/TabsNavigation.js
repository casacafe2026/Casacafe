// app/admin/components/TabsNavigation.js
import { Bell } from 'lucide-react'

export default function TabsNavigation({ 
  activeTab, 
  setActiveTab, 
  setNewOrderCount,  
  newOrderCount, 
  ordersLength 
}) {
  const tabs = [
    { key: 'orders', label: `Orders (${ordersLength})` },
    { key: 'menu', label: 'Menu' },
    { key: 'bills', label: 'Bills' },
    { key: 'special', label: "Today's Special" },
    { key: 'combos', label: 'Combos' },
    { key: 'addons', label: 'Addons' },
    { key: 'sales', label: 'Sales Report' }  // ← NEW TAB ADDED
  ]

  return (
    <div className="flex flex-wrap gap-4 mb-12 justify-center sm:justify-start">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => {
            setActiveTab(tab.key)
            if (tab.key === 'orders' && typeof setNewOrderCount === 'function') {
              setNewOrderCount(0)
            }
          }}
          className={`relative px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
            activeTab === tab.key ? 'bg-amber-600 text-white' : 'bg-white text-gray-800 hover:shadow-xl'
          }`}
        >
          {tab.label}
          {tab.key === 'orders' && newOrderCount > 0 && (
            <div className="absolute -top-3 -right-3 flex items-center">
              <span className="bg-red-600 text-white text-sm font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg animate-pulse">
                {newOrderCount}
              </span>
              <Bell className="w-8 h-8 text-red-600 absolute -right-2 animate-ping" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}