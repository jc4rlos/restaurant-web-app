import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DailyMenuPrimaryButtons } from './components/daily-menu-primary-buttons'
import {
  DailyMenuProvider,
  useDailyMenuContext,
} from './components/daily-menu-provider'
import { MenuCreateDialog } from './components/menu-create-dialog'
import { MenuDetailSheet } from './components/menu-detail-sheet'
import { MenuList } from './components/menu-list'
import { useMenuSummaries } from './hooks/use-daily-menu'

const DailyMenuContent = () => {
  const { isCreateOpen, setIsCreateOpen } = useDailyMenuContext()
  const { data: summaries = [], isLoading, isError, error } = useMenuSummaries()

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
            <h2 className='text-2xl font-bold tracking-tight'>Menú del Día</h2>
            <p className='text-muted-foreground'>
              Programa y administra el menú del restaurante por fecha.
            </p>
          </div>
          <DailyMenuPrimaryButtons />
        </div>

        {isError && (
          <p className='text-sm text-destructive'>
            Error al cargar menús: {(error as Error).message}
          </p>
        )}

        <MenuList summaries={summaries} isLoading={isLoading} />
      </Main>

      <MenuCreateDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <MenuDetailSheet />
    </>
  )
}

export const DailyMenu = () => (
  <DailyMenuProvider>
    <DailyMenuContent />
  </DailyMenuProvider>
)
