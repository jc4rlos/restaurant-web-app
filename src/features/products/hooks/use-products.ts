import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  type ProductsParams,
  createProduct,
  deleteProducts,
  deleteProduct,
  getProducts,
  getProductById,
  updateProduct,
} from '../data/products-service'
import { type Product } from '../data/schema'

export const productsQueryKeys = {
  list: (params: ProductsParams) => ['products', 'list', params] as const,
  detail: (id: number) => ['products', id] as const,
}

export const useProducts = (params: ProductsParams) =>
  useQuery({
    queryKey: productsQueryKeys.list(params),
    queryFn: () => getProducts(params),
    placeholderData: (prev) => prev,
    enabled: !!params.branchId && params.branchId > 0,
  })

export const useProduct = (id: number) =>
  useQuery({
    queryKey: productsQueryKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: id > 0,
  })

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      branchId,
      data,
    }: {
      branchId: number
      data: Pick<Product, 'name' | 'description' | 'stock' | 'unitOfMeasure'>
    }) => createProduct(branchId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Producto creado exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear el producto: ${error.message}`)
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<
        Pick<Product, 'name' | 'description' | 'stock' | 'unitOfMeasure'>
      >
    }) => updateProduct(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.setQueryData(productsQueryKeys.detail(updated.id), updated)
      toast.success('Producto actualizado exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar el producto: ${error.message}`)
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Producto eliminado.')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar el producto: ${error.message}`)
    },
  })
}

export const useDeleteProducts = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteProducts(ids),
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(
        `${ids.length} producto${ids.length === 1 ? '' : 's'} eliminado${ids.length === 1 ? '' : 's'}.`
      )
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar los productos: ${error.message}`)
    },
  })
}
