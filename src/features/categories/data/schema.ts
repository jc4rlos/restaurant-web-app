import { z } from 'zod'

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
})

export type Category = z.infer<typeof categorySchema>

export const categoryFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  description: z.string().optional(),
  isActive: z.boolean(),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
