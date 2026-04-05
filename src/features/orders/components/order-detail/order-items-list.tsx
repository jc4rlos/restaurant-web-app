import { Separator } from '@/components/ui/separator'
import { type Order } from '../../data/schema'

type Props = { order: Order }

export const OrderItemsList = ({ order }: Props) => (
  <div className='flex flex-col gap-3'>
    <p className='text-sm font-semibold'>Platos</p>
    {order.items.map((item) => (
      <div key={item.id} className='flex items-center gap-3'>
        {item.dishImageUrl ? (
          <img
            src={item.dishImageUrl}
            alt={item.dishName}
            className='h-12 w-12 rounded-lg object-cover'
          />
        ) : (
          <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-xl'>
            🍽️
          </div>
        )}
        <div className='flex flex-1 flex-col'>
          <p className='text-sm font-medium'>{item.dishName}</p>
          <p className='text-xs text-muted-foreground'>
            {item.quantity} × S/ {item.unitPrice.toFixed(2)}
          </p>
          {item.notes && (
            <p className='text-xs italic text-muted-foreground'>{item.notes}</p>
          )}
        </div>
        <span className='text-sm font-semibold'>
          S/ {item.subtotal.toFixed(2)}
        </span>
      </div>
    ))}

    <Separator />

    <div className='flex items-center justify-between text-sm'>
      <span className='text-muted-foreground'>Subtotal platos</span>
      <span>
        S/{' '}
        {order.items
          .reduce((s, i) => s + i.subtotal, 0)
          .toFixed(2)}
      </span>
    </div>

    {order.delivery && order.delivery.deliveryFee > 0 && (
      <div className='flex items-center justify-between text-sm'>
        <span className='text-muted-foreground'>Envío</span>
        <span>S/ {order.delivery.deliveryFee.toFixed(2)}</span>
      </div>
    )}

    <div className='flex items-center justify-between font-bold'>
      <span>Total</span>
      <span>S/ {order.totalAmount.toFixed(2)}</span>
    </div>
  </div>
)
