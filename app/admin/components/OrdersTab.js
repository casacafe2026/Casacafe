'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase' // adjust path if needed
import { Trash2 } from 'lucide-react'

/* ---------- Time helpers ---------- */
function formatDateTime(date) {
  return new Date(date).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

function timeSince(date) {
  const created = new Date(date).getTime()
  const diff = Math.max(0, Math.floor((Date.now() - created) / 1000))
  const mins = Math.floor(diff / 60)
  const hrs = Math.floor(mins / 60)

  if (hrs > 0) return `${hrs}h ${mins % 60}m`
  if (mins > 0) return `${mins}m`
  return `${diff}s`
}

/* ------------------------------ */
export default function OrdersTab({ orders: initialOrders, updateStatus }) {
  const [orders, setOrders] = useState(initialOrders || [])
  const [search, setSearch] = useState('')
  const [, forceTick] = useState(0)
  const searchRef = useRef(null)
  const [orderToDelete, setOrderToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  /* Refresh timer every 10s for highlighting */
  useEffect(() => {
    const i = setInterval(() => forceTick(t => t + 1), 10000)
    return () => clearInterval(i)
  }, [])

  /* Autofocus search */
  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  /* Sync orders from props (if parent updates) */
  useEffect(() => {
    setOrders(initialOrders || [])
  }, [initialOrders])

  /* Filter by table + exclude deleted */
  const filteredOrders = useMemo(() => {
    const activeOrders = orders.filter(o => !o.deleted_at) // hide soft-deleted

    if (!search) return activeOrders

    return activeOrders.filter(o =>
      String(o.address?.table || '').toLowerCase().includes(search.toLowerCase())
    )
  }, [orders, search])

  const pendingOrders = filteredOrders.filter(o => o.status !== 'delivered' && o.status !== 'deleted')
  const completedOrders = filteredOrders.filter(o => o.status === 'delivered')

  const isOldOrder = (created_at) => {
    const diffMins = (Date.now() - new Date(created_at).getTime()) / 1000 / 60
    return diffMins > 10
  }

  /* Soft Delete Handler */
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return

    setDeleting(true)

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          deleted_at: new Date().toISOString(),
          status: 'deleted' // optional
        })
        .eq('id', orderToDelete)

      if (error) throw error

      // Remove from UI immediately
      setOrders(prev => prev.filter(o => o.id !== orderToDelete))

      alert('Order deleted successfully!')
    } catch (err) {
      console.error('Delete failed:', err)
      alert('Failed to delete order. Check console.')
    } finally {
      setDeleting(false)
      setOrderToDelete(null)
    }
  }

  return (
    <div className="space-y-8 relative">
      {/* SEARCH */}
      <div className="sticky top-0 z-20 bg-white pb-4">
        <input
          ref={searchRef}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by table number"
          className="w-full px-4 py-3 text-base sm:text-lg rounded-2xl border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-amber-200"
        />
      </div>

      {/* ================= PENDING ORDERS ================= */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-black text-amber-700 mb-6">
          Pending Orders ({pendingOrders.length})
        </h2>

        {pendingOrders.length === 0 ? (
          <p className="text-center text-gray-500 py-12 text-base sm:text-lg">
            No pending orders
          </p>
        ) : (
          pendingOrders.map(order => {
            const old = isOldOrder(order.created_at)

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl sm:rounded-3xl shadow-md sm:shadow-xl mb-6 sm:mb-8 border-l-4 sm:border-l-8
                            ${old ? 'border-red-500 ring-2 ring-red-200' : 'border-amber-400'}`}
              >
                <div className="p-4 sm:p-6">

                  {/* HEADER */}
                  <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">

                    {/* LEFT */}
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">
                        {formatDateTime(order.created_at)}
                      </p>

                      <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                        Table {order.address?.table || 'N/A'}
                      </h3>

                      <p className="text-gray-600 mt-1 text-sm sm:text-base">
                        Order #{order.id}
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col items-end gap-2 sm:gap-3">
                      <span className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm 
                                       ${old ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        ⏱ {timeSince(order.created_at)} ago
                      </span>

                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className="px-3 sm:px-5 py-2 sm:py-3 rounded-xl font-bold
                                   bg-amber-100 text-amber-900 text-sm sm:text-base
                                   border-2 border-amber-300"
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                      </select>

                      {/* Delete Button */}
                      <button
                        onClick={() => setOrderToDelete(order.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm mt-2 flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* ITEMS */}
                  <div className="bg-gray-50 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-4 divide-y">
                    {order.items?.map((it, i) => {
                      const unitPrice = it.variant?.price || 0
                      const totalPrice = unitPrice * it.quantity

                      return (
                        <div
                          key={i}
                          className="py-2 flex justify-between items-center text-sm sm:text-base"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">
                              {it.quantity} × {it.name}
                            </p>
                            {it.variant && (
                              <p className="text-xs sm:text-sm text-gray-500">
                                {it.variant.size} {it.variant.variant}
                              </p>
                            )}
                          </div>

                          <p className="font-bold text-gray-800">
                            ₹{(totalPrice / 100).toFixed(0)}
                          </p>
                        </div>
                      )
                    })}
                  </div>

                  {/* TOTAL */}
                  <div className="mt-3 sm:mt-4 flex justify-between items-center">
                    <p className="text-sm sm:text-base font-semibold text-gray-600">
                      Total Amount
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-amber-600">
                      ₹{(order.total_amount / 100).toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </section>

      {/* ================= COMPLETED ORDERS ================= */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-4">
          Completed Orders ({completedOrders.length})
        </h2>

        {completedOrders.length === 0 ? (
          <p className="text-center text-gray-500 py-8 text-base sm:text-lg">
            No completed orders yet
          </p>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {completedOrders.map(order => (
              <div
                key={order.id}
                className="bg-white/70 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 flex justify-between items-center border border-green-200"
              >
                <div>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">
                    Table {order.address?.table} — Order #{order.id}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {formatDateTime(order.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-lg sm:text-xl font-black text-green-600">
                    ₹{(order.total_amount / 100).toFixed(0)}
                  </p>

                  <button
                    onClick={() => setOrderToDelete(order.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete order"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-red-700 mb-4">
              Delete Order?
            </h3>
            <p className="text-gray-700 mb-8">
              This will soft-delete the order. It will no longer appear in any list.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setOrderToDelete(null)}
                disabled={deleting}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                disabled={deleting}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? 'Deleting...' : 'Delete'}
                {deleting && <span className="animate-spin">⏳</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* Soft Delete Handler */
async function handleDeleteOrder() {
  if (!orderToDelete) return

  setDeleting(true)

  try {
    const { error } = await supabase
      .from('orders')
      .update({
        deleted_at: new Date().toISOString(),
        status: 'deleted' // optional
      })
      .eq('id', orderToDelete)

    if (error) throw error

    // Remove from UI
    setOrders(prev => prev.filter(o => o.id !== orderToDelete))

    alert('Order soft-deleted successfully!')
  } catch (err) {
    console.error('Delete failed:', err)
    alert('Failed to delete order. Check console.')
  } finally {
    setDeleting(false)
    setOrderToDelete(null)
  }
}