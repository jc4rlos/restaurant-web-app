import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Dish } from '../data/schema'
import { useDeleteDish } from '../hooks/use-dishes'

type DishesDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Dish
}

export const DishesDeleteDialog = ({
  open,
  onOpenChange,
  currentRow,
}: DishesDeleteDialogProps) => {
  const deleteMutation = useDeleteDish()

  const handleDelete = () => {
    deleteMutation.mutate(currentRow.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={deleteMutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Eliminar Plato
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p>
            ¿Estás seguro de que deseas eliminar{' '}
            <span className='font-bold'>{currentRow.name}</span>? Esta acción no
            se puede deshacer.
          </p>
          <Alert variant='destructive'>
            <AlertTitle>¡Advertencia!</AlertTitle>
            <AlertDescription>
              Ten cuidado, esta operación no se puede revertir.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
      destructive
    />
  )
}
