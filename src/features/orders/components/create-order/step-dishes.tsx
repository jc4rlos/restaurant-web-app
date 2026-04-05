import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { type CartItem, type MenuDish } from '../../data/schema'
import { useTodayMenu } from '../../hooks/use-today-menu'
import { CartSummary } from './cart-summary'
import { DishCard } from './dish-card'

type Props = {
  branchId: number
  cart: CartItem[]
  onCartChange: (cart: CartItem[]) => void
  onNext: () => void
  onBack: () => void
}

const GridSkeleton = () => (
  <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className='h-[210px] rounded-xl' />
    ))}
  </div>
)

export const StepDishes = ({ branchId, cart, onCartChange, onNext, onBack }: Props) => {
  const { data: dishes = [], isLoading } = useTodayMenu(branchId)
  const [search, setSearch] = useState('')

  const filtered = dishes.filter((d) =>
    d.dishName.toLowerCase().includes(search.toLowerCase())
  )

  const addDish = (dish: MenuDish) => {
    const existing = cart.find((i) => i.dishId === dish.dishId)
    if (existing) {
      onCartChange(
        cart.map((i) =>
          i.dishId === dish.dishId ? { ...i, quantity: i.quantity + 1 } : i
        )
      )
    } else {
      onCartChange([
        ...cart,
        {
          dishId: dish.dishId,
          menuItemId: dish.menuItemId,
          dishName: dish.dishName,
          dishImageUrl: dish.dishImageUrl,
          unitPrice: dish.price,
          quantity: 1,
          notes: '',
        },
      ])
    }
  }

  const removeDish = (dishId: number) => {
    const existing = cart.find((i) => i.dishId === dishId)
    if (!existing) return
    if (existing.quantity === 1) {
      onCartChange(cart.filter((i) => i.dishId !== dishId))
    } else {
      onCartChange(
        cart.map((i) =>
          i.dishId === dishId ? { ...i, quantity: i.quantity - 1 } : i
        )
      )
    }
  }

  const removeAll = (dishId: number) =>
    onCartChange(cart.filter((i) => i.dishId !== dishId))

  return (
    <div className='flex flex-col gap-4'>
      {/* Search */}
      <div className='relative'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Buscar plato…'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='pl-8'
        />
      </div>

      {/* Dish grid */}
      {isLoading ? (
        <GridSkeleton />
      ) : filtered.length === 0 ? (
        <p className='py-10 text-center text-sm text-muted-foreground'>
          {dishes.length === 0
            ? 'No hay menú programado para hoy en esta sucursal.'
            : 'No se encontraron platos.'}
        </p>
      ) : (
        <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
          {filtered.map((dish) => (
            <DishCard
              key={dish.dishId}
              dish={dish}
              cartItem={cart.find((i) => i.dishId === dish.dishId)}
              onAdd={addDish}
              onRemove={removeDish}
            />
          ))}
        </div>
      )}

      {/* Cart summary */}
      <CartSummary cart={cart} onRemoveAll={removeAll} />

      {/* Navigation */}
      <div className='flex gap-2'>
        <Button variant='outline' className='flex-1' type='button' onClick={onBack}>
          Atrás
        </Button>
        <Button
          className='flex-1'
          type='button'
          disabled={cart.length === 0}
          onClick={onNext}
        >
          Continuar ({cart.reduce((s, i) => s + i.quantity, 0)} platos)
        </Button>
      </div>
    </div>
  )
}
