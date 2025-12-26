'use client'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function BillsTab({ orders, updateStatus, setShowPayConfirm }) {
  const [search, setSearch] = useState('')
  const [showPaid, setShowPaid] = useState(false)
  const searchRef = useRef(null)

  // 🔍 Auto-focus search on load
  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  const groupOrders = (filterFn) =>
    Object.entries(
      orders.filter(filterFn).reduce((groups, order) => {
        const phone = order.address?.phone?.trim()
        const name = order.address?.name?.trim()
        const table = order.address?.table ? `Table ${order.address.table}` : 'Unknown'
        const key = phone || name || table

        if (!groups[key]) groups[key] = { orders: [], total: 0 }
        groups[key].orders.push(order)
        groups[key].total += order.total_amount || 0
        return groups
      }, {})
    )

  const unpaidGroups = groupOrders(o => o.status !== 'delivered')
  const paidGroups = groupOrders(o => o.status === 'delivered')

  // 🔎 Search filter
  const filterGroups = (groups) =>
    groups.filter(([key, group]) => {
      const searchable =
        `${key} ${group.orders[0]?.address?.name || ''} ${group.orders[0]?.address?.phone || ''}`.toLowerCase()
      return searchable.includes(search.toLowerCase())
    })

  const filteredUnpaid = useMemo(() => filterGroups(unpaidGroups), [search, unpaidGroups])
  const filteredPaid = useMemo(() => filterGroups(paidGroups), [search, paidGroups])

  return (
    <div className="space-y-8 px-4 sm:px-6 md:px-10 lg:px-16">
      {/* HEADER + SEARCH */}
      <div className="sticky top-0 z-40 bg-white pb-4 pt-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-4">
          Customer Bills
        </h2>

        <div className="max-w-xl mx-auto">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search by table, phone, or name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-200 focus:outline-none text-base sm:text-lg"
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-24 text-lg sm:text-xl">
          No orders yet
        </p>
      ) : (
        <>
          {/* 🔴 UNPAID (STICKY HEADER) */}
          <section>
            <div className="sticky top-[120px] z-30 bg-white py-2">
              <h3 className="text-xl sm:text-2xl font-bold text-red-600">
                Unpaid Bills ({filteredUnpaid.length})
              </h3>
            </div>

            {filteredUnpaid.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No unpaid bills found
              </p>
            ) : (
              <div className="space-y-6">
                {filteredUnpaid.map(([key, group]) => (
                  <div
                    key={key}
                    className="bg-white rounded-2xl border border-red-100 shadow-md p-4 sm:p-6"
                  >
                    {/* HEADER */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                      <div>
                        <p className="text-lg sm:text-xl font-bold">{key}</p>
                        {group.orders[0].address?.name && (
                          <p className="text-sm sm:text-base text-gray-500">
                            {group.orders[0].address.name}
                          </p>
                        )}
                      </div>
                      <p className="text-lg sm:text-xl font-extrabold text-red-600 mt-2 sm:mt-0">
                        ₹{(group.total / 100).toFixed(0)}
                      </p>
                    </div>

                    {/* ORDERS */}
                    <div className="space-y-3">
                      {group.orders.map(o => (
                        <div
                          key={o.id}
                          className="bg-red-50 border border-red-100 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4"
                        >
                          <div>
                            <p className="font-semibold text-base sm:text-lg">
                              Order #{o.id}
                            </p>
                            <p className="text-sm sm:text-base text-gray-600">
                              Table {o.address?.table || 'N/A'} • {o.items?.length} items
                            </p>
                            <p className="font-semibold text-sm sm:text-base mt-1">
                              ₹{(o.total_amount / 100).toFixed(0)}
                            </p>
                          </div>

                          <select
                            value={o.status || 'pending'}
                            onChange={e => updateStatus(o.id, e.target.value)}
                            className="px-4 py-2 rounded-lg border border-red-200 font-semibold text-sm sm:text-base mt-2 sm:mt-0"
                          >
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>
                      ))}
                    </div>

                    {/* MARK AS PAID */}
                    <div className="mt-4 sm:mt-6 text-center">
                      <button
                        onClick={() => setShowPayConfirm(group)}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 sm:px-10 sm:py-3 rounded-xl font-bold shadow transition text-base sm:text-lg"
                      >
                        Mark All as Paid
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 🟢 PAID (COLLAPSIBLE) */}
          <section className="pt-6">
            <button
              onClick={() => setShowPaid(!showPaid)}
              className="mx-auto flex items-center gap-2 text-green-700 font-bold text-lg sm:text-xl mb-4"
            >
              {showPaid ? 'Hide Paid Bills ▲' : 'Show Paid Bills ▼'} ({filteredPaid.length})
            </button>

            {showPaid && (
              <div className="space-y-4">
                {filteredPaid.length === 0 ? (
                  <p className="text-center text-gray-500 py-6">
                    No paid bills found
                  </p>
                ) : (
                  filteredPaid.map(([key, group]) => (
                    <div
                      key={key}
                      className="bg-white rounded-2xl border border-green-100 shadow-sm p-3 sm:p-4"
                    >
                      <div className="flex justify-between mb-2">
                        <p className="font-bold text-base sm:text-lg">{key}</p>
                        <p className="font-bold text-green-600 text-base sm:text-lg">
                          ₹{(group.total / 100).toFixed(0)}
                        </p>
                      </div>

                      {group.orders.map(o => (
                        <p
                          key={o.id}
                          className="text-sm sm:text-base text-gray-700 bg-green-50 rounded-lg px-3 py-2 mb-1"
                        >
                          Order #{o.id} • Table {o.address?.table || 'N/A'}
                        </p>
                      ))}
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
