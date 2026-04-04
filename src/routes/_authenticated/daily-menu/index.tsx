import { createFileRoute } from '@tanstack/react-router'
import { DailyMenu } from '@/features/daily-menu'

export const Route = createFileRoute('/_authenticated/daily-menu/')({
  component: DailyMenu,
})
