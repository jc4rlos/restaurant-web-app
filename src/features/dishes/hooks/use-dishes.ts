import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  type DishesParams,
  createDish,
  deleteDish,
  deleteDishes,
  getDishes,
  updateDish,
} from '../data/dishes-service'
import { type Dish } from '../data/schema'

export const dishesQueryKeys = {
  list: (params: DishesParams) => ['dishes', 'list', params] as const,
}

export const useDishes = (params: DishesParams) =>
  useQuery({
    queryKey: dishesQueryKeys.list(params),
    queryFn: () => getDishes(params),
    placeholderData: (prev) => prev,
  })

export const useCreateDish = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Omit<Dish, 'id'> & { imageFile?: File }) =>
      createDish(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] })
      toast.success('Plato creado exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear el plato: ${error.message}`)
    },
  })
}

export const useUpdateDish = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<Omit<Dish, 'id'>> & { imageFile?: File }
    }) => updateDish(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] })
      toast.success('Plato actualizado exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar el plato: ${error.message}`)
    },
  })
}

export const useDeleteDish = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteDish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] })
      toast.success('Plato eliminado.')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar el plato: ${error.message}`)
    },
  })
}

export const useDeleteDishes = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteDishes(ids),
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] })
      toast.success(
        `${ids.length} plato${ids.length === 1 ? '' : 's'} eliminado${ids.length === 1 ? '' : 's'}.`
      )
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar los platos: ${error.message}`)
    },
  })
}
