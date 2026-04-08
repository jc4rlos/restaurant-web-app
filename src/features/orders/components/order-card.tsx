import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronRight, MapPin, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { type Order } from '../data/schema'
import { OrderStatusBadge } from './order-status-badge'
import { OrderTypeBadge } from './order-type-badge'
import { getEmployeeWaiterInfo } from '@/features/employees/data/employees-service'

type Props = {
  order: Order
  onClick: (order: Order) => void
}

export const OrderCard = ({ order, onClick }: Props) => {
const [waiterInfo, setWaiterInfo] = useState<{ firstName: string; lastName: string; role: string | null } | null>(null)

  useEffect(() => {
    getEmployeeWaiterInfo(order.waiterId).then(setWaiterInfo).catch(() => setWaiterInfo(null))
  }, [order.waiterId])

  const timeAgo = formatDistanceToNow(new Date(order.orderedAt), {
    addSuffix: true,
    locale: es,
  })

  const subtitle =
    order.orderType === 'DINE_IN'
      ? `Mesa ${order.tableNumber ?? '—'}`
      : order.orderType === 'DELIVERY'
        ? order.delivery?.district ?? order.customerName ?? 'Sin nombre'
        : order.customerName ?? 'Para recoger'

  const translateRole = (role: string | null): string => {
    if (!role) return ''
    const roleMap: Record<string, string> = {
      WAITER: 'Mesero',
      COOK: 'Cocinero',
      CASHIER: 'Cajero',
      MANAGER: 'Gerente',
      SUPERVISOR: 'Supervisor',
      ADMIN: 'Administrador',
    }
    return roleMap[role] || role
  }

  const creatorInfo = waiterInfo
    ? waiterInfo.role
      ? `${translateRole(waiterInfo.role)}: ${waiterInfo.firstName} ${waiterInfo.lastName}`
      : `${waiterInfo.firstName} ${waiterInfo.lastName}`
    : 'Cargando...'

  return (
    <Card
      onClick={() => onClick(order)}
      className='cursor-pointer transition-colors hover:bg-muted/40 active:bg-muted/60'
    >
      <CardContent className='flex items-center gap-3 p-4'>
        {/* Order # */}
        <div className='flex min-w-[2.5rem] flex-col items-center'>
          <span className='text-xs text-muted-foreground'>#</span>
          <span className='text-lg font-bold leading-tight'>{order.id}</span>
        </div>

        {/* Details */}
        <div className='flex min-w-0 flex-1 flex-col gap-1'>
          <div className='flex flex-wrap items-center gap-1.5'>
            <OrderTypeBadge type={order.orderType} />
            <OrderStatusBadge status={order.status} />
          </div>

          <div className='flex items-center gap-1 text-sm text-muted-foreground'>
            {order.orderType === 'DELIVERY' ? (
              <MapPin className='h-3.5 w-3.5 shrink-0' />
            ) : (
              <User className='h-3.5 w-3.5 shrink-0' />
            )}
            <span className='truncate'>{subtitle}</span>
          </div>
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <User className='h-3.5 w-3.5 shrink-0' />
            <span className='truncate'>Pedido hecho por {creatorInfo}</span>
          </div>

          <div className='flex items-center justify-between'>
            <span className='text-xs text-muted-foreground'>{timeAgo}</span>
            <span className='text-sm font-semibold'>
              S/ {order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <ChevronRight className='h-4 w-4 shrink-0 text-muted-foreground' />
      </CardContent>
    </Card>
  )
}
