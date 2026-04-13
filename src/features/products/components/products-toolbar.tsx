import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'
import { DataTableViewOptions } from '@/components/data-table/view-options'
import { type Product, UNIT_OPTIONS } from '../data/schema'
import { useProductsContext } from './products-provider'

type ProductsToolbarProps = {
  table: Table<Product>
  nameInput: string
  onNameChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
  isFiltered: boolean
}

export const ProductsToolbar = ({
  table,
  nameInput,
  onNameChange,
  onSearch,
  onReset,
  isFiltered,
}: ProductsToolbarProps) => {
  const { setSelectedBranchId } = useProductsContext()

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <div className='flex items-center gap-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => setSelectedBranchId(null)}
            className='h-8 px-3'
          >
            <ArrowLeft size={14} className='me-1' />
            Cambiar sucursal
          </Button>
          <Input
            value={nameInput}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch()
            }}
            placeholder='Filtrar productos...'
            className='h-8 w-37.5 lg:w-62.5'
          />
          <Button size='sm' onClick={onSearch} className='h-8 px-3'>
            <Search size={14} className='me-1' />
            Buscar
          </Button>
        </div>

        <div className='flex gap-x-2'>
          <DataTableFacetedFilter
            column={table.getColumn('unitOfMeasure')}
            title='Unidad de medida'
            options={UNIT_OPTIONS}
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
}
