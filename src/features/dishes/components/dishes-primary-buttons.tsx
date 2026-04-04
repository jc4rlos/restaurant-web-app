import { UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDishesContext } from './dishes-provider'

export const DishesPrimaryButtons = () => {
  const { setOpen } = useDishesContext()
  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Agregar Plato</span> <UtensilsCrossed size={18} />
    </Button>
  )
}
