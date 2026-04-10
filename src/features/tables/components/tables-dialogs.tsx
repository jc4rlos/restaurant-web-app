import { TablesActionDialog } from './tables-action-dialog'
import { TablesDeleteDialog } from './tables-delete-dialog'
import { useTablesContext } from './tables-provider'

export const TablesDialogs = () => {
  const { open, setOpen, currentRow, setCurrentRow } = useTablesContext()

  return (
    <>
      <TablesActionDialog
        key='table-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <TablesActionDialog
            key={`table-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />

          <TablesDeleteDialog
            key={`table-delete-${currentRow.id}`}
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