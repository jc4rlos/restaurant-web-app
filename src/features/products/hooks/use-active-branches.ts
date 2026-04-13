import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type BranchOption = { id: number; name: string }

export const useActiveBranches = () =>
  useQuery({
    queryKey: ['branches', 'active-all'],
    queryFn: async (): Promise<BranchOption[]> => {
      const { data, error } = await supabase
        .from('branch')
        .select('id, name')
        .eq('is_active', true)
        .is('deleted_at', null)
        .order('name', { ascending: true })
      if (error) throw new Error(error.message)
      return data as BranchOption[]
    },
  })
