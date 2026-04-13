import { z } from 'zod'

export const productSchema = z.object({
  id: z.number(),
  branchId: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  stock: z.number(),
  unitOfMeasure: z.string(),
})

export type Product = z.infer<typeof productSchema>

export const productFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  description: z.string().optional(),
  stock: z.number().min(0, 'El stock no puede ser negativo.'),
  unitOfMeasure: z.string().min(1, 'La unidad de medida es requerida.'),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

export const UNIT_OPTIONS = [
  { label: 'Kilogramos (kg)', value: 'kg' },
  { label: 'Gramos (g)', value: 'g' },
  { label: 'Litros (l)', value: 'l' },
  { label: 'Mililitros (ml)', value: 'ml' },
  { label: 'Piezas', value: 'piezas' },
  { label: 'Unidades', value: 'unidades' },
  { label: 'Docenas', value: 'docenas' },
  { label: 'Bolsas', value: 'bolsas' },
]
