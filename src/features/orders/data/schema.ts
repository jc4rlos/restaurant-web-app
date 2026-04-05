import { z } from 'zod'

export const ORDER_TYPES = ['DINE_IN', 'TAKEAWAY', 'DELIVERY'] as const
export const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'ON_THE_WAY',
  'DELIVERED',
  'CANCELLED',
] as const

export type OrderType = (typeof ORDER_TYPES)[number]
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const orderItemSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  dishId: z.number(),
  dishName: z.string(),
  dishImageUrl: z.string().nullable(),
  quantity: z.number(),
  unitPrice: z.number(),
  subtotal: z.number(),
  notes: z.string().nullable(),
})
export type OrderItem = z.infer<typeof orderItemSchema>

export const orderDeliverySchema = z.object({
  id: z.number(),
  recipientName: z.string(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  reference: z.string().nullable(),
  district: z.string().nullable(),
  deliveryFee: z.number(),
  estimatedAt: z.string().nullable(),
  deliveredAt: z.string().nullable(),
})
export type OrderDelivery = z.infer<typeof orderDeliverySchema>

export const orderSchema = z.object({
  id: z.number(),
  branchId: z.number(),
  branchName: z.string(),
  waiterId: z.number(),
  tableId: z.number().nullable(),
  tableNumber: z.string().nullable(),
  orderType: z.enum(ORDER_TYPES),
  status: z.enum(ORDER_STATUSES),
  customerName: z.string().nullable(),
  customerPhone: z.string().nullable(),
  notes: z.string().nullable(),
  totalAmount: z.number(),
  orderedAt: z.string(),
  items: z.array(orderItemSchema),
  delivery: orderDeliverySchema.nullable(),
})
export type Order = z.infer<typeof orderSchema>

// Cart item for the creation flow
export const cartItemSchema = z.object({
  dishId: z.number(),
  menuItemId: z.number(),
  dishName: z.string(),
  dishImageUrl: z.string().nullable(),
  unitPrice: z.number(),
  quantity: z.number().min(1),
  notes: z.string(),
})
export type CartItem = z.infer<typeof cartItemSchema>

// Menu dish from today's daily menu
export const menuDishSchema = z.object({
  menuItemId: z.number(),
  dishId: z.number(),
  dishName: z.string(),
  dishImageUrl: z.string().nullable(),
  price: z.number(),
  stock: z.number(),
})
export type MenuDish = z.infer<typeof menuDishSchema>

// Table option for DINE_IN
export const tableOptionSchema = z.object({
  id: z.number(),
  number: z.string(),
  capacity: z.number(),
})
export type TableOption = z.infer<typeof tableOptionSchema>

// ─── Form schemas per step ─────────────────────────────────────────────────

export const typeStepSchema = z.object({
  orderType: z.enum(ORDER_TYPES),
  branchId: z.number({ error: 'Selecciona una sucursal.' }),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
})
export type TypeStepValues = z.infer<typeof typeStepSchema>

export const dineInDetailsSchema = z.object({
  tableId: z.number({ error: 'Selecciona una mesa.' }),
  notes: z.string().optional(),
})
export type DineInDetailsValues = z.infer<typeof dineInDetailsSchema>

export const takeawayDetailsSchema = z.object({
  notes: z.string().optional(),
})
export type TakeawayDetailsValues = z.infer<typeof takeawayDetailsSchema>

export const deliveryDetailsSchema = z.object({
  recipientName: z.string().min(1, 'El nombre del destinatario es requerido.'),
  phone: z.string().optional(),
  address: z.string().min(1, 'La dirección es requerida.'),
  reference: z.string().optional(),
  district: z.string().optional(),
  deliveryFee: z.number().min(0),
  notes: z.string().optional(),
})
export type DeliveryDetailsValues = z.infer<typeof deliveryDetailsSchema>

// Assembled details output from DetailsStep
export type OrderDetails =
  | { type: 'DINE_IN'; tableId: number; notes?: string }
  | { type: 'TAKEAWAY'; notes?: string }
  | { type: 'DELIVERY'; delivery: DeliveryDetailsValues; notes?: string }

// Full create payload sent to the service
export type CreateOrderPayload = {
  branchId: number
  waiterId: number
  orderType: OrderType
  tableId?: number
  customerName?: string
  customerPhone?: string
  notes?: string
  items: { dishId: number; quantity: number; unitPrice: number; notes?: string }[]
  delivery?: {
    recipientName: string
    phone?: string
    address?: string
    reference?: string
    district?: string
    deliveryFee: number
  }
}
