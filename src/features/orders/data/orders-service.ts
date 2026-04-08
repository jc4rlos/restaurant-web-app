import { supabase } from '@/lib/supabase'
import {
  type CreateOrderPayload,
  type MenuDish,
  type Order,
  type OrderItem,
  type OrderDelivery,
  type OrderStatus,
  type TableOption,
} from './schema'

// ─── Mappers ────────────────────────────────────────────────────────────────

type DbOrderRow = {
  id: number
  branch_id: number
  waiter_id: number
  table_id: number | null
  order_type: string
  status: string
  customer_name: string | null
  customer_phone: string | null
  notes: string | null
  total_amount: number | null
  ordered_at: string
  branch: { name: string } | null
  restaurant_table: { number: string } | null
  employee: { first_name: string; last_name: string; role: string | null } | null
  order_item: DbOrderItemRow[]
  order_delivery: DbOrderDeliveryRow | null
}

type DbOrderItemRow = {
  id: number
  order_id: number
  dish_id: number
  quantity: number
  unit_price: number
  subtotal: number | null
  notes: string | null
  dish: { name: string; image_url: string | null } | null
}

type DbOrderDeliveryRow = {
  id: number
  recipient_name: string
  phone: string | null
  address: string | null
  reference: string | null
  district: string | null
  delivery_fee: number
  estimated_at: string | null
  delivered_at: string | null
}

const toOrderItem = (row: DbOrderItemRow): OrderItem => ({
  id: row.id,
  orderId: row.order_id,
  dishId: row.dish_id,
  dishName: row.dish?.name ?? '',
  dishImageUrl: row.dish?.image_url ?? null,
  quantity: row.quantity,
  unitPrice: row.unit_price,
  subtotal: row.subtotal ?? row.quantity * row.unit_price,
  notes: row.notes,
})

const toDelivery = (row: DbOrderDeliveryRow): OrderDelivery => ({
  id: row.id,
  recipientName: row.recipient_name,
  phone: row.phone,
  address: row.address,
  reference: row.reference,
  district: row.district,
  deliveryFee: row.delivery_fee,
  estimatedAt: row.estimated_at,
  deliveredAt: row.delivered_at,
})

const ORDER_SELECT = `
  id, branch_id, waiter_id, table_id, order_type, status,
  customer_name, customer_phone, notes, total_amount, ordered_at,
  branch(name),
  restaurant_table(number),
  employee(first_name, last_name, role),
  order_item(id, order_id, dish_id, quantity, unit_price, subtotal, notes, dish(name, image_url)),
  order_delivery(id, recipient_name, phone, address, reference, district, delivery_fee, estimated_at, delivered_at)
`.trim()

const toOrder = (row: DbOrderRow): Order => ({
  id: row.id,
  branchId: row.branch_id,
  branchName: row.branch?.name ?? '',
  waiterId: row.waiter_id,
  waiterName: row.employee?.first_name && row.employee?.last_name 
  ? `${row.employee.first_name} ${row.employee.last_name}`
  : '',
  waiterRole: row.employee?.role ?? null,
  tableId: row.table_id,
  tableNumber: row.restaurant_table?.number ?? null,
  orderType: row.order_type as Order['orderType'],
  status: row.status as Order['status'],
  customerName: row.customer_name,
  customerPhone: row.customer_phone,
  notes: row.notes,
  totalAmount: row.total_amount ?? 0,
  orderedAt: row.ordered_at,
  items: (row.order_item ?? []).map(toOrderItem),
  delivery: row.order_delivery ? toDelivery(row.order_delivery) : null,
})

// ─── Queries ────────────────────────────────────────────────────────────────

export type GetOrdersFilter = {
  branchId?: number
  status?: OrderStatus | 'ALL'
  orderType?: string
}

