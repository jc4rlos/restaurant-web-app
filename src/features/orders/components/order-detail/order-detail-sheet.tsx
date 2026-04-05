import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Loader2, MapPin, Notebook, Phone, User } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { type Order, type OrderStatus } from '../../data/schema'
import { useUpdateOrderStatus } from '../../hooks/use-orders'
import { useOrdersContext } from '../orders-provider'
import { OrderStatusBadge } from '../order-status-badge'
import { OrderTypeBadge } from '../order-type-badge'
import { OrderItemsList } from './order-items-list'
import { getAvailableStatuses, STATUS_LABELS } from './status-flow'

type Props = {
  order: Order | null
  onClose: () => void
}

export const OrderDetailSheet = ({ order, onClose }: Props) => {
  const { updateSelectedOrder } = useOrdersContext()
  const { mutateAsync: updateStatus, isPending } = useUpdateOrderStatus()

  const handleStatusChange = async (status: OrderStatus) => {
    if (!order) return
    await updateStatus({ id: order.id, status })
    updateSelectedOrder((prev) => ({ ...prev, status }))
  }

  return (
    <Sheet open={!!order} onOpenChange={(s) => { if (!s) onClose() }}>
      <SheetContent
        side='right'
        className='flex w-full flex-col gap-0 p-0 sm:max-w-lg'
      >
        {order && (
          <>
            <SheetHeader className='border-b px-4 py-3'>
              <div className='flex items-start justify-between gap-2'>
                <div>
                  <SheetTitle className='flex items-center gap-2'>
                    Pedido #{order.id}
                    <OrderTypeBadge type={order.orderType} />
                  </SheetTitle>
                  <p className='text-xs text-muted-foreground'>
                    {format(new Date(order.orderedAt), "d 'de' MMMM · HH:mm", {
                      locale: es,
                    })}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
            </SheetHeader>

            <div className='flex-1 overflow-y-auto px-4 py-4'>
              <div className='flex flex-col gap-4'>
                <ContextInfo order={order} />
                <Separator />
                <OrderItemsList order={order} />

                {order.notes && (
                  <>
                    <Separator />
                    <div className='flex items-start gap-2 text-sm'>
                      <Notebook className='mt-0.5 h-4 w-4 shrink-0 text-muted-foreground' />
                      <p className='italic text-muted-foreground'>{order.notes}</p>
                    </div>
                  </>
                )}

                {order.delivery && (
                  <>
                    <Separator />
                    <DeliveryInfo order={order} />
                  </>
                )}
              </div>
            </div>

            <div className='border-t px-4 py-3'>
              <StatusSelect
                order={order}
                isPending={isPending}
                onChange={handleStatusChange}
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

const ContextInfo = ({ order }: { order: Order }) => (
  <div className='flex flex-col gap-2 text-sm'>
    {order.orderType === 'DINE_IN' && order.tableNumber && (
      <InfoRow icon={<User className='h-4 w-4' />} label='Mesa' value={`Mesa ${order.tableNumber}`} />
    )}
    {order.customerName && (
      <InfoRow icon={<User className='h-4 w-4' />} label='Cliente' value={order.customerName} />
    )}
    {order.customerPhone && (
      <InfoRow icon={<Phone className='h-4 w-4' />} label='Teléfono' value={order.customerPhone} />
    )}
    <InfoRow icon={<User className='h-4 w-4' />} label='Sucursal' value={order.branchName} />
  </div>
)

const DeliveryInfo = ({ order }: { order: Order }) => {
  const d = order.delivery!
  return (
    <div className='flex flex-col gap-2 text-sm'>
      <p className='font-semibold'>Datos de delivery</p>
      <InfoRow icon={<User className='h-4 w-4' />} label='Destinatario' value={d.recipientName} />
      {d.phone && <InfoRow icon={<Phone className='h-4 w-4' />} label='Teléfono' value={d.phone} />}
      {d.address && (
        <InfoRow
          icon={<MapPin className='h-4 w-4' />}
          label='Dirección'
          value={`${d.address}${d.district ? `, ${d.district}` : ''}`}
        />
      )}
      {d.reference && (
        <InfoRow icon={<MapPin className='h-4 w-4' />} label='Referencia' value={d.reference} />
      )}
    </div>
  )
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) => (
  <div className='flex items-start gap-2'>
    <span className='mt-0.5 shrink-0 text-muted-foreground'>{icon}</span>
    <span className='text-muted-foreground'>{label}:</span>
    <span className='font-medium'>{value}</span>
  </div>
)

const StatusSelect = ({
  order,
  isPending,
  onChange,
}: {
  order: Order
  isPending: boolean
  onChange: (status: OrderStatus) => void
}) => {
  const options = getAvailableStatuses(order.status, order.orderType)

  if (options.length === 0) {
    return (
      <p className='text-center text-sm text-muted-foreground'>
        Este pedido no admite más cambios de estado.
      </p>
    )
  }

  return (
    <div className='flex items-center gap-3'>
      <span className='shrink-0 text-sm text-muted-foreground'>Cambiar estado</span>
      <div className='relative flex-1'>
        <Select
          value={order.status}
          onValueChange={(v) => onChange(v as OrderStatus)}
          disabled={isPending}
        >
          <SelectTrigger className='w-full'>
            <SelectValue>{STATUS_LABELS[order.status]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={order.status} disabled>
              {STATUS_LABELS[order.status]} (actual)
            </SelectItem>
            {options.map(({ status, label, isDestructive }) => (
              <SelectItem
                key={status}
                value={status}
                className={isDestructive ? 'text-destructive focus:text-destructive' : ''}
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isPending && (
          <div className='absolute inset-0 flex items-center justify-center rounded-md bg-background/60'>
            <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
          </div>
        )}
      </div>
    </div>
  )
}
