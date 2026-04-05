import { type OrderStatus, type OrderType } from '../../data/schema'

export type StatusOption = {
  status: OrderStatus
  label: string
  isDestructive: boolean
}

const STATUS_RANK: Partial<Record<OrderStatus, number>> = {
  PENDING:    0,
  CONFIRMED:  1,
  PREPARING:  2,
  READY:      3,
  ON_THE_WAY: 3,
  DELIVERED:  4,
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING:    'Pendiente',
  CONFIRMED:  'Confirmado',
  PREPARING:  'En cocina',
  READY:      'Listo para entregar',
  ON_THE_WAY: 'En camino',
  DELIVERED:  'Entregado',
  CANCELLED:  'Cancelado',
}

export const getAvailableStatuses = (
  current: OrderStatus,
  orderType: OrderType
): StatusOption[] => {
  if (current === 'DELIVERED' || current === 'CANCELLED') return []

  const currentRank = STATUS_RANK[current] ?? 0

  const forwardCandidates: OrderStatus[] =
    orderType === 'DELIVERY'
      ? ['CONFIRMED', 'PREPARING', 'ON_THE_WAY', 'DELIVERED']
      : ['CONFIRMED', 'PREPARING', 'READY', 'DELIVERED']

  const forward = forwardCandidates
    .filter((s) => (STATUS_RANK[s] ?? 0) > currentRank)
    .map((s) => ({ status: s, label: STATUS_LABELS[s], isDestructive: false }))

  return [
    ...forward,
    { status: 'CANCELLED', label: STATUS_LABELS.CANCELLED, isDestructive: true },
  ]
}

export { STATUS_LABELS }
