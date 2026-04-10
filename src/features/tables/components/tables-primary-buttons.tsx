import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTablesContext } from './tables-provider'

export const TablesPrimaryButtons = () => {
  const { setOpen } = useTablesContext()
  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <Plus size={18} />
      <span>Agregar Mesa</span>
    </Button>
  )
}