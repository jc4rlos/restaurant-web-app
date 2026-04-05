import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import {
  cancelOrder,
  createOrder,
  getOrders,
  type GetOrdersFilter,
  updateOrderStatus,
} from '../data/orders-service'
import { type CreateOrderPayload, type OrderStatus } from '../data/schema'

export const ordersQueryKeys = {
  all: (filter: GetOrdersFilter) => ['orders', filter] as const,
}

export const useOrders = (filter: GetOrdersFilter = {}) =>
  useQuery({
    queryKey: ordersQueryKeys.all(filter),
    queryFn: () => getOrders(filter),
    refetchInterval: 30_000, // poll every 30s for live updates
  })

export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Pedido creado correctamente.')
    },
    onError: (err: Error) => {
      toast.error(`Error al crear el pedido: ${err.message}`)
    },
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  const { auth } = useAuthStore()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      updateOrderStatus(id, status, auth.user?.email ?? 'system'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Estado del pedido actualizado.')
    },
    onError: (err: Error) => {
      toast.error(`Error al actualizar estado: ${err.message}`)
    },
  })
}

export const useCancelOrder = () => {
  const queryClient = useQueryClient()
  const { auth } = useAuthStore()
  return useMutation({
    mutationFn: (id: number) =>
      cancelOrder(id, auth.user?.email ?? 'system'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Pedido cancelado.')
    },
    onError: (err: Error) => {
      toast.error(`Error al cancelar: ${err.message}`)
    },
  })
}
