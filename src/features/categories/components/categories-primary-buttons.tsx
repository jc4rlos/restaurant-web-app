import { FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCategories } from './categories-provider'

export const CategoriesPrimaryButtons = () => {
  const { setOpen } = useCategories()
  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Agregar Categoría</span> <FolderPlus size={18} />
    </Button>
  )
}
