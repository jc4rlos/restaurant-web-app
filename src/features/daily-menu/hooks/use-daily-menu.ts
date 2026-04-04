import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  addDishToMenu,
  getMenuItems,
  getMenuSummaries,
  removeMenuByDate,
  removeMenuItem,
  updateMenuItem,
} from '../data/daily-menu-service'
import { type DailyMenuItem } from '../data/schema'

export const dailyMenuQueryKeys = {
  summaries: () => ['daily-menu', 'summaries'] as const,
  items: (branchId: number, date: string) =>
    ['daily-menu', 'items', branchId, date] as const,
}

export const useMenuSummaries = () =>
  useQuery({
    queryKey: dailyMenuQueryKeys.summaries(),
    queryFn: getMenuSummaries,
  })

export const useMenuItems = (branchId: number | null, date: string | null) =>
  useQuery({
    queryKey: dailyMenuQueryKeys.items(branchId ?? 0, date ?? ''),
    queryFn: () => getMenuItems(branchId!, date!),
    enabled: !!branchId && !!date,
  })

type AddDishPayload = {
  branchId: number
  dishId: number
  dates: string[]
  price: number
  stock: number
}

export const useAddDishToMenu = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ branchId, dishId, dates, price, stock }: AddDishPayload) =>
      addDishToMenu(
        dates.map((menuDate) => ({ branchId, dishId, menuDate, price, stock }))
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-menu'] })
      toast.success('Plato agregado al menú.')
    },
    onError: (error: Error) => {
      toast.error(`Error al agregar el plato: ${error.message}`)
    },
  })
}

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<Pick<DailyMenuItem, 'price' | 'stock' | 'isActive'>>
    }) => updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-menu'] })
      toast.success('Plato actualizado.')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar: ${error.message}`)
    },
  })
}

export const useRemoveMenuItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => removeMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-menu'] })
      toast.success('Plato eliminado del menú.')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar: ${error.message}`)
    },
  })
}

export const useRemoveMenuByDate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ branchId, date }: { branchId: number; date: string }) =>
      removeMenuByDate(branchId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-menu'] })
      toast.success('Menú eliminado.')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar el menú: ${error.message}`)
    },
  })
}
