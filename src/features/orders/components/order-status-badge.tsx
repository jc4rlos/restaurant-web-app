import { Badge } from '@/components/ui/badge'
import { type OrderStatus } from '../data/schema'

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  PENDING:   { label: 'Pendiente',   variant: 'secondary' },
  CONFIRMED: { label: 'Confirmado',  variant: 'outline' },
  PREPARING: { label: 'En cocina',   variant: 'default' },
  READY:     { label: 'Listo',       variant: 'default' },
  ON_THE_WAY:{ label: 'En camino',   variant: 'default' },
  DELIVERED: { label: 'Entregado',   variant: 'outline' },
  CANCELLED: { label: 'Cancelado',   variant: 'destructive' },
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING:    'bg-yellow-100 text-yellow-800 border-yellow-200',
  CONFIRMED:  'bg-blue-100 text-blue-800 border-blue-200',
  PREPARING:  'bg-orange-100 text-orange-800 border-orange-200',
  READY:      'bg-green-100 text-green-800 border-green-200',
  ON_THE_WAY: 'bg-purple-100 text-purple-800 border-purple-200',
  DELIVERED:  'bg-gray-100 text-gray-600 border-gray-200',
  CANCELLED:  'bg-red-100 text-red-700 border-red-200',
}

type Props = { status: OrderStatus }

export const OrderStatusBadge = ({ status }: Props) => {
  const config = STATUS_CONFIG[status]
  return (
    <Badge
      variant={config.variant}
      className={`text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {config.label}
    </Badge>
  )
}
