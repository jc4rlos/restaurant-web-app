import { Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useTablesStatus } from '../hooks/use-dashboard'

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pend.',
  CONFIRMED: 'Conf.',
  PREPARING: 'Cocina',
  READY: 'Listo',
}

export const TablesStatus = () => {
  const { data = [], isLoading } = useTablesStatus()
  const occupied = data.filter((t) => t.hasActiveOrder).length

  return (
    <Card className='border-0 shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-semibold'>Estado de mesas</CardTitle>
        <p className='text-xs text-muted-foreground'>
          {occupied} ocupadas · {data.length - occupied} libres
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='grid grid-cols-4 gap-2 sm:grid-cols-5'>
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className='h-16 rounded-xl' />
            ))}
          </div>
        ) : data.length === 0 ? (
          <p className='py-8 text-center text-sm text-muted-foreground'>
            No hay mesas registradas
          </p>
        ) : (
          <div className='grid grid-cols-4 gap-2 sm:grid-cols-5'>
            {data.map((table) => (
              <div
                key={table.tableId}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-2 text-center transition-colors',
                  table.hasActiveOrder
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border bg-muted/30'
                )}
              >
                <span className='text-sm font-bold leading-none'>M{table.number}</span>
                <div className='flex items-center gap-0.5 text-[10px] text-muted-foreground'>
                  <Users className='h-2.5 w-2.5' />
                  {table.capacity}
                </div>
                {table.hasActiveOrder && table.orderStatus ? (
                  <Badge className='h-4 px-1 text-[9px]'>
                    {STATUS_LABEL[table.orderStatus] ?? table.orderStatus}
                  </Badge>
                ) : (
                  <span className='text-[10px] text-muted-foreground'>Libre</span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
