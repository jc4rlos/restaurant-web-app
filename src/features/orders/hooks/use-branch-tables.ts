import { useQuery } from '@tanstack/react-query'
import { getTablesByBranch } from '../data/orders-service'

export const useBranchTables = (branchId: number | null) =>
  useQuery({
    queryKey: ['orders', 'tables', branchId],
    queryFn: () => getTablesByBranch(branchId!),
    enabled: !!branchId,
  })
