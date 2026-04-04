import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type DailyMenuItem } from '../data/schema'
import { useRemoveMenuItem } from '../hooks/use-daily-menu'

type Props = {
  item: DailyMenuItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const MenuItemDeleteDialog = ({ item, open, onOpenChange }: Props) => {
  const removeMutation = useRemoveMenuItem()

  const handleDelete = () => {
    removeMutation.mutate(item.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={removeMutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Quitar Plato del Menú
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p>
            ¿Deseas quitar{' '}
            <span className='font-bold'>{item.dishName}</span> del menú de este
            día?
          </p>
          <Alert variant='destructive'>
            <AlertTitle>¡Advertencia!</AlertTitle>
            <AlertDescription>
              Esta acción no se puede revertir.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={removeMutation.isPending ? 'Eliminando...' : 'Quitar'}
      destructive
    />
  )
}
