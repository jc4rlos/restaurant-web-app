import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  type TablesParams,
  createTable,
  deleteTable,
  deleteTables,
  getTables,
  getTableById,
  updateTable,
  getBranches,
} from '../data/tables-service'
import { type Table } from '../data/schema'

export const tablesQueryKeys = {
  list: (params: TablesParams) => ['tables', 'list', params] as const,
  detail: (id: number) => ['tables', id] as const,
  branches: () => ['tables', 'branches'] as const,
}

export const useTables = (params: TablesParams) =>
  useQuery({
    queryKey: tablesQueryKeys.list(params),
    queryFn: () => getTables(params),
    placeholderData: (prev) => prev,
  })

export const useTable = (id: number) =>
  useQuery({
    queryKey: tablesQueryKeys.detail(id),
    queryFn: () => getTableById(id),
    enabled: id > 0,
  })

export const useBranches = () =>
  useQuery({
    queryKey: tablesQueryKeys.branches(),
    queryFn: getBranches,
  })

export const useCreateTable = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Omit<Table, 'id'>) => createTable(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      toast.success('Mesa creada exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear la mesa: ${error.message}`)
    },
  })
}

export const useUpdateTable = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<Omit<Table, 'id'>>
    }) => updateTable(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      queryClient.setQueryData(tablesQueryKeys.detail(updated.id), updated)
      toast.success('Mesa actualizada exitosamente.')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar la mesa: ${error.message}`)
    },
  })
}

export const useDeleteTable = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      toast.success('Mesa eliminada.')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar la mesa: ${error.message}`)
    },
  })
}

export const useDeleteTables = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteTables(ids),
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      toast.success(
        `${ids.length} mesa${ids.length === 1 ? '' : 's'} eliminada${ids.length === 1 ? '' : 's'}.`
      )
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar las mesas: ${error.message}`)
    },
  })
}