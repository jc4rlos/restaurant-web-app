import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TablesDialogs } from './components/tables-dialogs'
import { TablesPrimaryButtons } from './components/tables-primary-buttons'
import { TablesProvider } from './components/tables-provider'
import { TablesTable } from './components/tables-table'
import { TablesTableSkeleton } from './components/tables-table-skeleton'
import { useTables } from './hooks/use-tables'

const route = getRouteApi('/_authenticated/tables/')

export const Tables = () => {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data, isLoading, isError, error } = useTables({
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 10,
    number: search.number,
    isActive: search.isActive,
  })

  return (
    <TablesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Mesas</h2>
            <p className='text-muted-foreground'>
              Administra las mesas del restaurante aquí.
            </p>
          </div>
          <TablesPrimaryButtons />
        </div>

        {isError && (
          <p className='text-sm text-destructive'>
            Error al cargar mesas: {(error as Error).message}
          </p>
        )}

        {isLoading ? (
          <TablesTableSkeleton />
        ) : (
          <TablesTable
            data={data?.data ?? []}
            total={data?.total ?? 0}
            search={search}
            navigate={navigate}
          />
        )}
      </Main>

      <TablesDialogs />
    </TablesProvider>
  )
}