import { type ColumnDef } from '@tanstack/react-table'
import { CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Dish } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const dishesColumns: ColumnDef<Dish>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Seleccionar todo'
        className='translate-y-0.5'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Seleccionar fila'
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'image',
    header: () => null,
    cell: ({ row }) => {
      const url = row.original.imageUrl
      return url ? (
        <img
          src={url}
          alt={row.original.name}
          className='h-10 w-10 rounded-md object-cover'
        />
      ) : (
        <div className='h-10 w-10 rounded-md bg-muted' />
      )
    },
    meta: { className: 'w-14' },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48 ps-3'>{row.getValue('name')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Descripción' />
    ),
    cell: ({ row }) => {
      const desc = row.getValue('description') as string | null
      return (
        <LongText className='max-w-64 text-muted-foreground'>
          {desc ?? '—'}
        </LongText>
      )
    },
  },
  {
    accessorKey: 'basePrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Precio' />
    ),
    cell: ({ row }) => {
      const price = row.getValue('basePrice') as number
      return (
        <span className='font-medium'>
          {new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
          }).format(price)}
        </span>
      )
    },
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Estado' />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return isActive ? (
        <span className='flex items-center gap-1 text-teal-600 dark:text-teal-400'>
          <CheckCircle size={15} />
          Activo
        </span>
      ) : (
        <span className='flex items-center gap-1 text-muted-foreground'>
          <XCircle size={15} />
          Inactivo
        </span>
      )
    },
    filterFn: (row, id, value) => value.includes(String(row.getValue(id))),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: { className: 'w-10' },
  },
]
