import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock,
  DollarSign,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDayMetrics } from '../hooks/use-dashboard'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

export const MetricCards = () => {
  const { data, isLoading } = useDayMetrics()

  if (isLoading) {
    return (
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className='h-28 rounded-xl' />
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Ventas del día',
      value: `S/ ${fmt(data?.totalRevenue ?? 0)}`,
      sub: 'pedidos entregados',
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      title: 'Pedidos totales',
      value: String(data?.totalOrders ?? 0),
      sub: 'sin cancelados',
      icon: ClipboardList,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: 'Ticket promedio',
      value: `S/ ${fmt(data?.avgTicket ?? 0)}`,
      sub: 'por pedido entregado',
      icon: TrendingUp,
      color: 'text-violet-500',
      bg: 'bg-violet-50 dark:bg-violet-950/30',
    },
    {
      title: 'En proceso',
      value: String(data?.activeOrders ?? 0),
      sub: 'pedidos activos ahora',
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
      title: 'Pendientes',
      value: String(data?.pendingOrders ?? 0),
      sub: 'sin confirmar',
      icon: AlertCircle,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-950/30',
    },
    {
      title: 'Cancelados',
      value: String(data?.cancelledOrders ?? 0),
      sub: 'pedidos hoy',
      icon: CheckCircle2,
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-950/30',
    },
  ]

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
      {cards.map(({ title, value, sub, icon: Icon, color, bg }) => (
        <Card key={title} className='border-0 shadow-sm'>
          <CardHeader className='flex flex-row items-center justify-between pb-1 pt-4'>
            <CardTitle className='text-xs font-medium text-muted-foreground'>
              {title}
            </CardTitle>
            <div className={`rounded-lg p-1.5 ${bg}`}>
              <Icon className={`h-3.5 w-3.5 ${color}`} />
            </div>
          </CardHeader>
          <CardContent className='pb-4'>
            <p className='text-xl font-bold tracking-tight'>{value}</p>
            <p className='mt-0.5 text-[11px] text-muted-foreground'>{sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
