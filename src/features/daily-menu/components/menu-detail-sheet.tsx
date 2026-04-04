import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useMenuItems } from '../hooks/use-daily-menu'
import { useDailyMenuContext } from './daily-menu-provider'
import { MenuAddDishDialog } from './menu-add-dish-dialog'
import { MenuItemDeleteDialog } from './menu-item-delete-dialog'
import { MenuItemEditDialog } from './menu-item-edit-dialog'
import { MenuItemRow } from './menu-item-row'
import { formatMenuDate, formatMenuDateRange } from './menu-date-label'

export const MenuDetailSheet = () => {
  const {
    isDetailOpen,
    closeDetail,
    selectedDate,
    selectedBranchId,
    activeDateRange,
    editingItem,
    setEditingItem,
    deletingItem,
    setDeletingItem,
    isAddDishOpen,
    setIsAddDishOpen,
  } = useDailyMenuContext()

  const { data: items = [], isLoading } = useMenuItems(
    selectedBranchId,
    selectedDate
  )

  const title = selectedDate ? formatMenuDate(selectedDate) : ''
  const rangeSubtitle =
    activeDateRange && activeDateRange.from !== activeDateRange.to
      ? `Rango: ${formatMenuDateRange(activeDateRange.from, activeDateRange.to)}`
      : null

  return (
    <>
      <Sheet open={isDetailOpen} onOpenChange={(s) => { if (!s) closeDetail() }}>
        <SheetContent className='flex flex-col gap-0 sm:max-w-lg w-full'>
          <SheetHeader className='px-6 pt-6 pb-4'>
            <SheetTitle className='capitalize'>{title}</SheetTitle>
            <SheetDescription>
              {rangeSubtitle ?? `${items.length} plato${items.length === 1 ? '' : 's'} en el menú`}
            </SheetDescription>
          </SheetHeader>

          <Separator />

          <div className='flex-1 overflow-y-auto px-6 py-4'>
            {isLoading ? (
              <div className='flex flex-col gap-3'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className='h-[72px] w-full rounded-lg' />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className='flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground'>
                <p className='text-sm'>No hay platos en este menú.</p>
                <p className='text-xs'>Agrega el primero con el botón de abajo.</p>
              </div>
            ) : (
              <div className='flex flex-col gap-3'>
                {items.map((item) => (
                  <MenuItemRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div className='px-6 py-4'>
            <Button
              className='w-full gap-2'
              onClick={() => setIsAddDishOpen(true)}
            >
              <PlusCircle size={16} />
              Agregar Plato
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <MenuAddDishDialog
        open={isAddDishOpen}
        onOpenChange={setIsAddDishOpen}
      />

      {editingItem && (
        <MenuItemEditDialog
          key={`edit-${editingItem.id}`}
          item={editingItem}
          open={!!editingItem}
          onOpenChange={(s) => { if (!s) setEditingItem(null) }}
        />
      )}

      {deletingItem && (
        <MenuItemDeleteDialog
          key={`delete-${deletingItem.id}`}
          item={deletingItem}
          open={!!deletingItem}
          onOpenChange={(s) => { if (!s) setDeletingItem(null) }}
        />
      )}
    </>
  )
}
