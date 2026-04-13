import { type Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'
import { type Product } from './schema'

type DbProduct = Database['public']['Tables']['product']['Row']
type DbProductInsert = Database['public']['Tables']['product']['Insert']
type DbProductUpdate = Database['public']['Tables']['product']['Update']

export type ProductsParams = {
  page: number
  pageSize: number
  branchId: number
  name?: string
  unitOfMeasure?: string[]
}

export type PaginatedProducts = {
  data: Product[]
  total: number
}

const SELECT_FIELDS = 'id, branch_id, name, description, stock, unit_of_measure'

const toProduct = (row: DbProduct): Product => ({
  id: row.id,
  branchId: row.branch_id,
  name: row.name,
  description: row.description,
  stock: row.stock,
  unitOfMeasure: row.unit_of_measure,
})

export const getProducts = async (
  params: ProductsParams
): Promise<PaginatedProducts> => {
  const { page, pageSize, branchId, name, unitOfMeasure } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('product')
    .select(SELECT_FIELDS, { count: 'exact' })
    .is('deleted_at', null)
    .eq('branch_id', branchId)
    .order('name', { ascending: true })
    .range(from, to)

  if (name) query = query.ilike('name', `%${name}%`)
  if (unitOfMeasure?.length === 1)
    query = query.eq(
      'unit_of_measure',
      unitOfMeasure[0] as Database['public']['Enums']['unit_of_measure']
    )

  const { data, error, count } = await query

  if (error) throw new Error(error.message)
  return { data: (data as DbProduct[]).map(toProduct), total: count ?? 0 }
}

export const getProductById = async (id: number): Promise<Product> => {
  const { data, error } = await supabase
    .from('product')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return toProduct(data as DbProduct)
}

export const createProduct = async (
  branchId: number,
  payload: Pick<Product, 'name' | 'description' | 'stock' | 'unitOfMeasure'>
): Promise<Product> => {
  const insert: DbProductInsert = {
    branch_id: branchId,
    name: payload.name,
    description: payload.description ?? null,
    stock: payload.stock,
    unit_of_measure:
      payload.unitOfMeasure as Database['public']['Enums']['unit_of_measure'],
    created_by: 'system',
  }

  const { data, error } = await supabase
    .from('product')
    .insert(insert)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toProduct(data as DbProduct)
}

export const updateProduct = async (
  id: number,
  payload: Partial<
    Pick<Product, 'name' | 'description' | 'stock' | 'unitOfMeasure'>
  >
): Promise<Product> => {
  const update: DbProductUpdate = {}
  if (payload.name !== undefined) update.name = payload.name
  if (payload.description !== undefined)
    update.description = payload.description
  if (payload.stock !== undefined) update.stock = payload.stock
  if (payload.unitOfMeasure !== undefined)
    update.unit_of_measure =
      payload.unitOfMeasure as Database['public']['Enums']['unit_of_measure']

  const { data, error } = await supabase
    .from('product')
    .update(update)
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toProduct(data as DbProduct)
}

export const deleteProduct = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('product')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export const deleteProducts = async (ids: number[]): Promise<void> => {
  const { error } = await supabase
    .from('product')
    .update({ deleted_at: new Date().toISOString() })
    .in('id', ids)

  if (error) throw new Error(error.message)
}
