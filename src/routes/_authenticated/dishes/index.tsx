import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Dishes } from '@/features/dishes'

const dishesSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  name: z.string().optional().catch(''),
  isActive: z.array(z.string()).optional().catch([]),
})

export const Route = createFileRoute('/_authenticated/dishes/')({
  validateSearch: dishesSearchSchema,
  component: Dishes,
})
