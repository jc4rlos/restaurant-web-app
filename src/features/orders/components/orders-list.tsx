import { ClipboardList } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { type Order } from '../data/schema'
import { OrderCard } from './order-card'

type Props = {
  orders: Order[]
  isLoading: boolean
  onSelect: (order: Order) => void
}

const ListSkeleton = () => (
  <div className='flex flex-col gap-3'>
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className='h-[88px] w-full rounded-lg' />
    ))}
  </div>
)

export const OrdersList = ({ orders, isLoading, onSelect }: Props) => {
  if (isLoading) return <ListSkeleton />

  if (orders.length === 0)
    return (
      <div className='flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground'>
        <ClipboardList size={40} className='opacity-40' />
        <p className='text-sm'>No hay pedidos.</p>
      </div>
    )

  return (
    <div className='flex flex-col gap-3'>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onClick={onSelect} />
      ))}
    </div>
  )
}
