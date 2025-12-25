// app/admin/hooks/useAdminData.js - FULL, COMPLETE & FINAL VERSION
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function useAdminData() {
  const router = useRouter()

  // Main Data
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [allItems, setAllItems] = useState([])
  const [specialItems, setSpecialItems] = useState([])
  const [combos, setCombos] = useState([])
  const [addons, setAddons] = useState([])
  const [user, setUser] = useState(null)
  const [newOrderCount, setNewOrderCount] = useState(0)

  // Category Form
  const [catName, setCatName] = useState('')
  const [editingCat, setEditingCat] = useState(null)

  // Item Modal
  const [showItemModal, setShowItemModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedCat, setSelectedCat] = useState('')
  const [itemName, setItemName] = useState('')
  const [desc, setDesc] = useState('')
  const [isVeg, setIsVeg] = useState(true)
  const [isSpecial, setIsSpecial] = useState(false)
  const [isOutOfStock, setIsOutOfStock] = useState(false)  // ← NEW: Out of Stock state
  const [variants, setVariants] = useState([{ size: '', variant: '', price: '' }])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  // Today's Special Modal
  const [showSpecialModal, setShowSpecialModal] = useState(false)
  const [editingSpecialItem, setEditingSpecialItem] = useState(null)
  const [specialName, setSpecialName] = useState('')
  const [specialPrice, setSpecialPrice] = useState('')
  const [specialImageFile, setSpecialImageFile] = useState(null)
  const [specialImagePreview, setSpecialImagePreview] = useState('')

  // Combo Modal
  const [showComboModal, setShowComboModal] = useState(false)
  const [editingCombo, setEditingCombo] = useState(null)
  const [comboName, setComboName] = useState('')
  const [comboDesc, setComboDesc] = useState('')
  const [comboPrice, setComboPrice] = useState('')
  const [comboImageFile, setComboImageFile] = useState(null)
  const [comboImagePreview, setComboImagePreview] = useState('')
  const [selectedComboItems, setSelectedComboItems] = useState([])

  // Addon Modal
  const [showAddonModal, setShowAddonModal] = useState(false)
  const [editingAddon, setEditingAddon] = useState(null)
  const [addonName, setAddonName] = useState('')
  const [addonPrice, setAddonPrice] = useState('')
  const [addonImageFile, setAddonImageFile] = useState(null)
  const [addonImagePreview, setAddonImagePreview] = useState('')
  const [isAddonGlobal, setIsAddonGlobal] = useState(true)
  const [selectedAddonCategories, setSelectedAddonCategories] = useState([])
  const [selectedAddonItems, setSelectedAddonItems] = useState([])

  // Pay Modals
  const [showPayConfirm, setShowPayConfirm] = useState(null)
  const [showPaidSuccess, setShowPaidSuccess] = useState(false)

  // === AUTH & REALTIME ===
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
        fetchAddons()
      }
    }
    checkUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) router.push('/admin/login')
    })

    const channel = supabase
      .channel('orders-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        setOrders(prev => [payload.new, ...prev])

        const playNotification = () => {
          const audio = new Audio('/sounds/new-order.mp3')
          audio.volume = 1.0
          audio.play().catch(() => {})

          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200])
          }
        }
        playNotification()

        updateNewOrderCount()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchOrders())
      .subscribe()

    return () => {
      listener?.subscription.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [router])

  // === FETCH FUNCTIONS ===
  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders(data || [])
    updateNewOrderCount()
  }

  const updateNewOrderCount = () => {
    const pending = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length
    setNewOrderCount(pending)
  }

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*, items(*, item_variants(*))').order('display_order')
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

  const fetchAddons = async () => {
    const { data } = await supabase.from('addons').select('*').order('id')
    setAddons(data || [])
  }

  // === CATEGORY ACTIONS ===
  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    fetchOrders()
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

  const toggleAddonCategory = async (categoryId, current) => {
    await supabase.from('categories').update({ is_addon_category: !current }).eq('id', categoryId)
    fetchCategories()
  }

  const toggleTopSelling = async (itemId, current) => {
    await supabase.from('items').update({ is_top_selling: !current }).eq('id', itemId)
    fetchCategories()
  }

  const toggleRecommended = async (itemId, current) => {
    await supabase.from('items').update({ is_recommended: !current }).eq('id', itemId)
    fetchCategories()
  }

  // === ITEM ACTIONS ===
  const resetItemForm = () => {
    setEditingItem(null)
    setItemName('')
    setDesc('')
    setIsVeg(true)
    setIsSpecial(false)
    setIsOutOfStock(false)  // ← Reset Out of Stock
    setVariants([{ size: '', variant: '', price: '' }])
    setImageFile(null)
    setImagePreview('')
  }

  const openEditItem = (item) => {
    setEditingItem(item)
    setSelectedCat(item.category_id)
    setItemName(item.name)
    setDesc(item.description || '')
    setIsVeg(item.is_veg)
    setIsSpecial(item.is_special || false)
    setIsOutOfStock(item.is_out_of_stock || false)  // ← Load current value
    setImagePreview(item.base_image_url || '')
    setImageFile(null)

    const mapped = item.item_variants?.length > 0
      ? item.item_variants.map(v => ({
          size: v.size || '',
          variant: v.variant || '',
          price: v.price ? (v.price / 100).toFixed(0) : ''
        }))
      : [{ size: '', variant: '', price: '' }]

    setVariants(mapped)
    setShowItemModal(true)
  }

  const saveItem = async () => {
    if (!itemName || !selectedCat || variants.some(v => !v.price)) return

    let imageUrl = imagePreview
    if (imageFile) {
      const fileName = `item-${Date.now()}.jpg`
      const { error } = await supabase.storage.from('menu-images').upload(fileName, imageFile, { upsert: true })
      if (error) return alert('Image upload failed')
      const { data } = supabase.storage.from('menu-images').getPublicUrl(fileName)
      imageUrl = data.publicUrl
    }

    const itemData = {
      category_id: selectedCat,
      name: itemName,
      description: desc || null,
      is_veg: isVeg,
      base_image_url: imageUrl || null,
      is_special: isSpecial,
      is_out_of_stock: isOutOfStock  // ← SAVE THE FLAG
    }

    let itemId
    if (editingItem) {
      await supabase.from('items').update(itemData).eq('id', editingItem.id)
      itemId = editingItem.id
      await supabase.from('item_variants').delete().eq('item_id', itemId)
    } else {
      const { data } = await supabase.from('items').insert(itemData).select().single()
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
    alert('Item saved!')
  }

  const deleteItem = async (id) => {
    if (!confirm('Delete item forever?')) return
    await supabase.from('item_variants').delete().eq('item_id', id)
    await supabase.from('items').delete().eq('id', id)
    fetchCategories()
  }

  const addVariant = () => setVariants([...variants, { size: '', variant: '', price: '' }])
  const removeVariant = (i) => setVariants(variants.filter((_, idx) => idx !== i))
  const updateVariant = (i, field, value) => {
    const newV = [...variants]
    newV[i][field] = value
    setVariants(newV)
  }

  // === TODAY'S SPECIAL ===
  const openSpecialModal = (item = null) => {
    if (item) {
      setEditingSpecialItem(item)
      setSpecialName(item.name)
      setSpecialPrice((item.price / 100).toFixed(0))
      setSpecialImagePreview(item.base_image_url || '')
      setSpecialImageFile(null)
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
    if (!specialName.trim() || !specialPrice) return alert('Please enter name and price')

    let imageUrl = specialImagePreview
    if (specialImageFile) {
      const fileName = `special-${Date.now()}.jpg`
      const { error } = await supabase.storage.from('menu-images').upload(fileName, specialImageFile, { upsert: true })
      if (error) return alert('Image upload failed')
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

  // === COMBOS ===
  const openComboModal = (combo = null) => {
    if (combo) {
      setEditingCombo(combo)
      setComboName(combo.name)
      setComboDesc(combo.description || '')
      setComboPrice((combo.price / 100).toFixed(0))
      setComboImagePreview(combo.base_image_url || '')
      setComboImageFile(null)
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
      return alert('Please fill name, price and select at least one item')
    }

    let imageUrl = comboImagePreview
    if (comboImageFile) {
      const fileName = `combo-${Date.now()}.jpg`
      const { error } = await supabase.storage.from('menu-images').upload(fileName, comboImageFile, { upsert: true })
      if (error) return alert('Image upload failed')
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

  // === ADDONS ===
  const openAddonModal = (addon = null) => {
    if (addon) {
      setEditingAddon(addon)
      setAddonName(addon.name)
      setAddonPrice((addon.price / 100).toFixed(0))
      setAddonImagePreview(addon.base_image_url || '')
      setAddonImageFile(null)
      setIsAddonGlobal(addon.is_global || true)
      setSelectedAddonCategories(addon.category_ids || [])
      setSelectedAddonItems(addon.item_ids || [])
    } else {
      setEditingAddon(null)
      setAddonName('')
      setAddonPrice('')
      setAddonImagePreview('')
      setAddonImageFile(null)
      setIsAddonGlobal(true)
      setSelectedAddonCategories([])
      setSelectedAddonItems([])
    }
    setShowAddonModal(true)
  }

  const saveAddon = async () => {
    if (!addonName.trim() || !addonPrice) return alert('Name and price required')

    let imageUrl = addonImagePreview
    if (addonImageFile) {
      const fileName = `addon-${Date.now()}.jpg`
      const { error } = await supabase.storage.from('menu-images').upload(fileName, addonImageFile, { upsert: true })
      if (error) return alert('Image upload failed')
      const { data } = supabase.storage.from('menu-images').getPublicUrl(fileName)
      imageUrl = data.publicUrl
    }

    const payload = {
      name: addonName.trim(),
      price: parseInt(addonPrice) * 100,
      base_image_url: imageUrl || null,
      is_global: isAddonGlobal,
      category_ids: isAddonGlobal ? [] : selectedAddonCategories,
      item_ids: isAddonGlobal ? [] : selectedAddonItems
    }

    if (editingAddon) {
      await supabase.from('addons').update(payload).eq('id', editingAddon.id)
    } else {
      await supabase.from('addons').insert(payload)
    }

    setShowAddonModal(false)
    setAddonName('')
    setAddonPrice('')
    setAddonImageFile(null)
    setAddonImagePreview('')
    setEditingAddon(null)
    setIsAddonGlobal(true)
    setSelectedAddonCategories([])
    setSelectedAddonItems([])
    fetchAddons()
    alert('Addon saved!')
  }

  const deleteAddon = async (id) => {
    if (!confirm('Delete this addon permanently?')) return
    await supabase.from('addons').delete().eq('id', id)
    fetchAddons()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // === RETURN ALL ===
  return {
    toggleTopSelling,
    toggleRecommended,
    activeTab, setActiveTab,
    user,
    orders, categories, allItems, specialItems, combos, addons, newOrderCount,

    // Category
    catName, setCatName, editingCat, setEditingCat,

    // Item Modal
    showItemModal, setShowItemModal, editingItem, setEditingItem,
    selectedCat, setSelectedCat, itemName, setItemName, desc, setDesc,
    isVeg, setIsVeg, isSpecial, setIsSpecial,
    isOutOfStock, setIsOutOfStock,  // ← RETURNED
    variants, setVariants, imageFile, setImageFile, imagePreview, setImagePreview,

    // Special Modal
    showSpecialModal, setShowSpecialModal, editingSpecialItem, setEditingSpecialItem,
    specialName, setSpecialName, specialPrice, setSpecialPrice,
    specialImageFile, setSpecialImageFile, specialImagePreview, setSpecialImagePreview,

    // Combo Modal
    showComboModal, setShowComboModal, editingCombo, setEditingCombo,
    comboName, setComboName, comboDesc, setComboDesc, comboPrice, setComboPrice,
    comboImageFile, setComboImageFile, comboImagePreview, setComboImagePreview,
    selectedComboItems, setSelectedComboItems,

    // Addon Modal
    showAddonModal, setShowAddonModal, editingAddon, setEditingAddon,
    addonName, setAddonName, addonPrice, setAddonPrice,
    addonImageFile, setAddonImageFile, addonImagePreview, setAddonImagePreview,
    isAddonGlobal, setIsAddonGlobal,
    selectedAddonCategories, setSelectedAddonCategories,
    selectedAddonItems, setSelectedAddonItems,

    // Pay Modals
    showPayConfirm, setShowPayConfirm, showPaidSuccess, setShowPaidSuccess,

    // Functions
    updateStatus, saveCategory, deleteCategory, toggleAddonCategory,
    openEditItem, saveItem, deleteItem, resetItemForm,
    addVariant, removeVariant, updateVariant,

    openSpecialModal, saveSpecialItem, deleteSpecialItem, toggleExistingSpecial,
    openComboModal, saveCombo, deleteCombo,

    openAddonModal, saveAddon, deleteAddon,

    handleLogout
  }
}