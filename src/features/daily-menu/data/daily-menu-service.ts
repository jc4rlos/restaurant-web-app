import { type Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'
import { type DailyMenuItem, type MenuDateSummary } from './schema'

type DbDailyMenu = Database['public']['Tables']['daily_menu']['Row']
type DbDailyMenuInsert = Database['public']['Tables']['daily_menu']['Insert']
type DbDailyMenuUpdate = Database['public']['Tables']['daily_menu']['Update']

type DailyMenuRow = DbDailyMenu & {
  branch: { name: string } | null
  dish: { id: number; name: string; image_url: string | null } | null
}

const toMenuItem = (row: DailyMenuRow): DailyMenuItem => ({
  id: row.id,
  menuDate: row.menu_date,
  branchId: row.branch_id,
  dishId: row.dish_id,
  dishName: row.dish?.name ?? '',
  dishImageUrl: row.dish?.image_url ?? null,
  price: row.price,
  stock: row.stock,
  isActive: row.is_active,
})

export const getMenuSummaries = async (): Promise<MenuDateSummary[]> => {
  const { data, error } = await supabase
    .from('daily_menu')
    .select('menu_date, branch_id, id, branch(name)')
    .is('deleted_at', null)
    .order('menu_date', { ascending: false })
    .limit(500)

  if (error) throw new Error(error.message)

  const grouped = new Map<string, MenuDateSummary>()

  for (const row of data as DailyMenuRow[]) {
    const key = `${row.menu_date}-${row.branch_id}`
    if (!grouped.has(key)) {
      grouped.set(key, {
        date: row.menu_date,
        branchId: row.branch_id,
        branchName: row.branch?.name ?? 'Sucursal',
        dishCount: 0,
      })
    }
    grouped.get(key)!.dishCount++
  }

  return Array.from(grouped.values())
}

export const getMenuItems = async (
  branchId: number,
  date: string
): Promise<DailyMenuItem[]> => {
  const { data, error } = await supabase
    .from('daily_menu')
    .select('id, menu_date, branch_id, dish_id, price, stock, is_active, dish(id, name, image_url)')
    .eq('branch_id', branchId)
    .eq('menu_date', date)
    .is('deleted_at', null)
    .order('id', { ascending: true })

  if (error) throw new Error(error.message)
  return (data as DailyMenuRow[]).map(toMenuItem)
}

type AddDishEntry = {
  branchId: number
  dishId: number
  menuDate: string
  price: number
  stock: number
}

export const addDishToMenu = async (entries: AddDishEntry[]): Promise<void> => {
  const inserts: DbDailyMenuInsert[] = entries.map((e) => ({
    branch_id: e.branchId,
    dish_id: e.dishId,
    menu_date: e.menuDate,
    price: e.price,
    stock: e.stock,
    created_by: 'system',
  }))

  const { error } = await supabase.from('daily_menu').insert(inserts)
  if (error) throw new Error(error.message)
}

export const updateMenuItem = async (
  id: number,
  payload: Partial<Pick<DailyMenuItem, 'price' | 'stock' | 'isActive'>>
): Promise<DailyMenuItem> => {
  const update: DbDailyMenuUpdate = {}
  if (payload.price !== undefined) update.price = payload.price
  if (payload.stock !== undefined) update.stock = payload.stock
  if (payload.isActive !== undefined) update.is_active = payload.isActive

  const { data, error } = await supabase
    .from('daily_menu')
    .update(update)
    .eq('id', id)
    .select('id, menu_date, branch_id, dish_id, price, stock, is_active, dish(id, name, image_url)')
    .single()

  if (error) throw new Error(error.message)
  return toMenuItem(data as DailyMenuRow)
}

export const removeMenuItem = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('daily_menu')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export const removeMenuByDate = async (
  branchId: number,
  date: string
): Promise<void> => {
  const { error } = await supabase
    .from('daily_menu')
    .update({ deleted_at: new Date().toISOString() })
    .eq('branch_id', branchId)
    .eq('menu_date', date)

  if (error) throw new Error(error.message)
}
