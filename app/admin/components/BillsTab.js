// app/admin/components/BillsTab.js
export default function BillsTab({ orders, updateStatus, setShowPayConfirm }) {
  const unpaidGroups = Object.entries(
    orders.reduce((groups, order) => {
      if (order.status !== 'delivered') {
        const phone = order.address?.phone?.trim()
        const name = order.address?.name?.trim()
        const table = order.address?.table ? `Table ${order.address.table}` : 'Unknown'
        const key = phone || name || table

        if (!groups[key]) groups[key] = { orders: [], total: 0 }
        groups[key].orders.push(order)
        groups[key].total += order.total_amount || 0
      }
      return groups
    }, {})
  )

  const paidGroups = Object.entries(
    orders.filter(o => o.status === 'delivered').reduce((groups, order) => {
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

  return (
    <div className="space-y-12">
      <h2 className="text-5xl font-black mb-16 text-center text-gray-900">Customer Bills</h2>

      {orders.length === 0 ? (
        <p className="text-center text-4xl text-gray-500 py-32">No orders yet</p>
      ) : (
        <>
          {/* Unpaid Bills */}
          <div>
            <h3 className="text-4xl font-bold mb-10 text-red-600">Unpaid Bills</h3>
            {unpaidGroups.length === 0 ? (
              <p className="text-center text-2xl text-gray-500 py-16">No unpaid bills</p>
            ) : (
              unpaidGroups.map(([key, group]) => (
                <div key={key} className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 mb-12">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10">
                    <div>
                      <h3 className="text-4xl font-black text-gray-900">{key.startsWith('Table') ? key : key}</h3>
                      {group.orders[0].address?.name && !key.includes(group.orders[0].address.name) && (
                        <p className="text-2xl text-gray-600 mt-3">Name: {group.orders[0].address.name}</p>
                      )}
                    </div>
                    <p className="text-5xl font-black text-red-600">
                      Total: ₹{(group.total / 100).toFixed(0)}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {group.orders.map(o => (
                      <div key={o.id} className="border-l-8 border-red-600 pl-6 py-6 bg-red-50 rounded-2xl">
                        <p className="text-2xl font-bold">Order #{o.id}</p>
                        <p className="text-xl text-gray-700 mt-2">Table {o.address?.table || 'N/A'}</p>
                        <p className="text-xl mt-2">₹{(o.total_amount / 100).toFixed(0)} — {o.items?.length} items</p>
                        <select
                          value={o.status || 'pending'}
                          onChange={e => updateStatus(o.id, e.target.value)}
                          className="mt-4 px-6 py-3 text-lg font-bold rounded-xl bg-yellow-100"
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 text-center">
                    <button
                      onClick={() => setShowPayConfirm(group)}
                      className="bg-green-600 hover:bg-green-700 text-white px-16 py-6 rounded-3xl text-3xl font-bold shadow-2xl transition"
                    >
                      Mark All as Paid
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Paid Bills */}
          <div>
            <h3 className="text-4xl font-bold mb-10 text-green-600">Paid Bills</h3>
            {paidGroups.length === 0 ? (
              <p className="text-center text-2xl text-gray-500 py-16">No paid bills</p>
            ) : (
              paidGroups.map(([key, group]) => (
                <div key={key} className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 opacity-80 mb-12">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10">
                    <div>
                      <h3 className="text-4xl font-black text-gray-900">{key.startsWith('Table') ? key : key}</h3>
                      {group.orders[0].address?.name && !key.includes(group.orders[0].address.name) && (
                        <p className="text-2xl text-gray-600 mt-3">Name: {group.orders[0].address.name}</p>
                      )}
                    </div>
                    <p className="text-5xl font-black text-green-600">
                      Paid: ₹{(group.total / 100).toFixed(0)}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {group.orders.map(o => (
                      <div key={o.id} className="border-l-8 border-green-600 pl-6 py-6 bg-green-50 rounded-2xl">
                        <p className="text-2xl font-bold">Order #{o.id} — Paid</p>
                        <p className="text-xl text-gray-700 mt-2">Table {o.address?.table || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}