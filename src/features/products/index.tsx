import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProductsDialogs } from './components/products-dialogs'
import { ProductsPrimaryButtons } from './components/products-primary-buttons'
import {
  ProductsProvider,
  useProductsContext,
} from './components/products-provider'
import { ProductsTable } from './components/products-table'
import { ProductsTableSkeleton } from './components/products-table-skeleton'
import { useActiveBranches } from './hooks/use-active-branches'
import { useProducts } from './hooks/use-products'

const route = getRouteApi('/_authenticated/products/')

const BranchSelectorInline = () => {
  const { setSelectedBranchId } = useProductsContext()
  const { data: branches = [], isLoading } = useActiveBranches()
  const [tempBranchId, setTempBranchId] = useState<string>('')

  const handleConfirm = () => {
    if (tempBranchId) {
      setSelectedBranchId(Number(tempBranchId))
    }
  }

  if (isLoading) {
    return (
      <p className='text-sm text-muted-foreground'>Cargando sucursales...</p>
    )
  }

  if (!branches.length) {
    return (
      <p className='text-sm text-muted-foreground'>
        No hay sucursales activas disponibles.
      </p>
    )
  }

  return (
    <div className='flex items-center gap-3'>
      <Select value={tempBranchId} onValueChange={setTempBranchId}>
        <SelectTrigger className='w-full sm:w-72'>
          <SelectValue placeholder='Selecciona una sucursal' />
        </SelectTrigger>
        <SelectContent>
          {branches.map((b) => (
            <SelectItem key={b.id} value={String(b.id)}>
              {b.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={handleConfirm}
        disabled={!tempBranchId}
        className='sm:w-auto'
      >
        Confirmar
      </Button>
    </div>
  )
}

const ProductsContent = () => {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { selectedBranchId } = useProductsContext()

  const { data, isLoading, isError, error } = useProducts({
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 10,
    branchId: selectedBranchId ?? 0,
    name: search.name,
    unitOfMeasure: search.unitOfMeasure,
  })

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Productos</h2>
            <p className='text-muted-foreground'>
              Administra el almacén de productos por sucursal aquí.
            </p>
          </div>
          <ProductsPrimaryButtons />
        </div>

        {isError && (
          <p className='text-sm text-destructive'>
            Error al cargar productos: {(error as Error).message}
          </p>
        )}

        {!selectedBranchId ? (
          <div className='flex flex-1 flex-col gap-4'>
            <div className='flex flex-col gap-4 rounded-lg border bg-muted/30 p-6'>
              <div className='flex items-center gap-2'>
                <h3 className='font-medium'>Seleccionar Sucursal</h3>
              </div>
              <p className='text-sm text-muted-foreground'>
                Elige una sucursal para gestionar sus productos.
              </p>
              <BranchSelectorInline />
            </div>
          </div>
        ) : isLoading ? (
          <ProductsTableSkeleton />
        ) : (
          <ProductsTable
            data={data?.data ?? []}
            total={data?.total ?? 0}
            search={search}
            navigate={navigate}
          />
        )}
      </Main>

      <ProductsDialogs />
    </>
  )
}

export const Products = () => (
  <ProductsProvider>
    <ProductsContent />
  </ProductsProvider>
)
