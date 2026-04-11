import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type OrderStatus, type OrderType } from '../data/schema'

type Props = {
  statusFilter: OrderStatus | 'ALL'
  typeFilter: OrderType | 'ALL'
  dateFilter: string
  onStatusChange: (v: OrderStatus | 'ALL') => void
  onTypeChange: (v: OrderType | 'ALL') => void
  onDateChange: (v: string) => void
}

export const OrdersFilters = ({
  statusFilter,
  typeFilter,
  dateFilter,
  onStatusChange,
  onTypeChange,
  onDateChange,
}: Props) => (
  <div className='flex flex-wrap gap-2'>
    <Select
      value={statusFilter}
      onValueChange={(v) => onStatusChange(v as OrderStatus | 'ALL')}
    >
      <SelectTrigger className='h-8 w-[140px] text-xs'>
        <SelectValue placeholder='Estado' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='ALL'>Todos los estados</SelectItem>
        <SelectItem value='PENDING'>Pendiente</SelectItem>
        <SelectItem value='CONFIRMED'>Confirmado</SelectItem>
        <SelectItem value='PREPARING'>En cocina</SelectItem>
        <SelectItem value='READY'>Listo</SelectItem>
        <SelectItem value='ON_THE_WAY'>En camino</SelectItem>
        <SelectItem value='DELIVERED'>Entregado</SelectItem>
        <SelectItem value='CANCELLED'>Cancelado</SelectItem>
      </SelectContent>
    </Select>

    <Select
      value={typeFilter}
      onValueChange={(v) => onTypeChange(v as OrderType | 'ALL')}
    >
      <SelectTrigger className='h-8 w-[130px] text-xs'>
        <SelectValue placeholder='Tipo' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='ALL'>Todos los tipos</SelectItem>
        <SelectItem value='DINE_IN'>Mesa</SelectItem>
        <SelectItem value='TAKEAWAY'>Recoger</SelectItem>
        <SelectItem value='DELIVERY'>Delivery</SelectItem>
      </SelectContent>
    </Select>

    <input
      type='date'
      value={dateFilter}
      onChange={(e) => onDateChange(e.target.value)}
      className='h-8 rounded-md border border-input bg-background px-3 text-sm'
    />
  </div>
)
