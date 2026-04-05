import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { type CartItem } from '../../data/schema'

type Props = {
  cart: CartItem[]
  onRemoveAll: (dishId: number) => void
}

export const CartSummary = ({ cart, onRemoveAll }: Props) => {
  if (cart.length === 0) return null

  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0)

  return (
    <div className='rounded-lg border bg-muted/30 p-3'>
      <p className='mb-2 text-xs font-semibold uppercase text-muted-foreground'>
        Resumen del pedido
      </p>
      <div className='flex flex-col gap-1.5'>
        {cart.map((item) => (
          <div key={item.dishId} className='flex items-center gap-2 text-sm'>
            <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground'>
              {item.quantity}
            </span>
            <span className='flex-1 truncate'>{item.dishName}</span>
            <span className='shrink-0 font-medium'>
              S/ {(item.unitPrice * item.quantity).toFixed(2)}
            </span>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='h-5 w-5 shrink-0 text-muted-foreground hover:text-destructive'
              onClick={() => onRemoveAll(item.dishId)}
            >
              <Trash2 className='h-3 w-3' />
            </Button>
          </div>
        ))}
      </div>
      <Separator className='my-2' />
      <div className='flex justify-between text-sm font-bold'>
        <span>Total</span>
        <span>S/ {subtotal.toFixed(2)}</span>
      </div>
    </div>
  )
}
