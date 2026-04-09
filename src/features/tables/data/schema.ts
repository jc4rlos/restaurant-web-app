import { z } from 'zod'

export const tableSchema = z.object({
  id: z.number(),
  branchId: z.number(),
  number: z.string(),
  capacity: z.number(),
  isActive: z.boolean(),
})

export type Table = z.infer<typeof tableSchema>

export const tableFormSchema = z.object({
  branchId: z.number({ error: 'La sucursal es requerida.' }),
  number: z.string().min(1, 'El número de mesa es requerido.'),
  capacity: z.number().min(1, 'La capacidad debe ser al menos 1.'),
  isActive: z.boolean(),
})

export type TableFormValues = z.infer<typeof tableFormSchema>