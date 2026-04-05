import { supabase } from '@/lib/supabase'

const today = () => new Date().toISOString().slice(0, 10)

const startOfDay = () => `${today()}T00:00:00`
const endOfDay = () => `${today()}T23:59:59`

const startOfWeek = (offsetWeeks = 0) => {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay() - offsetWeeks * 7)
  return d.toISOString().slice(0, 10)
}

export type DayMetrics = {
  totalRevenue: number
  totalOrders: number
  avgTicket: number
  cancelledOrders: number
  activeOrders: number
  pendingOrders: number
}

export type OrdersByType = { type: string; count: number; revenue: number }

export type WaiterStat = {
  waiterId: number
  waiterName: string
  ordersCount: number
  revenue: number
  avgTicket: number
  cancelledCount: number
}

export type TopDish = {
  dishId: number
  dishName: string
  dishImageUrl: string | null
  totalQty: number
  totalRevenue: number
}

export type StockAlert = {
  menuItemId: number
  dishName: string
  stock: number
  branchName: string
}

export type TableStatus = {
  tableId: number
  number: string
  capacity: number
  hasActiveOrder: boolean
  orderId: number | null
  orderStatus: string | null
}

export type HourlyData = { hour: string; revenue: number; orders: number }

export type WeeklyDay = {
  date: string
  label: string
  thisWeek: number
  lastWeek: number
}

export const getDayMetrics = async (): Promise<DayMetrics> => {
  const { data, error } = await supabase
    .from('order')
    .select('status, total_amount')
    .gte('ordered_at', startOfDay())
    .lte('ordered_at', endOfDay())
    .is('deleted_at', null)

  if (error) throw new Error(error.message)

  const rows = data as { status: string; total_amount: number | null }[]
  const active = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'ON_THE_WAY']

  const delivered = rows.filter((r) => r.status === 'DELIVERED')
  const totalRevenue = delivered.reduce((s, r) => s + (r.total_amount ?? 0), 0)
  const totalOrders = rows.filter((r) => r.status !== 'CANCELLED').length
  const cancelledOrders = rows.filter((r) => r.status === 'CANCELLED').length
  const activeOrders = rows.filter((r) => active.includes(r.status)).length
  const pendingOrders = rows.filter((r) => r.status === 'PENDING').length

  return {
    totalRevenue,
    totalOrders,
    avgTicket: delivered.length > 0 ? totalRevenue / delivered.length : 0,
    cancelledOrders,
    activeOrders,
    pendingOrders,
  }
}

export const getOrdersByType = async (): Promise<OrdersByType[]> => {
  const { data, error } = await supabase
    .from('order')
    .select('order_type, total_amount, status')
    .gte('ordered_at', startOfDay())
    .lte('ordered_at', endOfDay())
    .is('deleted_at', null)
    .neq('status', 'CANCELLED')

  if (error) throw new Error(error.message)

  const rows = data as { order_type: string; total_amount: number | null; status: string }[]
  const map = new Map<string, { count: number; revenue: number }>()

  for (const row of rows) {
    const key = row.order_type
    const prev = map.get(key) ?? { count: 0, revenue: 0 }
    map.set(key, {
      count: prev.count + 1,
      revenue: prev.revenue + (row.total_amount ?? 0),
    })
  }

  const labels: Record<string, string> = {
    DINE_IN: 'Mesa',
    DELIVERY: 'Delivery',
    TAKEAWAY: 'Recoger',
  }

  return Array.from(map.entries()).map(([type, vals]) => ({
    type: labels[type] ?? type,
    count: vals.count,
    revenue: vals.revenue,
  }))
}

