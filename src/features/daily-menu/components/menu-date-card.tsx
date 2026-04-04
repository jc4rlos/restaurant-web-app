import { CalendarDays, ChevronRight, Trash2, UtensilsCrossed } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { type MenuDateSummary } from '../data/schema'
import { useDailyMenuContext } from './daily-menu-provider'
import { MenuDateLabel } from './menu-date-label'
import { useRemoveMenuByDate } from '../hooks/use-daily-menu'

type MenuDateCardProps = {
  summary: MenuDateSummary
}

export const MenuDateCard = ({ summary }: MenuDateCardProps) => {
  const { openDetail } = useDailyMenuContext()
  const removeMutation = useRemoveMenuByDate()

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeMutation.mutate({ branchId: summary.branchId, date: summary.date })
  }

  return (
    <Card
      className='cursor-pointer transition-colors hover:bg-accent/50'
      onClick={() => openDetail(summary.branchId, summary.date)}
    >
      <CardContent className='flex items-center justify-between p-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary/10'>
            <CalendarDays size={18} className='text-primary' />
          </div>
          <div>
            <p className='font-medium capitalize'>
              <MenuDateLabel date={summary.date} />
            </p>
            <p className='text-sm text-muted-foreground'>{summary.branchName}</p>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <Badge variant='secondary' className='gap-1'>
            <UtensilsCrossed size={12} />
            {summary.dishCount} {summary.dishCount === 1 ? 'plato' : 'platos'}
          </Badge>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-muted-foreground hover:text-destructive'
            disabled={removeMutation.isPending}
            onClick={handleDelete}
          >
            <Trash2 size={15} />
          </Button>
          <ChevronRight size={16} className='text-muted-foreground' />
        </div>
      </CardContent>
    </Card>
  )
}
