import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Otp } from '@/features/auth/otp'

const searchSchema = z.object({
  email: z.email().catch(''),
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/otp')({
  validateSearch: searchSchema,
  beforeLoad: ({ search }) => {
    if (!search.email) throw redirect({ to: '/sign-in' })
  },
  component: Otp,
})
