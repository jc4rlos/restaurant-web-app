import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Textarea } from '@/components/ui/textarea'
import {
  deliveryDetailsSchema,
  dineInDetailsSchema,
  type DeliveryDetailsValues,
  type DineInDetailsValues,
  type OrderDetails,
  type OrderType,
  takeawayDetailsSchema,
  type TakeawayDetailsValues,
} from '../../data/schema'
import { useBranchTables } from '../../hooks/use-branch-tables'

type Props = {
  orderType: OrderType
  branchId: number
  onNext: (details: OrderDetails) => void
  onBack: () => void
  isSubmitting: boolean
}

const DineInForm = ({
  branchId,
  onSubmit,
  onBack,
  isSubmitting,
}: {
  branchId: number
  onSubmit: (v: DineInDetailsValues) => void
  onBack: () => void
  isSubmitting: boolean
}) => {
  const { data: tables = [] } = useBranchTables(branchId)
  const form = useForm<DineInDetailsValues>({
    resolver: zodResolver(dineInDetailsSchema),
  })
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-4'
      >
        <FormField
          control={form.control}
          name='tableId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mesa</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(Number(v))}
                defaultValue={field.value ? String(field.value) : undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecciona una mesa' />
                </SelectTrigger>
                <SelectContent>
                  {tables.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      Mesa {t.number} — cap. {t.capacity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (opcional)</FormLabel>
              <Textarea placeholder='Ej: sin cebolla, sin ají…' {...field} />
            </FormItem>
          )}
        />
        <NavButtons onBack={onBack} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}

const TakeawayForm = ({
  onSubmit,
  onBack,
  isSubmitting,
}: {
  onSubmit: (v: TakeawayDetailsValues) => void
  onBack: () => void
  isSubmitting: boolean
}) => {
  const form = useForm<TakeawayDetailsValues>({
    resolver: zodResolver(takeawayDetailsSchema),
  })
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-4'
      >
        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (opcional)</FormLabel>
              <Textarea placeholder='Ej: sin cebolla, sin ají…' {...field} />
            </FormItem>
          )}
        />
        <NavButtons onBack={onBack} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}

const DeliveryForm = ({
  onSubmit,
  onBack,
  isSubmitting,
}: {
  onSubmit: (v: DeliveryDetailsValues) => void
  onBack: () => void
  isSubmitting: boolean
}) => {
  const form = useForm<DeliveryDetailsValues>({
    resolver: zodResolver(deliveryDetailsSchema),
    defaultValues: { deliveryFee: 0 },
  })
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-3'
      >
        <div className='grid grid-cols-2 gap-3'>
          <FormField
            control={form.control}
            name='recipientName'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel>Nombre del destinatario *</FormLabel>
                <Input placeholder='Juan Pérez' {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <Input placeholder='987654321' {...field} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='district'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distrito</FormLabel>
                <Input placeholder='Miraflores' {...field} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel>Dirección *</FormLabel>
                <Input placeholder='Av. Lima 123' {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='reference'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel>Referencia</FormLabel>
                <Input placeholder='Frente al grifo' {...field} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='deliveryFee'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Costo de envío (S/)</FormLabel>
                <Input
                  type='number'
                  min={0}
                  step={0.5}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (opcional)</FormLabel>
              <Textarea placeholder='Instrucciones adicionales…' {...field} />
            </FormItem>
          )}
        />
        <NavButtons onBack={onBack} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}

const NavButtons = ({
  onBack,
  isSubmitting,
}: {
  onBack: () => void
  isSubmitting: boolean
}) => (
  <div className='flex gap-2 pt-2'>
    <Button variant='outline' className='flex-1' type='button' onClick={onBack}>
      Atrás
    </Button>
    <Button className='flex-1' type='submit' disabled={isSubmitting}>
      {isSubmitting ? 'Guardando…' : 'Confirmar pedido'}
    </Button>
  </div>
)

export const StepDetails = ({
  orderType,
  branchId,
  onNext,
  onBack,
  isSubmitting,
}: Props) => {
  if (orderType === 'DINE_IN') {
    return (
      <DineInForm
        branchId={branchId}
        isSubmitting={isSubmitting}
        onBack={onBack}
        onSubmit={(v) => onNext({ type: 'DINE_IN', ...v })}
      />
    )
  }

  if (orderType === 'TAKEAWAY') {
    return (
      <TakeawayForm
        isSubmitting={isSubmitting}
        onBack={onBack}
        onSubmit={(v) => onNext({ type: 'TAKEAWAY', ...v })}
      />
    )
  }

  return (
    <DeliveryForm
      isSubmitting={isSubmitting}
      onBack={onBack}
      onSubmit={(v) =>
        onNext({ type: 'DELIVERY', delivery: v, notes: v.notes })
      }
    />
  )
}
