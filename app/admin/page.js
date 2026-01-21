'use client'

import Header from './components/Header'
import TabsNavigation from './components/TabsNavigation'
import OrdersTab from './components/OrdersTab'
import MenuTab from './components/MenuTab'
import BillsTab from './components/BillsTab'
import SpecialTab from './components/SpecialTab'
import CombosTab from './components/CombosTab'
import AddonsTab from './components/AddonsTab'
import SalesReportTab from './components/SalesReportTab' // ← NEW
import ItemModal from './components/ItemModal'
import SpecialModal from './components/SpecialModal'
import ComboModal from './components/ComboModal'
import AddonModal from './components/AddonModal'
import PayModals from './components/PayModals'
import useAdminData from './hooks/useAdminData'
import SoundManager from './components/SoundManager'

export default function AdminPanel() {
  const adminData = useAdminData()

  if (!adminData.user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={adminData.handleLogout} />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <TabsNavigation
          activeTab={adminData.activeTab}
          setActiveTab={adminData.setActiveTab}
          setNewOrderCount={adminData.setNewOrderCount}
          newOrderCount={adminData.newOrderCount}
          ordersLength={adminData.orders.length}
        />

        {/* Tab Content */}
        {adminData.activeTab === 'orders' && <OrdersTab {...adminData} />}
        {adminData.activeTab === 'menu' && <MenuTab {...adminData} />}
        {adminData.activeTab === 'bills' && <BillsTab {...adminData} />}
        {adminData.activeTab === 'special' && <SpecialTab {...adminData} />}
        {adminData.activeTab === 'combos' && <CombosTab {...adminData} />}
        {adminData.activeTab === 'addons' && <AddonsTab {...adminData} />}
        {adminData.activeTab === 'sales' && <SalesReportTab {...adminData} />} {/* ← NEW */}

        {/* Modals */}
        <ItemModal {...adminData} />
        <SpecialModal {...adminData} />
        <ComboModal {...adminData} />
        <AddonModal {...adminData} />
        <PayModals {...adminData} />
        <SoundManager />
      </div>
    </div>
  )
}