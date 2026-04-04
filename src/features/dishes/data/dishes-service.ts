import { type Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'
import { type Dish } from './schema'

type DbDish = Database['public']['Tables']['dish']['Row']
type DbDishInsert = Database['public']['Tables']['dish']['Insert']
type DbDishUpdate = Database['public']['Tables']['dish']['Update']

export type DishesParams = {
  page: number
  pageSize: number
  name?: string
  isActive?: string[]
  categoryId?: number
}

export type PaginatedDishes = {
  data: Dish[]
  total: number
}

const SELECT_FIELDS = 'id, category_id, name, description, base_price, image_url, is_active'
const STORAGE_BUCKET = import.meta.env.VITE_DISH_IMAGES_BUCKET as string

const toDish = (row: DbDish): Dish => ({
  id: row.id,
  categoryId: row.category_id,
  name: row.name,
  description: row.description,
  basePrice: row.base_price,
  imageUrl: row.image_url,
  isActive: row.is_active,
})

export const uploadDishImage = async (file: File): Promise<string> => {
  const ext = file.name.split('.').pop()
  const path = `${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: false })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export const deleteDishImage = async (imageUrl: string): Promise<void> => {
  const path = imageUrl.split(`${STORAGE_BUCKET}/`).pop()
  if (!path) return

  await supabase.storage.from(STORAGE_BUCKET).remove([path])
}

export const getDishes = async (params: DishesParams): Promise<PaginatedDishes> => {
  const { page, pageSize, name, isActive, categoryId } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('dish')
    .select(SELECT_FIELDS, { count: 'exact' })
    .is('deleted_at', null)
    .order('name', { ascending: true })
    .range(from, to)

  if (name) query = query.ilike('name', `%${name}%`)
  if (isActive?.length === 1) query = query.eq('is_active', isActive[0] === 'true')
  if (categoryId) query = query.eq('category_id', categoryId)

  const { data, error, count } = await query

  if (error) throw new Error(error.message)
  return { data: (data as DbDish[]).map(toDish), total: count ?? 0 }
}

export const createDish = async (
  payload: Omit<Dish, 'id'> & { imageFile?: File }
): Promise<Dish> => {
  let imageUrl = payload.imageUrl

  if (payload.imageFile) {
    imageUrl = await uploadDishImage(payload.imageFile)
  }

  const insert: DbDishInsert = {
    category_id: payload.categoryId,
    name: payload.name,
    description: payload.description ?? null,
    base_price: payload.basePrice,
    image_url: imageUrl,
    is_active: payload.isActive,
    created_by: 'system',
  }

  const { data, error } = await supabase
    .from('dish')
    .insert(insert)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toDish(data as DbDish)
}

export const updateDish = async (
  id: number,
  payload: Partial<Omit<Dish, 'id'>> & { imageFile?: File }
): Promise<Dish> => {
  let imageUrl = payload.imageUrl

  if (payload.imageFile) {
    imageUrl = await uploadDishImage(payload.imageFile)
  }

  const update: DbDishUpdate = {}
  if (payload.categoryId !== undefined) update.category_id = payload.categoryId
  if (payload.name !== undefined) update.name = payload.name
  if (payload.description !== undefined) update.description = payload.description
  if (payload.basePrice !== undefined) update.base_price = payload.basePrice
  if (imageUrl !== undefined) update.image_url = imageUrl
  if (payload.isActive !== undefined) update.is_active = payload.isActive

  const { data, error } = await supabase
    .from('dish')
    .update(update)
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toDish(data as DbDish)
}

export const deleteDish = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('dish')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export const deleteDishes = async (ids: number[]): Promise<void> => {
  const { error } = await supabase
    .from('dish')
    .update({ deleted_at: new Date().toISOString() })
    .in('id', ids)

  if (error) throw new Error(error.message)
}
