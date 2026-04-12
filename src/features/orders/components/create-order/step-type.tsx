import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Package, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useActiveBranches } from '@/features/daily-menu/hooks/use-active-branches'
import { type OrderType, typeStepSchema, type TypeStepValues } from '../../data/schema'

const ORDER_TYPE_OPTIONS: {
  value: OrderType
  label: string
  description: string
  icon: React.ElementType
}[] = [
  { value: 'DINE_IN',  label: 'Mesa',     description: 'Consumo en el local',        icon: UtensilsCrossed },
  { value: 'TAKEAWAY', label: 'Recoger',  description: 'El cliente recoge en caja',  icon: ShoppingBag },
  { value: 'DELIVERY', label: 'Delivery', description: 'Envío a domicilio',           icon: Package },
]

type Props = {
  defaultValues?: TypeStepValues
  onNext: (values: TypeStepValues) => void
}

export const StepType = ({ defaultValues, onNext }: Props) => {
  const { data: branches = [] } = useActiveBranches()

  const form = useForm<TypeStepValues>({
    resolver: zodResolver(typeStepSchema),
    defaultValues: defaultValues ?? { orderType: 'DINE_IN' },
  })

  const orderType = form.watch('orderType')

  return (
    <Form {...form}>
      <form
        id='step-type-form'
        onSubmit={form.handleSubmit(onNext)}
        className='flex flex-col gap-5'
      >
        {/* Branch */}
        <FormField
          control={form.control}
          name='branchId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sucursal</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(Number(v))}
                defaultValue={field.value ? String(field.value) : undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecciona una sucursal' />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Order type selector */}
        <FormField
          control={form.control}
          name='orderType'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de pedido</FormLabel>
              <div className='grid grid-cols-3 gap-2'>
                {ORDER_TYPE_OPTIONS.map(({ value, label, description, icon: Icon }) => (
                  <button
                    key={value}
                    type='button'
                    onClick={() => field.onChange(value)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-center transition-all',
                      field.value === value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-muted-foreground/30 hover:bg-muted/30'
                    )}
                  >
                    <Icon className='h-6 w-6' />
                    <span className='text-xs font-semibold'>{label}</span>
                    <span className='text-[10px] text-muted-foreground leading-tight'>
                      {description}
                    </span>
                  </button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' form='step-type-form' className='w-full'>
          Continuar
        </Button>
      </form>
    </Form>
  )
}