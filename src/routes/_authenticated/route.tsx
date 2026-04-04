import { createFileRoute, redirect } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth-store'
import { getEmployeeByUserId } from '@/features/auth/auth-service'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const { auth } = useAuthStore.getState()

    const isStoreValid =
      auth.accessToken && auth.user && auth.user.exp > Date.now()
    if (isStoreValid) return

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) throw redirect({ to: '/sign-in' })

    try {
      const employee = await getEmployeeByUserId(session.user.id)
      auth.setUser({
        employeeId: employee.id,
        email: session.user.email ?? '',
        role: employee.role,
        exp: (session.expires_at ?? 0) * 1000,
      })
      auth.setAccessToken(session.access_token)
    } catch {
      throw redirect({ to: '/sign-in' })
    }
  },
  component: AuthenticatedLayout,
})