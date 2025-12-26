'use client'
import { useEffect, useMemo, useRef, useState } from 'react'

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
export default function OrdersTab({ orders, updateStatus }) {
  const [search, setSearch] = useState('')
  const [, forceTick] = useState(0)
  const searchRef = useRef(null)

  /* refresh timer every 10s for highlighting */
  useEffect(() => {
    const i = setInterval(() => forceTick(t => t + 1), 10000)
    return () => clearInterval(i)
  }, [])

  /* autofocus search */
  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  /* filter by table */
  const filteredOrders = useMemo(() => {
    if (!search) return orders
    return orders.filter(o =>
      String(o.address?.table || '').includes(search)
    )
  }, [orders, search])

  const pendingOrders = filteredOrders.filter(o => o.status !== 'delivered')
  const completedOrders = filteredOrders.filter(o => o.status === 'delivered')

  const isOldOrder = (created_at) => {
    const diffMins = (Date.now() - new Date(created_at).getTime()) / 1000 / 60
    return diffMins > 10
  }

  return (
    <div className="space-y-8">

      {/* SEARCH */}
      <div className="sticky top-0 z-20 bg-white pb-4">
        <input
          ref={searchRef}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by table number"
          className="w-full px-4 py-3 text-base sm:text-lg rounded-2xl border-2 border-gray-300
                     focus:outline-none focus:ring-4 focus:ring-amber-200"
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

              <p className="text-lg sm:text-xl font-black text-green-600">
                ₹{(order.total_amount / 100).toFixed(0)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
