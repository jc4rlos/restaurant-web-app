import { supabase } from '@/lib/supabase'

export type AuthEmployee = {
  id: number
  role: string
  firstName: string
  lastName: string
}

export const sendOtp = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  })
  if (error) throw new Error(error.message)
}

export const verifyOtp = async (email: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })
  if (error) throw new Error(error.message)
  if (!data.session) throw new Error('No se pudo iniciar sesión.')
  return data.session
}

export const getEmployeeByUserId = async (
  userId: string
): Promise<AuthEmployee> => {
  const { data, error } = await supabase
    .from('employee')
    .select('id, role, first_name, last_name')
    .eq('auth_user_id', userId)
    .is('deleted_at', null)
    .maybeSingle()

  if (error) throw new Error(`Error al obtener empleado: ${error.message}`)
  if (!data)
    throw new Error(
      'Este usuario no tiene un empleado asociado. Verifica que el campo user_id esté configurado correctamente.'
    )

  return {
    id: data.id,
    role: data.role,
    firstName: data.first_name,
    lastName: data.last_name,
  }
}

export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut()
}
