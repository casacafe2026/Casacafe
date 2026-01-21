'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../../lib/supabase'

export default function SalesReportTab({ /* you can pass adminData props if needed */ }) {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('today') // today, week, month, all

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true)

      let query = supabase
        .from('orders')
        .select('id, created_at, total_amount, status, address')
        .eq('status', 'delivered')
        .is('deleted_at', null)

      const now = new Date()
      if (filter === 'today') {
        query = query.gte('created_at', now.toISOString().split('T')[0])
      } else if (filter === 'week') {
        const weekAgo = new Date(now)
        weekAgo.setDate(now.getDate() - 7)
        query = query.gte('created_at', weekAgo.toISOString())
      } else if (filter === 'month') {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        query = query.gte('created_at', monthStart.toISOString())
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (!error) setSales(data || [])
      setLoading(false)
    }

    fetchSales()
  }, [filter])

  const totalSales = useMemo(() => 
    sales.reduce((sum, o) => sum + (o.total_amount / 100), 0).toFixed(2), [sales])

  const orderCount = sales.length
  const avgOrder = orderCount > 0 ? (totalSales / orderCount).toFixed(2) : '0.00'

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-black text-amber-700">
          Sales Report
        </h2>

        <div className="flex flex-wrap gap-3">
          {['today', 'week', 'month', 'all'].map(opt => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition
                ${filter === opt ? 'bg-amber-600 text-white shadow' : 'bg-white border hover:bg-gray-100'}`}
            >
              {opt === 'today' ? 'Today' :
               opt === 'week' ? 'Last 7 Days' :
               opt === 'month' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin h-12 w-12 border-4 border-amber-600 rounded-full border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sales...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-4xl font-black text-amber-600 mt-2">₹{totalSales}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
              <p className="text-sm text-gray-600">Completed Orders</p>
              <p className="text-4xl font-black text-green-600 mt-2">{orderCount}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
              <p className="text-sm text-gray-600">Avg. Order Value</p>
              <p className="text-4xl font-black text-purple-600 mt-2">₹{avgOrder}</p>
            </div>
          </div>

          {/* Table */}
          {sales.length === 0 ? (
            <p className="text-center py-16 text-gray-500 text-lg">
              No completed sales in this period
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Table</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sales.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDateTime(order.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        Table {order.address?.table || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-green-600">
                        ₹{(order.total_amount / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* Helper - reuse your existing one or add here */
function formatDateTime(date) {
  return new Date(date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}