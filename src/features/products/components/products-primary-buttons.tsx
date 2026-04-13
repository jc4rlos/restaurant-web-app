import { PackagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProductsContext } from './products-provider'

export const ProductsPrimaryButtons = () => {
  const { setOpen, selectedBranchId } = useProductsContext()
  return (
    <Button
      className='space-x-1'
      onClick={() => setOpen('add')}
      disabled={!selectedBranchId}
    >
      <span>Agregar Producto</span> <PackagePlus size={18} />
    </Button>
  )
}
