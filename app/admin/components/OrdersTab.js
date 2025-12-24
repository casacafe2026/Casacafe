// app/admin/components/OrdersTab.js
export default function OrdersTab({ orders, updateStatus }) {
  return (
    <div className="space-y-8">
      {orders.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-4xl text-gray-500 font-medium">No orders yet</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-10">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Order #{order.id}</h3>
                  <div className="space-y-3 text-lg text-gray-700">
                    <p><span className="font-semibold">Table:</span> {order.address?.table || 'N/A'}</p>
                    {order.address?.name && <p><span className="font-semibold">Name:</span> {order.address.name}</p>}
                    {order.address?.phone && <p><span className="font-semibold">Phone:</span> {order.address.phone}</p>}
                  </div>
                </div>
                <select
                  value={order.status || 'pending'}
                  onChange={e => updateStatus(order.id, e.target.value)}
                  className="px-8 py-4 text-xl font-bold rounded-2xl bg-amber-100 text-amber-900 border-4 border-amber-300"
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              <p className="text-3xl font-black text-amber-600 mb-8">
                Total: ₹{(order.total_amount / 100).toFixed(0)}
              </p>

              <div className="bg-gray-50 rounded-2xl p-8">
                {order.items?.map((it, i) => (
                  <p key={i} className="py-4 text-xl font-medium text-gray-800 border-b border-gray-200 last:border-0">
                    {it.quantity} × {it.name}
                    {it.variant?.size && ` (${it.variant.size})`}
                    {it.variant?.variant && ` ${it.variant.variant}`}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}