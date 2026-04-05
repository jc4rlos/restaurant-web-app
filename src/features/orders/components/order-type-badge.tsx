import { Package, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { type OrderType } from '../data/schema'

const TYPE_CONFIG: Record<OrderType, { label: string; icon: React.ElementType; className: string }> = {
  DINE_IN:  { label: 'Mesa',     icon: UtensilsCrossed, className: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  TAKEAWAY: { label: 'Recoger',  icon: ShoppingBag,     className: 'bg-teal-100 text-teal-800 border-teal-200' },
  DELIVERY: { label: 'Delivery', icon: Package,         className: 'bg-rose-100 text-rose-800 border-rose-200' },
}

type Props = { type: OrderType }

export const OrderTypeBadge = ({ type }: Props) => {
  const { label, icon: Icon, className } = TYPE_CONFIG[type]
  return (
    <Badge variant='outline' className={`gap-1 text-xs font-medium ${className}`}>
      <Icon className='h-3 w-3' />
      {label}
    </Badge>
  )
}
