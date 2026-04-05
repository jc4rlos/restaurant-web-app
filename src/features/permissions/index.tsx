import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getAllMenuItemsWithPermissions, upsertRolePermission } from './data/menu-service'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const ROLES: { value: string; label: string }[] = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MANAGER', label: 'Gerente' },
  { value: 'WAITER', label: 'Mesero' },
  { value: 'CASHIER', label: 'Cajero' },
  { value: 'COOK', label: 'Cocina' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
]

export default function PermissionsPage() {
  const queryClient = useQueryClient()
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['menu-items-permissions'],
    queryFn: getAllMenuItemsWithPermissions,
  })

  const { mutate: toggle } = useMutation({
    mutationFn: ({ menuItemId, role, enabled }: { menuItemId: number; role: string; enabled: boolean }) =>
      upsertRolePermission(menuItemId, role, enabled),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menu-items-permissions'] }),
    onError: () => toast.error('Error al actualizar el permiso.'),
  })

  if (isLoading) return <div className='p-6 text-sm text-muted-foreground'>Cargando...</div>

  return (
    <div className='p-6 space-y-4'>
      <h1 className='text-xl font-semibold'>Permisos de Menú</h1>
      <div className='rounded-md border overflow-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='min-w-50'>Ítem</TableHead>
              <TableHead className='min-w-25'>Ruta</TableHead>
              {ROLES.map((role) => (
                <TableHead key={role.value} className='text-center'>
                  {role.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>{item.label}</TableCell>
                <TableCell className='text-muted-foreground text-sm'>{item.path}</TableCell>
                {ROLES.map((role) => {
                  const perm = item.permissions.find((p) => p.role === role.value)
                  const enabled = perm?.enabled ?? false
                  return (
                    <TableCell key={role.value} className='text-center'>
                      <Checkbox
                        checked={enabled}
                        onCheckedChange={(checked) =>
                          toggle({ menuItemId: item.id, role: role.value, enabled: !!checked })
                        }
                      />
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