export const getWaiterPerformance = async (): Promise<WaiterStat[]> => {
  const { data, error } = await supabase
    .from('order')
    .select('waiter_id, status, total_amount, employee(first_name, last_name)')
    .gte('ordered_at', startOfDay())
    .lte('ordered_at', endOfDay())
    .is('deleted_at', null)

  if (error) throw new Error(error.message)

  const rows = data as {
    waiter_id: number
    status: string
    total_amount: number | null
    employee: { first_name: string; last_name: string } | null
  }[]

  const map = new Map<number, WaiterStat>()

  for (const row of rows) {
    const prev = map.get(row.waiter_id) ?? {
      waiterId: row.waiter_id,
      waiterName: row.employee
        ? `${row.employee.first_name} ${row.employee.last_name}`
        : `Mesero #${row.waiter_id}`,
      ordersCount: 0,
      revenue: 0,
      avgTicket: 0,
      cancelledCount: 0,
    }

    const isCancelled = row.status === 'CANCELLED'
    const revenue = isCancelled ? 0 : (row.total_amount ?? 0)

    map.set(row.waiter_id, {
      ...prev,
      ordersCount: isCancelled ? prev.ordersCount : prev.ordersCount + 1,
      revenue: prev.revenue + revenue,
      cancelledCount: prev.cancelledCount + (isCancelled ? 1 : 0),
    })
  }

  return Array.from(map.values())
    .map((w) => ({
      ...w,
      avgTicket: w.ordersCount > 0 ? w.revenue / w.ordersCount : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
}

export const getTopDishes = async (): Promise<TopDish[]> => {
  const { data, error } = await supabase
    .from('order_item')
    .select('dish_id, quantity, unit_price, subtotal, dish(name, image_url), order(ordered_at, status, deleted_at)')
    .gte('order.ordered_at', startOfDay())
    .lte('order.ordered_at', endOfDay())
    .is('order.deleted_at', null)
    .neq('order.status', 'CANCELLED')
    .is('deleted_at', null)

  if (error) throw new Error(error.message)

  const rows = data as {
    dish_id: number
    quantity: number
    unit_price: number
    subtotal: number | null
    dish: { name: string; image_url: string | null } | null
    order: { ordered_at: string; status: string; deleted_at: string | null } | null
  }[]

  const map = new Map<number, TopDish>()

  for (const row of rows) {
    if (!row.order) continue
    const prev = map.get(row.dish_id) ?? {
      dishId: row.dish_id,
      dishName: row.dish?.name ?? `Plato #${row.dish_id}`,
      dishImageUrl: row.dish?.image_url ?? null,
      totalQty: 0,
      totalRevenue: 0,
    }
    map.set(row.dish_id, {
      ...prev,
      totalQty: prev.totalQty + row.quantity,
      totalRevenue: prev.totalRevenue + (row.subtotal ?? row.quantity * row.unit_price),
    })
  }

  return Array.from(map.values())
    .sort((a, b) => b.totalQty - a.totalQty)
    .slice(0, 8)
}

export const getStockAlerts = async (): Promise<StockAlert[]> => {
  const { data, error } = await supabase
    .from('daily_menu')
    .select('id, stock, dish(name), branch(name)')
    .eq('menu_date', today())
    .eq('is_active', true)
    .is('deleted_at', null)
    .lte('stock', 5)
    .order('stock', { ascending: true })

  if (error) throw new Error(error.message)

  return (
    data as {
      id: number
      stock: number
      dish: { name: string } | null
      branch: { name: string } | null
    }[]
  ).map((r) => ({
    menuItemId: r.id,
    dishName: r.dish?.name ?? `Plato #${r.id}`,
    stock: r.stock,
    branchName: r.branch?.name ?? '—',
  }))
}

export const getTablesStatus = async (): Promise<TableStatus[]> => {
  const { data: tables, error: tErr } = await supabase
    .from('restaurant_table')
    .select('id, number, capacity')
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('number', { ascending: true })

  if (tErr) throw new Error(tErr.message)

  const { data: orders, error: oErr } = await supabase
    .from('order')
    .select('id, table_id, status')
    .not('table_id', 'is', null)
    .in('status', ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'])
    .is('deleted_at', null)

  if (oErr) throw new Error(oErr.message)

  const activeByTable = new Map<number, { orderId: number; status: string }>()
  for (const o of orders as { id: number; table_id: number; status: string }[]) {
    activeByTable.set(o.table_id, { orderId: o.id, status: o.status })
  }

  return (tables as { id: number; number: string; capacity: number }[]).map((t) => {
    const active = activeByTable.get(t.id)
    return {
      tableId: t.id,
      number: t.number,
      capacity: t.capacity,
      hasActiveOrder: !!active,
      orderId: active?.orderId ?? null,
      orderStatus: active?.status ?? null,
    }
  })
}

export const getHourlySales = async (): Promise<HourlyData[]> => {
  const { data, error } = await supabase
    .from('order')
    .select('ordered_at, total_amount, status')
    .gte('ordered_at', startOfDay())
    .lte('ordered_at', endOfDay())
    .is('deleted_at', null)
    .neq('status', 'CANCELLED')

  if (error) throw new Error(error.message)

  const rows = data as { ordered_at: string; total_amount: number | null; status: string }[]
  const map = new Map<number, { revenue: number; orders: number }>()

  for (const row of rows) {
    const hour = new Date(row.ordered_at).getHours()
    const prev = map.get(hour) ?? { revenue: 0, orders: 0 }
    map.set(hour, {
      revenue: prev.revenue + (row.total_amount ?? 0),
      orders: prev.orders + 1,
    })
  }

  return Array.from({ length: 24 }, (_, h) => {
    const val = map.get(h) ?? { revenue: 0, orders: 0 }
    return {
      hour: `${String(h).padStart(2, '0')}:00`,
      revenue: val.revenue,
      orders: val.orders,
    }
  }).filter((_, h) => h >= 6 && h <= 23)
}

export const getWeeklyComparison = async (): Promise<WeeklyDay[]> => {
  const thisStart = startOfWeek(0)
  const lastStart = startOfWeek(1)
  const lastEnd = `${startOfWeek(0)}T23:59:59`

  const { data, error } = await supabase
    .from('order')
    .select('ordered_at, total_amount, status')
    .gte('ordered_at', `${lastStart}T00:00:00`)
    .lte('ordered_at', endOfDay())
    .is('deleted_at', null)
    .neq('status', 'CANCELLED')

  if (error) throw new Error(error.message)

  const rows = data as { ordered_at: string; total_amount: number | null }[]

  const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const thisWeekMap = new Map<number, number>()
  const lastWeekMap = new Map<number, number>()

  const thisStartDate = new Date(`${thisStart}T00:00:00`)
  const lastStartDate = new Date(`${lastStart}T00:00:00`)
  const lastEndDate = new Date(lastEnd)

  for (const row of rows) {
    const d = new Date(row.ordered_at)
    const revenue = row.total_amount ?? 0

    if (d >= thisStartDate) {
      const dow = d.getDay()
      thisWeekMap.set(dow, (thisWeekMap.get(dow) ?? 0) + revenue)
    } else if (d >= lastStartDate && d <= lastEndDate) {
      const dow = d.getDay()
      lastWeekMap.set(dow, (lastWeekMap.get(dow) ?? 0) + revenue)
    }
  }

  return Array.from({ length: 7 }, (_, i) => ({
    date: String(i),
    label: DAY_NAMES[i],
    thisWeek: thisWeekMap.get(i) ?? 0,
    lastWeek: lastWeekMap.get(i) ?? 0,
  }))
}
