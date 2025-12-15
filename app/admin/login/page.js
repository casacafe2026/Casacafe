'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'  // ← Correct path for app/admin/login/page.js
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert('Login failed: ' + error.message)
    } else {
      router.push('/admin')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-6">
      <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-md w-full">
        <h1 className="text-5xl font-bold text-center mb-8 text-amber-800">
          Admin Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-6 py-4 border-2 border-amber-200 rounded-xl text-xl focus:border-amber-600 outline-none transition"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-6 py-4 border-2 border-amber-200 rounded-xl text-xl focus:border-amber-600 outline-none transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white py-6 rounded-xl text-2xl font-bold shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}