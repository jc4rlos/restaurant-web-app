import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { HourlySalesChart } from './components/hourly-sales-chart'
import { MetricCards } from './components/metric-cards'
import { OrdersByTypeChart } from './components/orders-by-type-chart'
import { StockAlerts } from './components/stock-alerts'
import { TablesStatus } from './components/tables-status'
import { TopDishes } from './components/top-dishes'
import { WaiterPerformance } from './components/waiter-performance'
import { WeeklyComparisonChart } from './components/weekly-comparison-chart'

export function Dashboard() {
  const today = format(new Date(), "EEEE d 'de' MMMM", { locale: es })

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

      <Main className='flex flex-1 flex-col gap-5'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Dashboard</h2>
          <p className='capitalize text-muted-foreground text-sm'>{today}</p>
        </div>

        <MetricCards />

        <div className='grid gap-5 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <HourlySalesChart />
          </div>
          <OrdersByTypeChart />
        </div>

        <div className='grid gap-5 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <WaiterPerformance />
          </div>
          <StockAlerts />
        </div>

        <div className='grid gap-5 lg:grid-cols-2'>
          <TopDishes />
          <TablesStatus />
        </div>

        <WeeklyComparisonChart />
      </Main>
    </>
  )
}
