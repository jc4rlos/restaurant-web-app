import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CategoriesDialogs } from './components/categories-dialogs'
import { CategoriesPrimaryButtons } from './components/categories-primary-buttons'
import { CategoriesProvider } from './components/categories-provider'
import { CategoriesTable } from './components/categories-table'
import { CategoriesTableSkeleton } from './components/categories-table-skeleton'
import { useCategories } from './hooks/use-categories'

const route = getRouteApi('/_authenticated/categories/')

export const Categories = () => {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data, isLoading, isError, error } = useCategories({
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 10,
    name: search.name,
    isActive: search.isActive,
  })

  return (
    <CategoriesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Categorías</h2>
            <p className='text-muted-foreground'>
              Administra tus categorías de productos aquí.
            </p>
          </div>
          <CategoriesPrimaryButtons />
        </div>

        {isError && (
          <p className='text-sm text-destructive'>
            Error al cargar categorías: {(error as Error).message}
          </p>
        )}

        {isLoading ? (
          <CategoriesTableSkeleton />
        ) : (
          <CategoriesTable
            data={data?.data ?? []}
            total={data?.total ?? 0}
            search={search}
            navigate={navigate}
          />
        )}
      </Main>

      <CategoriesDialogs />
    </CategoriesProvider>
  )
}
