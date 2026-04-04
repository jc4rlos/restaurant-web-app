import { z } from 'zod'

export const dishSchema = z.object({
  id: z.number(),
  categoryId: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  basePrice: z.number(),
  imageUrl: z.string().nullable(),
  isActive: z.boolean(),
})

export type Dish = z.infer<typeof dishSchema>

export const dishFormSchema = z.object({
  categoryId: z.number({ error: 'La categoría es requerida.' }),
  name: z.string().min(1, 'El nombre es requerido.'),
  description: z.string().optional(),
  basePrice: z.number({ error: 'Ingresa un precio válido.' }).min(0, 'El precio debe ser mayor o igual a 0.'),
  imageFile: z.instanceof(File).optional(),
  isActive: z.boolean(),
})

export type DishFormValues = z.infer<typeof dishFormSchema>
