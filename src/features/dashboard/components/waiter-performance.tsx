import { Crown, Medal, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useWaiterPerformance } from '../hooks/use-dashboard'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 }).format(n)

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 0) return <Crown className='h-4 w-4 text-yellow-500' />
  if (rank === 1) return <Trophy className='h-4 w-4 text-slate-400' />
  if (rank === 2) return <Medal className='h-4 w-4 text-amber-700' />
  return (
    <span className='flex h-4 w-4 items-center justify-center text-[11px] font-bold text-muted-foreground'>
      {rank + 1}
    </span>
  )
}

export const WaiterPerformance = () => {
  const { data = [], isLoading } = useWaiterPerformance()
  const maxRevenue = data[0]?.revenue ?? 1

  return (
    <Card className='border-0 shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-semibold'>Rendimiento por mesero</CardTitle>
        <p className='text-xs text-muted-foreground'>Ranking del día</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex flex-col gap-3'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='h-10 rounded-lg' />
            ))}
          </div>
        ) : data.length === 0 ? (
          <p className='py-10 text-center text-sm text-muted-foreground'>Sin datos hoy</p>
        ) : (
          <div className='flex flex-col gap-3'>
            {data.map((w, i) => (
              <div key={w.waiterId} className='flex flex-col gap-1'>
                <div className='flex items-center justify-between gap-2'>
                  <div className='flex items-center gap-2'>
                    <RankIcon rank={i} />
                    <span className='text-sm font-medium'>{w.waiterName}</span>
                  </div>
                  <div className='flex items-center gap-3 text-right text-xs'>
                    <span className='text-muted-foreground'>{w.ordersCount} pedidos</span>
                    {w.cancelledCount > 0 && (
                      <span className='text-rose-500'>{w.cancelledCount} cancel.</span>
                    )}
                    <span className='font-bold text-emerald-600'>S/ {fmt(w.revenue)}</span>
                  </div>
                </div>
                <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
                  <div
                    className='h-full rounded-full bg-primary transition-all'
                    style={{ width: `${(w.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
