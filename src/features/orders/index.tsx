import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { type OrderStatus, type OrderType } from './data/schema'
import { useOrders } from './hooks/use-orders'
import { OrderCreateSheet } from './components/create-order/order-create-sheet'
import { OrderDetailSheet } from './components/order-detail/order-detail-sheet'
import { OrdersFilters } from './components/orders-filters'
import { OrdersList } from './components/orders-list'
import { OrdersProvider, useOrdersContext } from './components/orders-provider'

const OrdersContent = () => {
  const { isCreateOpen, setIsCreateOpen, selectedOrder, openDetail, closeDetail } =
    useOrdersContext()

  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL')
  const [typeFilter, setTypeFilter] = useState<OrderType | 'ALL'>('ALL')
  const [dateFilter, setDateFilter] = useState<string>(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
  })

  const { data: orders = [], isLoading } = useOrders({
    status: statusFilter,
    orderType: typeFilter !== 'ALL' ? typeFilter : undefined,
    startDate: dateFilter,
    endDate: dateFilter,
  })

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Pedidos</h2>
            <p className='text-muted-foreground'>
              Gestiona los pedidos del restaurante en tiempo real.
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className='gap-2'>
            <Plus className='h-4 w-4' />
            Nuevo pedido
          </Button>
        </div>

        <OrdersFilters
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          dateFilter={dateFilter}
          onStatusChange={setStatusFilter}
          onTypeChange={setTypeFilter}
          onDateChange={setDateFilter}
        />

        <OrdersList orders={orders} isLoading={isLoading} onSelect={openDetail} />
      </Main>

      <OrderCreateSheet
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <OrderDetailSheet order={selectedOrder} onClose={closeDetail} />
    </>
  )
}

export const Orders = () => (
  <OrdersProvider>
    <OrdersContent />
  </OrdersProvider>
)
