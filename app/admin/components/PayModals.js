// app/admin/components/PayModals.js
export default function PayModals({
  showPayConfirm, setShowPayConfirm, updateStatus,
  showPaidSuccess, setShowPaidSuccess
}) {
  return (
    <>
      {showPayConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-12 sm:p-20 max-w-3xl w-full text-center shadow-2xl">
            <h3 className="text-5xl sm:text-6xl font-black mb-16 text-gray-900">
              Mark all orders as PAID?
            </h3>
            <p className="text-7xl font-black text-green-600 mb-20">
              ₹{(showPayConfirm.total / 100).toFixed(0)}
            </p>
            <p className="text-3xl text-red-600 mb-24 font-bold">
              This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-10">
              <button
                onClick={async () => {
                  for (const o of showPayConfirm.orders) {
                    await updateStatus(o.id, 'delivered')
                  }
                  setShowPayConfirm(null)
                  setShowPaidSuccess(true)
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-8 rounded-3xl text-4xl font-black shadow-2xl transition"
              >
                Yes, Mark as Paid
              </button>
              <button
                onClick={() => setShowPayConfirm(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-8 rounded-3xl text-4xl font-black shadow-2xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaidSuccess && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-16 max-w-2xl w-full text-center shadow-2xl">
            <h3 className="text-6xl font-black mb-16 text-green-600">
              All orders marked as PAID!
            </h3>
            <button
              onClick={() => setShowPaidSuccess(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-24 py-10 rounded-3xl text-5xl font-black shadow-2xl transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  )
}