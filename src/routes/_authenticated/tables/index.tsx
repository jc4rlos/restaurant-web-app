import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Tables } from '@/features/tables'

const tablesSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  number: z.string().optional().catch(''),
  isActive: z.array(z.string()).optional().catch([]),
})

export const Route = createFileRoute('/_authenticated/tables/')({
  validateSearch: tablesSearchSchema,
  component: Tables,
})