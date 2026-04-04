import { CalendarX } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { type MenuDateSummary } from '../data/schema'
import { MenuDateCard } from './menu-date-card'

type MenuListProps = {
  summaries: MenuDateSummary[]
  isLoading: boolean
}

const MenuListSkeleton = () => (
  <div className='flex flex-col gap-3'>
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className='h-[72px] w-full rounded-lg' />
    ))}
  </div>
)

export const MenuList = ({ summaries, isLoading }: MenuListProps) => {
  if (isLoading) return <MenuListSkeleton />

  if (summaries.length === 0)
    return (
      <div className='flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground'>
        <CalendarX size={40} className='opacity-50' />
        <p className='text-sm'>No hay menús programados.</p>
        <p className='text-xs'>Crea uno con el botón "Nuevo Menú".</p>
      </div>
    )

  return (
    <div className='flex flex-col gap-3'>
      {summaries.map((summary) => (
        <MenuDateCard key={`${summary.date}-${summary.branchId}`} summary={summary} />
      ))}
    </div>
  )
}
