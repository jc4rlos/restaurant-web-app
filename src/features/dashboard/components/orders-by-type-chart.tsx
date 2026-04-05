import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useOrdersByType } from '../hooks/use-dashboard'

const COLORS = ['#6366f1', '#f59e0b', '#10b981']

const fmt = (n: number) =>
  new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 }).format(n)

export const OrdersByTypeChart = () => {
  const { data = [], isLoading } = useOrdersByType()
  const total = data.reduce((s, d) => s + d.count, 0)

  return (
    <Card className='border-0 shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-semibold'>Pedidos por tipo</CardTitle>
        <p className='text-xs text-muted-foreground'>{total} pedidos hoy</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className='mx-auto h-48 w-48 rounded-full' />
        ) : data.length === 0 ? (
          <p className='py-10 text-center text-sm text-muted-foreground'>Sin datos hoy</p>
        ) : (
          <div className='flex flex-col items-center gap-4'>
            <ResponsiveContainer width='100%' height={180}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey='count'
                  nameKey='type'
                  cx='50%'
                  cy='50%'
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} pedidos`]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className='flex w-full flex-col gap-2'>
              {data.map((d, i) => (
                <div key={d.type} className='flex items-center justify-between text-sm'>
                  <div className='flex items-center gap-2'>
                    <span
                      className='h-2.5 w-2.5 rounded-full'
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span className='font-medium'>{d.type}</span>
                  </div>
                  <div className='flex gap-3 text-right'>
                    <span className='text-muted-foreground'>{d.count}</span>
                    <span className='font-semibold text-emerald-600'>S/ {fmt(d.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
