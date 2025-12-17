// app/admin/page.js
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import { Plus, Edit2, Trash2, X, Save, Star, LogOut, Bell } from 'lucide-react'
import Image from 'next/image'

export default function AdminPanel() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [allItems, setAllItems] = useState([])
  const [specialItems, setSpecialItems] = useState([])
  const [combos, setCombos] = useState([])
  const [user, setUser] = useState(null)
  const [newOrderCount, setNewOrderCount] = useState(0)

  // Form States
  const [catName, setCatName] = useState('')
  const [editingCat, setEditingCat] = useState(null)
  const [showItemModal, setShowItemModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedCat, setSelectedCat] = useState('')
  const [itemName, setItemName] = useState('')
  const [desc, setDesc] = useState('')
  const [isVeg, setIsVeg] = useState(true)
  const [pricingType, setPricingType] = useState('fixed')
  const [isSpecial, setIsSpecial] = useState(false)
  const [variants, setVariants] = useState([{ size: '', variant: '', price: '' }])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  // Today's Special States
  const [showSpecialModal, setShowSpecialModal] = useState(false)
  const [editingSpecialItem, setEditingSpecialItem] = useState(null)
  const [specialName, setSpecialName] = useState('')
  const [specialPrice, setSpecialPrice] = useState('')
  const [specialImageFile, setSpecialImageFile] = useState(null)
  const [specialImagePreview, setSpecialImagePreview] = useState('')

  // Combo States
  const [showComboModal, setShowComboModal] = useState(false)
  const [editingCombo, setEditingCombo] = useState(null)
  const [comboName, setComboName] = useState('')
  const [comboDesc, setComboDesc] = useState('')
  const [comboPrice, setComboPrice] = useState('')
  const [comboImageFile, setComboImageFile] = useState(null)
  const [comboImagePreview, setComboImagePreview] = useState('')
  const [selectedComboItems, setSelectedComboItems] = useState([])

  // Modal States
  const [showPayConfirm, setShowPayConfirm] = useState(null)
  const [showPaidSuccess, setShowPaidSuccess] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/admin/login')
      } else {
        setUser(user)
        fetchOrders()
        fetchCategories()
        fetchAllItems()
        fetchSpecialItems()
        fetchCombos()
      }
    }
    checkUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) router.push('/admin/login')
    })

    // REALTIME ORDERS - Reliable sound + badge
    const channel = supabase
      .channel('orders-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        const newOrder = payload.new
        setOrders(prev => [newOrder, ...prev])

        // Play a reliable, short notification chime
        const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/24/audio_4e54e4f9b9.mp3?filename=ding-36030.mp3')
        audio.volume = 0.7
        audio.play().catch(e => console.log('Sound play failed:', e))

        // Update badge
        updateNewOrderCount()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders()
      })
      .subscribe()

    return () => {
      listener?.subscription.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [router])

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    updateNewOrderCount()
  }

  const updateNewOrderCount = () => {
    const pending = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length
    setNewOrderCount(pending)
  }

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*, items(*, item_variants(*))')
      .order('display_order')
    setCategories(data || [])
  }

  const fetchAllItems = async () => {
    const { data } = await supabase.from('items').select('id, name, is_special')
    setAllItems(data || [])
  }

  const fetchSpecialItems = async () => {
    const { data } = await supabase.from('today_special').select('*')
    setSpecialItems(data || [])
  }

  const fetchCombos = async () => {
    const { data } = await supabase.from('combos').select('*')
    setCombos(data || [])
  }

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) {
      alert('Failed to update status: ' + error.message)
    } else {
      fetchOrders()
    }
  }

  const saveCategory = async () => {
    if (!catName.trim()) return
    if (editingCat) {
      await supabase.from('categories').update({ name: catName }).eq('id', editingCat)
    } else {
      await supabase.from('categories').insert({ name: catName })
    }
    setCatName('')
    setEditingCat(null)
    fetchCategories()
  }

  const deleteCategory = async (id) => {
    if (!confirm('Delete category and all items?')) return
    await supabase.from('items').delete().eq('category_id', id)
    await supabase.from('categories').delete().eq('id', id)
    fetchCategories()
  }

  const openEditItem = (item) => {
    setEditingItem(item)
    setSelectedCat(item.category_id)
    setItemName(item.name)
    setDesc(item.description || '')
    setIsVeg(item.is_veg)
    setPricingType(item.pricing_type || 'fixed')
    setIsSpecial(item.is_special || false)
    setImagePreview(item.base_image_url || '')
    setVariants(item.item_variants?.map(v => ({
      size: v.size || '',
      variant: v.variant || '',
      price: (v.price / 100).toFixed(0)
    })) || [{ size: '', variant: '', price: '' }])
    setShowItemModal(true)
  }

  const saveItem = async () => {
    if (!itemName || !selectedCat || variants.some(v => !v.price)) return

    let imageUrl = imagePreview
    if (imageFile) {
      const fileName = `item-${Date.now()}.jpg`
      const { error } = await supabase.storage
        .from('menu-images')
        .upload(fileName, imageFile, { upsert: true })
      if (error) {
        alert('Image upload failed: ' + error.message)
        return
      }
      const { data } = supabase.storage.from('menu-images').getPublicUrl(fileName)
      imageUrl = data.publicUrl
    }

    const itemData = {
      category_id: selectedCat,
      name: itemName,
      description: desc || null,
      is_veg: isVeg,
      pricing_type: pricingType,
      base_image_url: imageUrl || null,
      is_special: isSpecial
    }

    try {
      let itemId
      if (editingItem) {
        const { error } = await supabase.from('items').update(itemData).eq('id', editingItem.id)
        if (error) throw error
        itemId = editingItem.id
        await supabase.from('item_variants').delete().eq('item_id', itemId)
      } else {
        const { data, error } = await supabase.from('items').insert(itemData).select().single()
        if (error) throw error
        itemId = data.id
      }

      for (const v of variants) {
        if (v.price) {
          await supabase.from('item_variants').insert({
            item_id: itemId,
            size: v.size || null,
            variant: v.variant || null,
            price: parseInt(v.price) * 100,
            is_default: variants.indexOf(v) === 0
          })
        }
      }

      setShowItemModal(false)
      resetItemForm()
      fetchCategories()
      alert('Item saved successfully!')
    } catch (err) {
      alert('Save failed: ' + err.message)
    }
  }

  const deleteItem = async (id) => {
    if (!confirm('Delete item forever?')) return
    await supabase.from('item_variants').delete().eq('item_id', id)
    await supabase.from('items').delete().eq('id', id)
    fetchCategories()
  }

  const resetItemForm = () => {
    setEditingItem(null)
    setItemName('')
    setDesc('')
    setIsVeg(true)
    setPricingType('fixed')
    setIsSpecial(false)
    setVariants([{ size: '', variant: '', price: '' }])
    setImageFile(null)
    setImagePreview('')
  }

  const addVariant = () => setVariants([...variants, { size: '', variant: '', price: '' }])
  const removeVariant = (i) => setVariants(variants.filter((_, idx) => idx !== i))
  const updateVariant = (i, field, value) => {
    const newV = [...variants]
    newV[i][field] = value
    setVariants(newV)
  }

  const openSpecialModal = (item = null) => {
    if (item) {
      setEditingSpecialItem(item)
      setSpecialName(item.name)
      setSpecialPrice((item.price / 100).toFixed(0))
      setSpecialImagePreview(item.base_image_url || '')
    } else {
      setEditingSpecialItem(null)
      setSpecialName('')
      setSpecialPrice('')
      setSpecialImagePreview('')
      setSpecialImageFile(null)
    }
    setShowSpecialModal(true)
  }

  const saveSpecialItem = async () => {
    if (!specialName.trim() || !specialPrice) {
      alert('Please enter name and price')
      return
    }

    let imageUrl = specialImagePreview
    if (specialImageFile) {
      const fileName = `special-${Date.now()}.jpg`
      const { error } = await supabase.storage
        .from('menu-images')
        .upload(fileName, specialImageFile, { upsert: true })
      if (error) {
        alert('Image upload failed')
        return
      }
      const { data } = supabase.storage.from('menu-images').getPublicUrl(fileName)
      imageUrl = data.publicUrl
    }

    const payload = {
      name: specialName.trim(),
      price: parseInt(specialPrice) * 100,
      base_image_url: imageUrl || null
    }

    if (editingSpecialItem) {
      await supabase.from('today_special').update(payload).eq('id', editingSpecialItem.id)
    } else {
      await supabase.from('today_special').insert(payload)
    }

    setShowSpecialModal(false)
    setSpecialName('')
    setSpecialPrice('')
    setSpecialImageFile(null)
    setSpecialImagePreview('')
    setEditingSpecialItem(null)
    fetchSpecialItems()
    alert('Special item saved!')
  }

  const deleteSpecialItem = async (id) => {
    if (!confirm('Delete this special item?')) return
    await supabase.from('today_special').delete().eq('id', id)
    fetchSpecialItems()
  }

  const toggleExistingSpecial = async (itemId, current) => {
    await supabase.from('items').update({ is_special: !current }).eq('id', itemId)
    fetchCategories()
    fetchAllItems()
  }

  const openComboModal = (combo = null) => {
    if (combo) {
      setEditingCombo(combo)
      setComboName(combo.name)
      setComboDesc(combo.description || '')
      setComboPrice((combo.price / 100).toFixed(0))
      setComboImagePreview(combo.base_image_url || '')
      setSelectedComboItems(combo.item_ids || [])
    } else {
      setEditingCombo(null)
      setComboName('')
      setComboDesc('')
      setComboPrice('')
      setComboImagePreview('')
      setComboImageFile(null)
      setSelectedComboItems([])
    }
    setShowComboModal(true)
  }

  const saveCombo = async () => {
    if (!comboName.trim() || !comboPrice || selectedComboItems.length === 0) {
      alert('Please fill name, price and select at least one item')
      return
    }

    let imageUrl = comboImagePreview
    if (comboImageFile) {
      const fileName = `combo-${Date.now()}.jpg`
      const { error } = await supabase.storage
        .from('menu-images')
        .upload(fileName, comboImageFile, { upsert: true })
      if (error) {
        alert('Image upload failed')
        return
      }
      const { data } = supabase.storage.from('menu-images').getPublicUrl(fileName)
      imageUrl = data.publicUrl
    }

    const payload = {
      name: comboName.trim(),
      description: comboDesc || null,
      price: parseInt(comboPrice) * 100,
      base_image_url: imageUrl || null,
      item_ids: selectedComboItems
    }

    if (editingCombo) {
      await supabase.from('combos').update(payload).eq('id', editingCombo.id)
    } else {
      await supabase.from('combos').insert(payload)
    }

    setShowComboModal(false)
    setComboName('')
    setComboDesc('')
    setComboPrice('')
    setComboImageFile(null)
    setComboImagePreview('')
    setSelectedComboItems([])
    setEditingCombo(null)
    fetchCombos()
    alert('Combo saved successfully!')
  }

  const deleteCombo = async (id) => {
    if (!confirm('Delete combo permanently?')) return
    await supabase.from('combos').delete().eq('id', id)
    fetchCombos()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ADMIN HEADER */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white p-4 sm:p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-center sm:text-left">CASA CAFÉ - ADMIN PANEL</h1>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-lg">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* TABS WITH RED BADGE + BELL ICON */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center sm:justify-start">
          <button 
            onClick={() => {
              setActiveTab('orders')
              setNewOrderCount(0) // Clear badge on click
            }} 
            className={`relative px-6 py-3 rounded-xl text-lg sm:text-xl font-bold transition ${activeTab === 'orders' ? 'bg-amber-600 text-white' : 'bg-white'}`}
          >
            Orders ({orders.length})
            {newOrderCount > 0 && (
              <div className="absolute -top-3 -right-3 flex items-center">
                <span className="bg-red-600 text-white text-sm font-bold rounded-full w-9 h-9 flex items-center justify-center shadow-lg z-10 animate-pulse">
                  {newOrderCount}
                </span>
                <Bell className="w-7 h-7 text-red-600 absolute -right-1 animate-ping" />
              </div>
            )}
          </button>

          <button onClick={() => setActiveTab('menu')} className={`px-6 py-3 rounded-xl text-lg sm:text-xl font-bold transition ${activeTab === 'menu' ? 'bg-amber-600 text-white' : 'bg-white'}`}>
            Menu
          </button>
          <button onClick={() => setActiveTab('bills')} className={`px-6 py-3 rounded-xl text-lg sm:text-xl font-bold transition ${activeTab === 'bills' ? 'bg-amber-600 text-white' : 'bg-white'}`}>
            Bills
          </button>
          <button onClick={() => setActiveTab('special')} className={`px-6 py-3 rounded-xl text-lg sm:text-xl font-bold transition ${activeTab === 'special' ? 'bg-amber-600 text-white' : 'bg-white'}`}>
            Today's Special
          </button>
          <button onClick={() => setActiveTab('combos')} className={`px-6 py-3 rounded-xl text-lg sm:text-xl font-bold transition ${activeTab === 'combos' ? 'bg-amber-600 text-white' : 'bg-white'}`}>
            Combos
          </button>
        </div>

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            {orders.length === 0 ? (
              <p className="text-center text-2xl sm:text-3xl text-gray-500 py-20">No orders yet</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold">Order #{order.id}</h3>
                      <p className="text-lg sm:text-xl text-gray-600 mt-2">
                        Table: <span className="font-bold">{order.address?.table || 'N/A'}</span>
                      </p>
                      {order.address?.name && (
                        <p className="text-lg sm:text-xl text-gray-600">
                          Name: <span className="font-bold">{order.address.name}</span>
                        </p>
                      )}
                      {order.address?.phone && (
                        <p className="text-lg sm:text-xl text-gray-600">
                          Phone: <span className="font-bold">{order.address.phone}</span>
                        </p>
                      )}
                    </div>
                    <select 
                      value={order.status || 'pending'} 
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className="px-4 py-2 sm:px-6 sm:py-3 text-lg sm:text-xl font-bold rounded-xl bg-yellow-100 w-full sm:w-auto"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>

                  <p className="text-xl sm:text-2xl font-bold mb-4">
                    Total: ₹{(order.total_amount / 100).toFixed(0)}
                  </p>

                  <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                    {order.items?.map((it, i) => (
                      <p key={i} className="py-2 text-lg sm:text-xl">
                        {it.quantity} × {it.name} 
                        {it.variant?.size && ` (${it.variant.size})`}
                        {it.variant?.variant && ` ${it.variant.variant}`}
                      </p>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* BILLS TAB */}
        {activeTab === 'bills' && (
          <div className="space-y-12">
            <h2 className="text-4xl sm:text-5xl font-black mb-12 text-center">Customer Bills</h2>

            {orders.length === 0 ? (
              <p className="text-center text-3xl sm:text-4xl text-gray-500 py-20">No orders yet</p>
            ) : (
              <>
                {/* UNPAID BILLS */}
                <div>
                  <h3 className="text-3xl sm:text-4xl font-bold mb-8 text-red-600">Unpaid Bills</h3>
                  {Object.entries(
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
                  ).length === 0 ? (
                    <p className="text-center text-xl sm:text-2xl text-gray-500 py-12">No unpaid bills</p>
                  ) : (
                    Object.entries(
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
                    ).map(([key, group]) => (
                      <div key={key} className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl mb-12">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                          <div>
                            <h3 className="text-3xl sm:text-4xl font-black">
                              {key.startsWith('Table') ? key : key}
                            </h3>
                            {group.orders[0].address?.name && !key.includes(group.orders[0].address.name) && (
                              <p className="text-xl sm:text-2xl text-gray-600 mt-2">Name: {group.orders[0].address.name}</p>
                            )}
                          </div>
                          <p className="text-4xl sm:text-5xl font-black text-red-600">
                            Total: ₹{(group.total / 100).toFixed(0)}
                          </p>
                        </div>

                        <div className="space-y-6">
                          {group.orders.map(o => (
                            <div key={o.id} className="border-l-4 border-red-600 pl-4 sm:pl-6 py-4 bg-red-50 rounded-xl">
                              <p className="text-lg sm:text-xl font-bold">Order #{o.id}</p>
                              <p className="text-base sm:text-lg text-gray-600">Table {o.address?.table || 'N/A'}</p>
                              <p className="text-base sm:text-lg">₹{(o.total_amount / 100).toFixed(0)} — {o.items?.length} items</p>
                              <select 
                                value={o.status || 'pending'} 
                                onChange={e => updateStatus(o.id, e.target.value)}
                                className="mt-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-yellow-100 font-bold text-sm sm:text-base"
                              >
                                <option value="pending">Pending</option>
                                <option value="preparing">Preparing</option>
                                <option value="ready">Ready</option>
                                <option value="delivered">Delivered</option>
                              </select>
                            </div>
                          ))}
                        </div>

                        <div className="mt-8 text-center sm:text-right">
                          <button 
                            onClick={() => setShowPayConfirm(group)}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 sm:px-12 sm:py-6 rounded-2xl text-2xl sm:text-3xl font-bold shadow-lg"
                          >
                            Mark All as Paid
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* PAID BILLS */}
                <div>
                  <h3 className="text-3xl sm:text-4xl font-bold mb-8 text-green-600">Paid Bills</h3>
                  {orders.filter(o => o.status === 'delivered').length === 0 ? (
                    <p className="text-center text-xl sm:text-2xl text-gray-500 py-12">No paid bills</p>
                  ) : (
                    Object.entries(
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
                    ).map(([key, group]) => (
                      <div key={key} className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl opacity-70 mb-12">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                          <div>
                            <h3 className="text-3xl sm:text-4xl font-black">
                              {key.startsWith('Table') ? key : key}
                            </h3>
                            {group.orders[0].address?.name && !key.includes(group.orders[0].address.name) && (
                              <p className="text-xl sm:text-2xl text-gray-600 mt-2">Name: {group.orders[0].address.name}</p>
                            )}
                          </div>
                          <p className="text-4xl sm:text-5xl font-black text-green-600">
                            Paid: ₹{(group.total / 100).toFixed(0)}
                          </p>
                        </div>

                        <div className="space-y-4">
                          {group.orders.map(o => (
                            <div key={o.id} className="border-l-4 border-green-600 pl-4 sm:pl-6 py-4 bg-green-50 rounded-xl">
                              <p className="text-lg sm:text-xl font-bold">Order #{o.id} — Paid</p>
                              <p className="text-base sm:text-lg text-gray-600">Table {o.address?.table || 'N/A'}</p>
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
        )}

        {/* MENU TAB */}
        {activeTab === 'menu' && (
          <div className="space-y-12">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Categories</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <input value={catName} onChange={e => setCatName(e.target.value)} placeholder="Category name" className="flex-1 px-6 py-4 border rounded-xl text-lg sm:text-xl" />
                <button onClick={saveCategory} className="bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg">
                  {editingCat ? 'Update' : 'Add'}
                </button>
              </div>
            </div>

            {categories.map(cat => (
              <div key={cat.id} className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h3 className="text-2xl sm:text-3xl font-bold">{cat.name}</h3>
                  <div className="flex gap-3 flex-wrap">
                    <button onClick={() => { setEditingCat(cat.id); setCatName(cat.name) }} className="text-blue-600"><Edit2 size={24} /></button>
                    <button onClick={() => deleteCategory(cat.id)} className="text-red-600"><Trash2 size={24} /></button>
                    <button onClick={() => { setSelectedCat(cat.id); setShowItemModal(true); resetItemForm() }} className="bg-amber-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold text-sm sm:text-base">
                      Add Item
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                  {cat.items?.map(item => (
                    <div key={item.id} className="border p-4 sm:p-6 rounded-xl">
                      {item.base_image_url ? (
                        <div className="relative w-full h-40 sm:h-48 mb-4">
                          <Image src={item.base_image_url} alt={item.name} fill className="object-cover rounded-xl" unoptimized />
                        </div>
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-40 sm:h-48 mb-4" />
                      )}
                      <h4 className="font-bold text-lg sm:text-xl mb-2">{item.name}</h4>
                      {item.is_special && <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">SPECIAL</span>}
                      <div className="mt-3 space-y-1 text-sm">
                        {item.item_variants?.map(v => (
                          <p key={v.id}>{v.size} {v.variant} → ₹{(v.price / 100).toFixed(0)}</p>
                        ))}
                      </div>
                      <div className="flex gap-2 sm:gap-3 mt-4">
                        <button onClick={() => openEditItem(item)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs sm:text-sm">Edit</button>
                        <button onClick={() => deleteItem(item.id)} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs sm:text-sm">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TODAY'S SPECIAL TAB */}
        {activeTab === 'special' && (
          <div className="space-y-12">
            <div className="text-center">
              <button 
                onClick={() => openSpecialModal()}
                className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-4 rounded-full text-xl font-bold shadow-lg flex items-center gap-3 mx-auto"
              >
                <Plus size={24} /> Add New Special Item
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {specialItems.length === 0 ? (
                <p className="text-center text-xl text-gray-500 col-span-full py-12">No special items yet</p>
              ) : (
                specialItems.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-xl p-6 text-center">
                    {item.base_image_url && (
                      <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden">
                        <Image src={item.base_image_url} alt={item.name} fill className="object-cover" unoptimized />
                      </div>
                    )}
                    <h3 className="text-2xl font-bold mb-3">{item.name}</h3>
                    <p className="text-3xl font-bold text-amber-600 mb-6">₹{(item.price / 100).toFixed(0)}</p>
                    <div className="flex gap-4">
                      <button onClick={() => openSpecialModal(item)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold">
                        Edit
                      </button>
                      <button onClick={() => deleteSpecialItem(item.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-center mb-8">Feature Existing Menu Items</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allItems.map(item => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-5 text-center">
                    <p className="text-xl font-medium mb-4">{item.name}</p>
                    <button
                      onClick={() => toggleExistingSpecial(item.id, item.is_special)}
                      className={`px-6 py-3 rounded-full font-bold ${item.is_special ? 'bg-amber-600 text-white' : 'bg-gray-300'}`}
                    >
                      {item.is_special ? '★ Featured' : 'Mark as Special'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COMBOS TAB */}
        {activeTab === 'combos' && (
          <div className="space-y-12">
            <div className="text-center">
              <button 
                onClick={() => openComboModal()}
                className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-4 rounded-full text-xl font-bold shadow-lg flex items-center gap-3 mx-auto"
              >
                <Plus size={24} /> Add New Combo
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {combos.length === 0 ? (
                <p className="text-center text-xl text-gray-500 col-span-full py-12">No combos yet</p>
              ) : (
                combos.map(combo => (
                  <div key={combo.id} className="bg-white rounded-2xl shadow-xl p-6 text-center">
                    {combo.base_image_url && (
                      <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden">
                        <Image src={combo.base_image_url} alt={combo.name} fill className="object-cover" unoptimized />
                      </div>
                    )}
                    <h3 className="text-2xl font-bold mb-3">{combo.name}</h3>
                    {combo.description && <p className="text-gray-600 mb-4">{combo.description}</p>}
                    <p className="text-3xl font-bold text-amber-600 mb-6">₹{(combo.price / 100).toFixed(0)}</p>
                    <p className="text-sm text-gray-500 mb-6">Includes {combo.item_ids?.length || 0} items</p>
                    <div className="flex gap-4">
                      <button onClick={() => openComboModal(combo)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold">
                        Edit
                      </button>
                      <button onClick={() => deleteCombo(combo.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ITEM MODAL */}
        {showItemModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-4xl w-full max-h-screen overflow-y-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>

              <input value={itemName} onChange={e => setItemName(e.target.value)} placeholder="Item Name" className="w-full px-6 py-4 border rounded-xl mb-6 text-lg sm:text-xl" />

              <div className="mb-8">
                <label className="block text-xl sm:text-2xl font-bold mb-4">Item Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setImageFile(file)
                      setImagePreview(URL.createObjectURL(file))
                    }
                  }}
                  className="w-full px-6 py-4 border-2 border-dashed rounded-xl text-base sm:text-lg"
                />
                {imagePreview && (
                  <div className="mt-4 relative w-full h-48 sm:h-64">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover rounded-xl" />
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <label className="flex items-center gap-3 text-lg sm:text-xl">
                  <input type="radio" checked={isVeg} onChange={() => setIsVeg(true)} />
                  <span className="text-green-600 font-bold">VEG</span>
                </label>
                <label className="flex items-center gap-3 text-lg sm:text-xl">
                  <input type="radio" checked={!isVeg} onChange={() => setIsVeg(false)} />
                  <span className="text-red-600 font-bold">NON-VEG</span>
                </label>
                <label className="flex items-center gap-3 text-lg sm:text-xl sm:ml-auto">
                  <input type="checkbox" checked={isSpecial} onChange={e => setIsSpecial(e.target.checked)} />
                  <span className="flex items-center gap-2">Today's Special</span>
                </label>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold">Variants</h3>
                {variants.map((v, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-4 items-center">
                    <input value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} placeholder="Size" className="flex-1 px-6 py-4 border rounded-xl" />
                    <input value={v.variant} onChange={e => updateVariant(i, 'variant', e.target.value)} placeholder="Variant" className="flex-1 px-6 py-4 border rounded-xl" />
                    <input type="number" value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} placeholder="Price ₹" className="w-32 px-6 py-4 border rounded-xl" />
                    {variants.length > 1 && (
                      <button onClick={() => removeVariant(i)} className="text-red-600"><X size={28} /></button>
                    )}
                  </div>
                ))}
                <button onClick={addVariant} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 w-full sm:w-auto">
                  <Plus size={20} /> Add Variant
                </button>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-10">
                <button onClick={saveItem} className="bg-green-600 text-white px-12 py-4 rounded-xl text-xl sm:text-2xl font-bold">
                  {editingItem ? 'Update' : 'Save'}
                </button>
                <button onClick={() => { setShowItemModal(false); resetItemForm() }} className="bg-gray-600 text-white px-12 py-4 rounded-xl text-xl sm:text-2xl font-bold">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TODAY'S SPECIAL MODAL */}
        {showSpecialModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6 text-center">{editingSpecialItem ? 'Edit' : 'Add'} Special Item</h2>
              <div className="space-y-5">
                <input value={specialName} onChange={e => setSpecialName(e.target.value)} placeholder="Item Name" className="w-full px-5 py-3 border rounded-lg text-lg" />
                <input type="number" value={specialPrice} onChange={e => setSpecialPrice(e.target.value)} placeholder="Price ₹" className="w-full px-5 py-3 border rounded-lg text-lg" />
                <input type="file" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setSpecialImageFile(file)
                    setSpecialImagePreview(URL.createObjectURL(file))
                  }
                }} className="w-full" />
                {specialImagePreview && (
                  <div className="relative w-full h-56 rounded-lg overflow-hidden">
                    <Image src={specialImagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={saveSpecialItem} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold">
                  Save
                </button>
                <button onClick={() => setShowSpecialModal(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-bold">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* COMBO MODAL */}
        {showComboModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">{editingCombo ? 'Edit' : 'Add'} Combo</h2>
              <div className="space-y-5">
                <input value={comboName} onChange={e => setComboName(e.target.value)} placeholder="Combo Name" className="w-full px-5 py-3 border rounded-lg text-lg" />
                <textarea value={comboDesc} onChange={e => setComboDesc(e.target.value)} placeholder="Description (optional)" className="w-full px-5 py-3 border rounded-lg text-lg h-24" />
                <input type="number" value={comboPrice} onChange={e => setComboPrice(e.target.value)} placeholder="Price ₹" className="w-full px-5 py-3 border rounded-lg text-lg" />
                <input type="file" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setComboImageFile(file)
                    setComboImagePreview(URL.createObjectURL(file))
                  }
                }} className="w-full" />
                {comboImagePreview && (
                  <div className="relative w-full h-56 rounded-lg overflow-hidden">
                    <Image src={comboImagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="font-medium mb-3">Select Items</p>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {allItems.map(item => (
                      <label key={item.id} className="flex items-center gap-3 py-2">
                        <input type="checkbox" checked={selectedComboItems.includes(item.id)} onChange={e => {
                          if (e.target.checked) setSelectedComboItems([...selectedComboItems, item.id])
                          else setSelectedComboItems(selectedComboItems.filter(id => id !== item.id))
                        }} className="w-5 h-5" />
                        <span>{item.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={saveCombo} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold">
                  Save Combo
                </button>
                <button onClick={() => setShowComboModal(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-bold">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM CONFIRM MODAL FOR MARK AS PAID */}
        {showPayConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-3xl p-8 sm:p-16 max-w-2xl w-full text-center shadow-2xl">
              <h3 className="text-4xl sm:text-5xl font-black mb-12 text-gray-800">
                Are you sure you want to mark all orders for this customer as PAID?
              </h3>

              <p className="text-6xl sm:text-7xl font-black text-green-600 mb-16">
                Total: ₹{(showPayConfirm.total / 100).toFixed(0)}
              </p>

              <p className="text-2xl sm:text-3xl text-red-600 mb-20 font-bold">
                This action cannot be undone.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-12">
                <button
                  onClick={async () => {
                    for (const o of showPayConfirm.orders) {
                      await updateStatus(o.id, 'delivered')
                    }
                    setShowPayConfirm(null)
                    setShowPaidSuccess(true)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-16 py-10 sm:px-20 sm:py-12 rounded-3xl text-4xl sm:text-5xl font-black shadow-2xl"
                >
                  Yes, Mark as Paid
                </button>

                <button
                  onClick={() => setShowPayConfirm(null)}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-16 py-10 sm:px-20 sm:py-12 rounded-3xl text-4xl sm:text-5xl font-black shadow-2xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS MODAL AFTER MARK AS PAID */}
        {showPaidSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-3xl p-8 sm:p-16 max-w-2xl w-full text-center shadow-2xl">
              <h3 className="text-5xl sm:text-6xl font-black mb-12 text-green-600">
                All orders marked as PAID successfully!
              </h3>

              <button
                onClick={() => setShowPaidSuccess(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-20 py-10 sm:px-20 sm:py-10 rounded-3xl text-4xl sm:text-5xl font-black shadow-2xl"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}