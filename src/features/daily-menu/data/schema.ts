import { z } from 'zod'

export const menuDateSummarySchema = z.object({
  date: z.string(),
  branchId: z.number(),
  branchName: z.string(),
  dishCount: z.number(),
})

export type MenuDateSummary = z.infer<typeof menuDateSummarySchema>

export const dailyMenuItemSchema = z.object({
  id: z.number(),
  menuDate: z.string(),
  branchId: z.number(),
  dishId: z.number(),
  dishName: z.string(),
  dishImageUrl: z.string().nullable(),
  price: z.number(),
  stock: z.number(),
  isActive: z.boolean(),
})

export type DailyMenuItem = z.infer<typeof dailyMenuItemSchema>

export const menuCreateFormSchema = z.object({
  branchId: z.number({ error: 'La sucursal es requerida.' }),
  dateRange: z.object({
    from: z.date({ error: 'La fecha de inicio es requerida.' }),
    to: z.date().optional(),
  }),
})

export type MenuCreateFormValues = z.infer<typeof menuCreateFormSchema>

export const menuAddDishFormSchema = z.object({
  dishId: z.number({ error: 'El plato es requerido.' }),
  price: z.number({ error: 'Ingresa un precio válido.' }).min(0, 'El precio debe ser mayor o igual a 0.'),
  stock: z.number({ error: 'Ingresa un stock válido.' }).int().min(0, 'El stock debe ser mayor o igual a 0.'),
})

export type MenuAddDishFormValues = z.infer<typeof menuAddDishFormSchema>

export const menuItemEditFormSchema = z.object({
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0.'),
  stock: z.number().int().min(0, 'El stock debe ser mayor o igual a 0.'),
  isActive: z.boolean(),
})

export type MenuItemEditFormValues = z.infer<typeof menuItemEditFormSchema>
