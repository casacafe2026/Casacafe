// app/admin/components/PayModals.js
import { motion, AnimatePresence } from 'framer-motion'

export default function PayModals({
  showPayConfirm,
  setShowPayConfirm,
  updateStatus,
  showPaidSuccess,
  setShowPaidSuccess
}) {
  const firstOrder = showPayConfirm?.orders?.[0]

  return (
    <>
      {/* CONFIRM PAYMENT MODAL */}
      <AnimatePresence>
        {showPayConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl"
            >
              {/* TITLE */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 mb-2">
                Confirm Payment
              </h3>
              <p className="text-center text-gray-500 text-sm mb-6">
                Please verify details before marking as paid
              </p>

              {/* CUSTOMER INFO */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-1 text-left">
                <p className="font-bold text-lg text-gray-800">
                  {firstOrder?.address?.table
                    ? `Table ${firstOrder.address.table}`
                    : firstOrder?.address?.phone || 'Customer'}
                </p>

                {firstOrder?.address?.name && (
                  <p className="text-sm text-gray-600">
                    Name: {firstOrder.address.name}
                  </p>
                )}

                <p className="text-sm text-gray-600">
                  Orders: {showPayConfirm.orders.length}
                </p>
              </div>

              {/* TOTAL */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-3xl sm:text-4xl font-black text-green-600">
                  ₹{(showPayConfirm.total / 100).toFixed(0)}
                </p>
              </div>

              {/* WARNING */}
              <p className="text-center text-sm text-red-500 mb-6">
                This action cannot be undone
              </p>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowPayConfirm(null)}
                  className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    for (const o of showPayConfirm.orders) {
                      await updateStatus(o.id, 'delivered')
                    }
                    setShowPayConfirm(null)
                    setShowPaidSuccess(true)
                  }}
                  className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg transition"
                >
                  Confirm Paid
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showPaidSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl"
            >
              <h3 className="text-2xl sm:text-3xl font-extrabold text-green-600 mb-4">
                Payment Successful
              </h3>

              <p className="text-gray-600 mb-8">
                All orders have been marked as paid.
              </p>

              <button
                onClick={() => setShowPaidSuccess(false)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg transition"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
