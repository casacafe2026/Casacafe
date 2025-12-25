// app/components/AddToCartToast.js
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, ShoppingCart } from 'lucide-react'

export default function AddToCartToast({ toastItems }) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <AnimatePresence>
        {toastItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="mb-3"
          >
            <div className="bg-[#4a3221] text-white rounded-2xl shadow-2xl px-8 py-6 flex items-center gap-5 min-w-[320px]">
              <div className="bg-green-600 rounded-full p-3">
                <Check size={32} />
              </div>
              <div>
                <p className="text-xl font-bold">Added to Cart!</p>
                <p className="text-sm opacity-90 mt-1">
                  {item.name} {item.variant && `• ${item.variant}`}
                  {item.addonsCount > 0 && ` + ${item.addonsCount} add-on${item.addonsCount > 1 ? 's' : ''}`}
                </p>
              </div>
              <ShoppingCart size={28} className="opacity-70" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}