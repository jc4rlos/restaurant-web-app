import { DishesActionDialog } from './dishes-action-dialog'
import { DishesDeleteDialog } from './dishes-delete-dialog'
import { useDishesContext } from './dishes-provider'

export const DishesDialogs = () => {
  const { open, setOpen, currentRow, setCurrentRow } = useDishesContext()

  return (
    <>
      <DishesActionDialog
        key='dish-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <DishesActionDialog
            key={`dish-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />

          <DishesDeleteDialog
            key={`dish-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
