import { type Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'
import { type Table } from './schema'

type DbTable = Database['public']['Tables']['restaurant_table']['Row']
type DbTableInsert = Database['public']['Tables']['restaurant_table']['Insert']
type DbTableUpdate = Database['public']['Tables']['restaurant_table']['Update']

export type Branch = {
  id: number
  name: string
}

export type TablesParams = {
  page: number
  pageSize: number
  number?: string
  isActive?: string[]
  branchId?: number
}

export type PaginatedTables = {
  data: Table[]
  total: number
}

const SELECT_FIELDS = 'id, branch_id, number, capacity, is_active'

const toTable = (row: DbTable): Table => ({
  id: row.id,
  branchId: row.branch_id,
  number: row.number,
  capacity: row.capacity,
  isActive: row.is_active,
})

export const getTables = async (
  params: TablesParams
): Promise<PaginatedTables> => {
  const { page, pageSize, number, isActive, branchId } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('restaurant_table')
    .select(SELECT_FIELDS, { count: 'exact' })
    .is('deleted_at', null)
    .order('number', { ascending: true })
    .range(from, to)

  if (number) query = query.ilike('number', `%${number}%`)
  if (isActive?.length === 1)
    query = query.eq('is_active', isActive[0] === 'true')
  if (branchId) query = query.eq('branch_id', branchId)

  const { data, error, count } = await query

  if (error) throw new Error(error.message)
  return { data: (data as DbTable[]).map(toTable), total: count ?? 0 }
}

export const getTableById = async (id: number): Promise<Table> => {
  const { data, error } = await supabase
    .from('restaurant_table')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return toTable(data as DbTable)
}

export const createTable = async (
  payload: Omit<Table, 'id'>
): Promise<Table> => {
  const insert: DbTableInsert = {
    branch_id: payload.branchId,
    number: payload.number,
    capacity: payload.capacity,
    is_active: payload.isActive,
    created_by: 'system',
  }

  const { data, error } = await supabase
    .from('restaurant_table')
    .insert(insert)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toTable(data as DbTable)
}

export const updateTable = async (
  id: number,
  payload: Partial<Omit<Table, 'id'>>
): Promise<Table> => {
  const update: DbTableUpdate = {}
  if (payload.number !== undefined) update.number = payload.number
  if (payload.capacity !== undefined) update.capacity = payload.capacity
  if (payload.isActive !== undefined) update.is_active = payload.isActive

  const { data, error } = await supabase
    .from('restaurant_table')
    .update(update)
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toTable(data as DbTable)
}

export const deleteTable = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('restaurant_table')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export const deleteTables = async (ids: number[]): Promise<void> => {
  const { error } = await supabase
    .from('restaurant_table')
    .update({ deleted_at: new Date().toISOString() })
    .in('id', ids)

  if (error) throw new Error(error.message)
}

export const getBranches = async (): Promise<Branch[]> => {
  const { data, error } = await supabase
    .from('branch')
    .select('id, name')
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return data as Branch[]
}