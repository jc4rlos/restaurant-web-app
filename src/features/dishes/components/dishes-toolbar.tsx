import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'
import { DataTableViewOptions } from '@/components/data-table/view-options'
import { type Dish } from '../data/schema'

type DishesToolbarProps = {
  table: Table<Dish>
  nameInput: string
  onNameChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
  isFiltered: boolean
}

export const DishesToolbar = ({
  table,
  nameInput,
  onNameChange,
  onSearch,
  onReset,
  isFiltered,
}: DishesToolbarProps) => (
  <div className='flex items-center justify-between'>
    <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
      <div className='flex items-center gap-2'>
        <Input
          value={nameInput}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch()
          }}
          placeholder='Filtrar platos...'
          className='h-8 w-37.5 lg:w-62.5'
        />
        <Button size='sm' onClick={onSearch} className='h-8 px-3'>
          <Search size={14} className='me-1' />
          Buscar
        </Button>
      </div>

      <div className='flex gap-x-2'>
        <DataTableFacetedFilter
          column={table.getColumn('isActive')}
          title='Estado'
          options={[
            { label: 'Activo', value: 'true' },
            { label: 'Inactivo', value: 'false' },
          ]}
        />
      </div>

      {isFiltered && (
        <Button variant='ghost' onClick={onReset} className='h-8 px-2 lg:px-3'>
          Limpiar
          <Cross2Icon className='ms-2 h-4 w-4' />
        </Button>
      )}
    </div>

    <DataTableViewOptions table={table} />
  </div>
)
