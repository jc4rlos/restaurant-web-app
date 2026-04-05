import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useHourlySales } from '../hooks/use-dashboard'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 }).format(n)

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className='rounded-lg border bg-background p-2.5 shadow-md text-xs'>
      <p className='mb-1 font-semibold'>{label}</p>
      <p className='text-emerald-600'>S/ {fmt(payload[0]?.value ?? 0)}</p>
      <p className='text-muted-foreground'>{payload[1]?.value ?? 0} pedidos</p>
    </div>
  )
}

export const HourlySalesChart = () => {
  const { data = [], isLoading } = useHourlySales()

  return (
    <Card className='border-0 shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-semibold'>Ventas por hora</CardTitle>
        <p className='text-xs text-muted-foreground'>Picos de demanda del día</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className='h-52 w-full rounded-xl' />
        ) : (
          <ResponsiveContainer width='100%' height={210}>
            <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray='3 3' className='stroke-muted' vertical={false} />
              <XAxis
                dataKey='hour'
                fontSize={10}
                tickLine={false}
                axisLine={false}
                interval={2}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `S/${v}`}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey='revenue' name='Ventas' fill='hsl(var(--primary))' radius={[4, 4, 0, 0]} />
              <Bar dataKey='orders' name='Pedidos' fill='hsl(var(--primary) / 0.3)' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
