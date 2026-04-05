import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type CartItem, type MenuDish } from '../../data/schema'

type Props = {
  dish: MenuDish
  cartItem?: CartItem
  onAdd: (dish: MenuDish) => void
  onRemove: (dishId: number) => void
}

export const DishCard = ({ dish, cartItem, onAdd, onRemove }: Props) => {
  const qty = cartItem?.quantity ?? 0

  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-xl border-2 transition-all',
        qty > 0 ? 'border-primary bg-primary/5' : 'border-border bg-card'
      )}
    >
      {/* Dish image */}
      {dish.dishImageUrl ? (
        <img
          src={dish.dishImageUrl}
          alt={dish.dishName}
          className='h-28 w-full object-cover'
        />
      ) : (
        <div className='flex h-28 items-center justify-center bg-muted'>
          <span className='text-2xl'>🍽️</span>
        </div>
      )}

      {/* Quantity badge */}
      {qty > 0 && (
        <div className='absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground'>
          {qty}
        </div>
      )}

      {/* Info */}
      <div className='flex flex-1 flex-col gap-1 p-2.5'>
        <p className='line-clamp-2 text-xs font-semibold leading-tight'>
          {dish.dishName}
        </p>
        <p className='text-xs font-bold text-primary'>S/ {dish.price.toFixed(2)}</p>

        {/* Quantity controls */}
        <div className='mt-1 flex items-center justify-between gap-1'>
          <Button
            variant='outline'
            size='icon'
            className='h-7 w-7'
            type='button'
            disabled={qty === 0}
            onClick={() => onRemove(dish.dishId)}
          >
            <Minus className='h-3 w-3' />
          </Button>
          <span className='min-w-[1.5rem] text-center text-sm font-semibold'>
            {qty}
          </span>
          <Button
            variant='outline'
            size='icon'
            className='h-7 w-7'
            type='button'
            disabled={qty >= dish.stock}
            onClick={() => onAdd(dish)}
          >
            <Plus className='h-3 w-3' />
          </Button>
        </div>

        {dish.stock <= 3 && dish.stock > 0 && (
          <p className='text-[10px] text-orange-500'>Solo quedan {dish.stock}</p>
        )}
        {dish.stock === 0 && (
          <p className='text-[10px] text-destructive'>Sin stock</p>
        )}
      </div>
    </div>
  )
}
