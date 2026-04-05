import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useWeeklyComparison } from '../hooks/use-dashboard'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 }).format(n)

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className='rounded-lg border bg-background p-2.5 shadow-md text-xs'>
      <p className='mb-1 font-semibold'>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: S/ {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

export const WeeklyComparisonChart = () => {
  const { data = [], isLoading } = useWeeklyComparison()

  return (
    <Card className='border-0 shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-semibold'>Comparativo semanal</CardTitle>
        <p className='text-xs text-muted-foreground'>Esta semana vs semana anterior</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className='h-52 w-full rounded-xl' />
        ) : (
          <ResponsiveContainer width='100%' height={210}>
            <LineChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray='3 3' className='stroke-muted' vertical={false} />
              <XAxis
                dataKey='label'
                fontSize={10}
                tickLine={false}
                axisLine={false}
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
              <Legend
                iconType='circle'
                iconSize={8}
                wrapperStyle={{ fontSize: '11px' }}
              />
              <Line
                type='monotone'
                dataKey='thisWeek'
                name='Esta semana'
                stroke='hsl(var(--primary))'
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type='monotone'
                dataKey='lastWeek'
                name='Semana anterior'
                stroke='hsl(var(--muted-foreground))'
                strokeWidth={2}
                strokeDasharray='4 4'
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
