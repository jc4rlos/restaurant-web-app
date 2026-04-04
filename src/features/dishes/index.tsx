import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DishesDialogs } from './components/dishes-dialogs'
import { DishesPrimaryButtons } from './components/dishes-primary-buttons'
import { DishesProvider } from './components/dishes-provider'
import { DishesTable } from './components/dishes-table'
import { DishesTableSkeleton } from './components/dishes-table-skeleton'
import { useDishes } from './hooks/use-dishes'

const route = getRouteApi('/_authenticated/dishes/')

export const Dishes = () => {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data, isLoading, isError, error } = useDishes({
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 10,
    name: search.name,
    isActive: search.isActive,
  })

  return (
    <DishesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Platos</h2>
            <p className='text-muted-foreground'>
              Administra tu menú de platos aquí.
            </p>
          </div>
          <DishesPrimaryButtons />
        </div>

        {isError && (
          <p className='text-sm text-destructive'>
            Error al cargar platos: {(error as Error).message}
          </p>
        )}

        {isLoading ? (
          <DishesTableSkeleton />
        ) : (
          <DishesTable
            data={data?.data ?? []}
            total={data?.total ?? 0}
            search={search}
            navigate={navigate}
          />
        )}
      </Main>

      <DishesDialogs />
    </DishesProvider>
  )
}
