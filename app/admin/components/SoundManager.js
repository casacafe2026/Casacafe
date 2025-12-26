// app/admin/components/SoundManager.js
'use client'

import { useEffect, useState } from 'react'

export default function SoundManager() {
  const [audioUnlocked, setAudioUnlocked] = useState(false)

  useEffect(() => {
    const unlockAudio = () => {
      // Create a silent audio to unlock
      const audio = new Audio()
      audio.play().catch(() => {})
      setAudioUnlocked(true)
      document.removeEventListener('click', unlockAudio)
      document.removeEventListener('touchstart', unlockAudio)
    }

    if (!audioUnlocked) {
      document.addEventListener('click', unlockAudio)
      document.addEventListener('touchstart', unlockAudio)
    }

    return () => {
      document.removeEventListener('click', unlockAudio)
      document.removeEventListener('touchstart', unlockAudio)
    }
  }, [audioUnlocked])

  if (audioUnlocked) return null

  return (
    <div className="fixed bottom-4 right-4 bg-[#4f193c] text-white px-6 py-4 rounded-2xl shadow-2xl z-50">
      <p className="text-lg font-bold">Click anywhere to enable notification sounds</p>
    </div>
  )
}