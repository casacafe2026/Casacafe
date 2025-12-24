// app/admin/components/Header.js
import { LogOut } from 'lucide-react'

export default function Header({ onLogout }) {
  return (
    <header className="bg-gradient-to-r from-amber-800 to-amber-900 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">CASA CAFÉ - ADMIN PANEL</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-lg shadow-lg"
        >
          <LogOut size={22} />
          Logout
        </button>
      </div>
    </header>
  )
}