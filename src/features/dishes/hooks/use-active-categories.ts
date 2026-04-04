import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type CategoryOption = { id: number; name: string }

export const useActiveCategories = () =>
  useQuery({
    queryKey: ['categories', 'active-all'],
    queryFn: async (): Promise<CategoryOption[]> => {
      const { data, error } = await supabase
        .from('category')
        .select('id, name')
        .eq('is_active', true)
        .is('deleted_at', null)
        .order('name', { ascending: true })
      if (error) throw new Error(error.message)
      return data as CategoryOption[]
    },
  })
