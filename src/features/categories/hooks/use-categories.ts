import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  type CategoriesParams,
  createCategory,
  deleteCategories,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../data/categories-service'
import { type Category } from '../data/schema'

export const categoriesQueryKeys = {
  list: (params: CategoriesParams) => ['categories', 'list', params] as const,
  detail: (id: number) => ['categories', id] as const,
}

export const useCategories = (params: CategoriesParams) =>
  useQuery({
    queryKey: categoriesQueryKeys.list(params),
    queryFn: () => getCategories(params),
    placeholderData: (prev) => prev,
  })

export const useCategory = (id: number) =>
  useQuery({
    queryKey: categoriesQueryKeys.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: id > 0,
  })

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (
      payload: Pick<Category, 'name' | 'description' | 'isActive'>
    ) => createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Categoría creada exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear la categoría: ${error.message}`)
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<Pick<Category, 'name' | 'description' | 'isActive'>>
    }) => updateCategory(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.setQueryData(categoriesQueryKeys.detail(updated.id), updated)
      toast.success('Categoría actualizada exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar la categoría: ${error.message}`)
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Categoría eliminada.')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar la categoría: ${error.message}`)
    },
  })
}

export const useDeleteCategories = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteCategories(ids),
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success(
        `${ids.length} categor${ids.length === 1 ? 'ía' : 'ías'} eliminada${ids.length === 1 ? '' : 's'}.`
      )
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar las categorías: ${error.message}`)
    },
  })
}
