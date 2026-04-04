import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type DailyMenuItem } from '../data/schema'
import { useDailyMenuContext } from './daily-menu-provider'

type Props = {
  item: DailyMenuItem
}

export const MenuItemRow = ({ item }: Props) => {
  const { setEditingItem, setDeletingItem } = useDailyMenuContext()

  return (
    <div className='flex items-center gap-3 rounded-lg border p-3'>
      {item.dishImageUrl ? (
        <img
          src={item.dishImageUrl}
          alt={item.dishName}
          className='h-12 w-12 rounded-md object-cover flex-shrink-0'
        />
      ) : (
        <div className='h-12 w-12 flex-shrink-0 rounded-md bg-muted' />
      )}

      <div className='flex-1 min-w-0'>
        <p className='truncate font-medium text-sm'>{item.dishName}</p>
        <div className='flex items-center gap-2 mt-1'>
          <span className='text-sm text-muted-foreground'>
            S/.{' '}
            {new Intl.NumberFormat('es-PE', {
              minimumFractionDigits: 2,
            }).format(item.price)}
          </span>
          <span className='text-muted-foreground'>·</span>
          <span className='text-sm text-muted-foreground'>
            Stock: {item.stock}
          </span>
        </div>
      </div>

      <div className='flex items-center gap-2 flex-shrink-0'>
        <Badge variant={item.isActive ? 'default' : 'secondary'}>
          {item.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8'
          onClick={() => setEditingItem(item)}
        >
          <Pencil size={14} />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8 text-muted-foreground hover:text-destructive'
          onClick={() => setDeletingItem(item)}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  )
}
