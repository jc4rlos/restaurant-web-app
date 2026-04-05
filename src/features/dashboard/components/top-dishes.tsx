import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTopDishes } from '../hooks/use-dashboard'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 }).format(n)

export const TopDishes = () => {
  const { data = [], isLoading } = useTopDishes()
  const maxQty = data[0]?.totalQty ?? 1

  return (
    <Card className='border-0 shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-semibold'>Platos más vendidos</CardTitle>
        <p className='text-xs text-muted-foreground'>Hoy en todos los pedidos</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex flex-col gap-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-9 rounded-lg' />
            ))}
          </div>
        ) : data.length === 0 ? (
          <p className='py-10 text-center text-sm text-muted-foreground'>Sin ventas hoy</p>
        ) : (
          <div className='flex flex-col gap-3'>
            {data.map((dish, i) => (
              <div key={dish.dishId} className='flex items-center gap-3'>
                <div className='flex h-8 w-8 shrink-0 items-center justify-center'>
                  {dish.dishImageUrl ? (
                    <img
                      src={dish.dishImageUrl}
                      alt={dish.dishName}
                      className='h-8 w-8 rounded-md object-cover'
                    />
                  ) : (
                    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-muted text-sm'>
                      🍽️
                    </div>
                  )}
                </div>
                <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='truncate text-xs font-medium'>
                      {i + 1}. {dish.dishName}
                    </span>
                    <div className='flex shrink-0 items-center gap-2 text-xs'>
                      <span className='font-bold text-primary'>{dish.totalQty} uds</span>
                      <span className='text-muted-foreground'>S/ {fmt(dish.totalRevenue)}</span>
                    </div>
                  </div>
                  <div className='h-1 w-full overflow-hidden rounded-full bg-muted'>
                    <div
                      className='h-full rounded-full bg-primary/70'
                      style={{ width: `${(dish.totalQty / maxQty) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
