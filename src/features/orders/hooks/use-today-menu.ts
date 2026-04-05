import { useQuery } from '@tanstack/react-query'
import { getTodayMenuDishes } from '../data/orders-service'

export const useTodayMenu = (branchId: number | null) =>
  useQuery({
    queryKey: ['orders', 'today-menu', branchId],
    queryFn: () => getTodayMenuDishes(branchId!),
    enabled: !!branchId,
  })
