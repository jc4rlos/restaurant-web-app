import { type Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'
import { type Category } from './schema'

type DbCategory = Database['public']['Tables']['category']['Row']
type DbCategoryInsert = Database['public']['Tables']['category']['Insert']
type DbCategoryUpdate = Database['public']['Tables']['category']['Update']

export type CategoriesParams = {
  page: number
  pageSize: number
  name?: string
  isActive?: string[]
}

export type PaginatedCategories = {
  data: Category[]
  total: number
}

const SELECT_FIELDS = 'id, name, description, is_active'

const toCategory = (row: DbCategory): Category => ({
  id: row.id,
  name: row.name,
  description: row.description,
  isActive: row.is_active,
})

export const getCategories = async (
  params: CategoriesParams
): Promise<PaginatedCategories> => {
  const { page, pageSize, name, isActive } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('category')
    .select(SELECT_FIELDS, { count: 'exact' })
    .is('deleted_at', null)
    .order('name', { ascending: true })
    .range(from, to)

  if (name) query = query.ilike('name', `%${name}%`)
  if (isActive?.length === 1)
    query = query.eq('is_active', isActive[0] === 'true')

  const { data, error, count } = await query

  if (error) throw new Error(error.message)
  return { data: (data as DbCategory[]).map(toCategory), total: count ?? 0 }
}

export const getCategoryById = async (id: number): Promise<Category> => {
  const { data, error } = await supabase
    .from('category')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return toCategory(data as DbCategory)
}

export const createCategory = async (
  payload: Pick<Category, 'name' | 'description' | 'isActive'>
): Promise<Category> => {
  const insert: DbCategoryInsert = {
    name: payload.name,
    description: payload.description ?? null,
    is_active: payload.isActive,
    created_by: 'system',
  }

  const { data, error } = await supabase
    .from('category')
    .insert(insert)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toCategory(data as DbCategory)
}

export const updateCategory = async (
  id: number,
  payload: Partial<Pick<Category, 'name' | 'description' | 'isActive'>>
): Promise<Category> => {
  const update: DbCategoryUpdate = {}
  if (payload.name !== undefined) update.name = payload.name
  if (payload.description !== undefined)
    update.description = payload.description
  if (payload.isActive !== undefined) update.is_active = payload.isActive

  const { data, error } = await supabase
    .from('category')
    .update(update)
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toCategory(data as DbCategory)
}

export const deleteCategory = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('category')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export const deleteCategories = async (ids: number[]): Promise<void> => {
  const { error } = await supabase
    .from('category')
    .update({ deleted_at: new Date().toISOString() })
    .in('id', ids)

  if (error) throw new Error(error.message)
}
