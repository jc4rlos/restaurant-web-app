import { CalendarPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDailyMenuContext } from './daily-menu-provider'

export const DailyMenuPrimaryButtons = () => {
  const { setIsCreateOpen } = useDailyMenuContext()
  return (
    <Button className='space-x-1' onClick={() => setIsCreateOpen(true)}>
      <span>Nuevo Menú</span> <CalendarPlus size={18} />
    </Button>
  )
}