export const getOrders = async (filter: GetOrdersFilter = {}): Promise<Order[]> => {
  let query = supabase
    .from('order')
    .select(ORDER_SELECT)
    .is('deleted_at', null)
    .order('ordered_at', { ascending: false })
    .limit(200)

  if (filter.branchId) query = query.eq('branch_id', filter.branchId)
  if (filter.status && filter.status !== 'ALL')
    query = query.eq('status', filter.status)
  if (filter.orderType && filter.orderType !== 'ALL')
    query = query.eq('order_type', filter.orderType as 'DINE_IN' | 'DELIVERY' | 'TAKEAWAY')

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data as unknown as DbOrderRow[]).map(toOrder)
}

export const getOrderById = async (id: number): Promise<Order> => {
  const { data, error } = await supabase
    .from('order')
    .select(ORDER_SELECT)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return toOrder(data as unknown as DbOrderRow)
}

export const getTodayMenuDishes = async (branchId: number): Promise<MenuDish[]> => {
  const today = new Date().toISOString().slice(0, 10)
  const { data, error } = await supabase
    .from('daily_menu')
    .select('id, dish_id, price, stock, dish(id, name, image_url)')
    .eq('branch_id', branchId)
    .eq('menu_date', today)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('id', { ascending: true })

  if (error) throw new Error(error.message)

  return (data as Array<{
    id: number
    dish_id: number
    price: number
    stock: number
    dish: { id: number; name: string; image_url: string | null } | null
  }>).map((row) => ({
    menuItemId: row.id,
    dishId: row.dish_id,
    dishName: row.dish?.name ?? '',
    dishImageUrl: row.dish?.image_url ?? null,
    price: row.price,
    stock: row.stock,
  }))
}

export const getTablesByBranch = async (branchId: number): Promise<TableOption[]> => {
  const { data, error } = await supabase
    .from('restaurant_table')
    .select('id, number, capacity')
    .eq('branch_id', branchId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('number', { ascending: true })

  if (error) throw new Error(error.message)
  return data as TableOption[]
}

// ─── Mutations ──────────────────────────────────────────────────────────────

export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  // 1. Insert order
  const { data: orderRow, error: orderError } = await supabase
    .from('order')
    .insert({
      branch_id: payload.branchId,
      waiter_id: payload.waiterId,
      order_type: payload.orderType,
      table_id: payload.tableId ?? null,
      customer_name: payload.customerName ?? null,
      customer_phone: payload.customerPhone ?? null,
      notes: payload.notes ?? null,
      created_by: String(payload.waiterId),
    })
    .select('id')
    .single()

  if (orderError) throw new Error(orderError.message)

  const orderId: number = (orderRow as { id: number }).id

  // 2. Insert order items
  const itemsInsert = payload.items.map((item) => ({
    order_id: orderId,
    dish_id: item.dishId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    notes: item.notes ?? null,
    created_by: String(payload.waiterId),
  }))
  const { error: itemsError } = await supabase.from('order_item').insert(itemsInsert)
  if (itemsError) throw new Error(itemsError.message)

  // 3. Compute total and update
  const total = payload.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )
  const deliveryFee = payload.delivery?.deliveryFee ?? 0
  await supabase
    .from('order')
    .update({ total_amount: total + deliveryFee })
    .eq('id', orderId)

  // 4. Insert delivery data if needed
  if (payload.delivery) {
    const { error: deliveryError } = await supabase.from('order_delivery').insert({
      order_id: orderId,
      recipient_name: payload.delivery.recipientName,
      phone: payload.delivery.phone ?? null,
      address: payload.delivery.address ?? null,
      reference: payload.delivery.reference ?? null,
      district: payload.delivery.district ?? null,
      delivery_fee: payload.delivery.deliveryFee,
      created_by: String(payload.waiterId),
    })
    if (deliveryError) throw new Error(deliveryError.message)
  }

  return getOrderById(orderId)
}

export const updateOrderStatus = async (
  id: number,
  status: OrderStatus,
  updatedBy: string
): Promise<void> => {
  const { error } = await supabase
    .from('order')
    .update({ status, updated_at: new Date().toISOString(), updated_by: updatedBy })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export const cancelOrder = async (id: number, updatedBy: string): Promise<void> => {
  await updateOrderStatus(id, 'CANCELLED', updatedBy)
}
