import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useState,
} from 'react'
import { type Order } from '../data/schema'

type OrdersContextType = {
  isCreateOpen: boolean
  setIsCreateOpen: Dispatch<React.SetStateAction<boolean>>

  selectedOrder: Order | null
  openDetail: (order: Order) => void
  updateSelectedOrder: (updater: (prev: Order) => Order) => void
  closeDetail: () => void
}

const OrdersContext = createContext<OrdersContextType | null>(null)

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const openDetail = (order: Order) => setSelectedOrder(order)
  const closeDetail = () => setSelectedOrder(null)
  const updateSelectedOrder = (updater: (prev: Order) => Order) =>
    setSelectedOrder((prev) => (prev ? updater(prev) : null))

  return (
    <OrdersContext
      value={{
        isCreateOpen,
        setIsCreateOpen,
        selectedOrder,
        openDetail,
        updateSelectedOrder,
        closeDetail,
      }}
    >
      {children}
    </OrdersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOrdersContext = () => {
  const ctx = useContext(OrdersContext)
  if (!ctx)
    throw new Error('useOrdersContext must be used within <OrdersProvider>')
  return ctx
}
