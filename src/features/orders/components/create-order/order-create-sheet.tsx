import { useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  type CartItem,
  type OrderDetails,
  type TypeStepValues,
} from '../../data/schema'
import { useCreateOrder } from '../../hooks/use-orders'
import { StepDetails } from './step-details'
import { StepDishes } from './step-dishes'
import { StepType } from './step-type'

type Step = 'type' | 'dishes' | 'details'

const STEP_LABELS: Record<Step, string> = {
  type: 'Tipo de pedido',
  dishes: 'Seleccionar platos',
  details: 'Datos del pedido',
}

const STEP_NUMBERS: Step[] = ['type', 'dishes', 'details']

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const OrderCreateSheet = ({ open, onOpenChange }: Props) => {
  const [step, setStep] = useState<Step>('type')
  const [typeValues, setTypeValues] = useState<TypeStepValues | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])

  const { auth } = useAuthStore()
  const { mutateAsync: createOrder, isPending } = useCreateOrder()

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setStep('type')
      setTypeValues(null)
      setCart([])
    }, 300)
  }

  const handleTypeNext = (values: TypeStepValues) => {
    setTypeValues(values)
    setStep('dishes')
  }

  const handleDetailsNext = async (details: OrderDetails) => {
    if (!typeValues) return

    const waiterId = auth.user?.employeeId ?? 3
    const payload = buildPayload(typeValues, cart, details, waiterId)

    try {
      await createOrder(payload)
      handleClose()
    } catch {
      // Error toast is handled in the hook
    }
  }

  const currentStepIndex = STEP_NUMBERS.indexOf(step)

  return (
    <Sheet
      open={open}
      onOpenChange={(s) => {
        if (!s) handleClose()
      }}
    >
      <SheetContent
        side='right'
        className='flex w-full flex-col gap-0 p-0 sm:max-w-lg'
      >
        <SheetHeader className='border-b px-4 py-3'>
          <SheetTitle>{STEP_LABELS[step]}</SheetTitle>
          {/* Step indicator */}
          <div className='flex gap-1.5 pt-1'>
            {STEP_NUMBERS.map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= currentStepIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto px-4 py-4'>
          {step === 'type' && (
            <StepType
              defaultValues={typeValues ?? undefined}
              onNext={handleTypeNext}
            />
          )}

          {step === 'dishes' && typeValues && (
            <StepDishes
              branchId={typeValues.branchId}
              cart={cart}
              onCartChange={setCart}
              onNext={() => setStep('details')}
              onBack={() => setStep('type')}
            />
          )}

          {step === 'details' && typeValues && (
            <StepDetails
              orderType={typeValues.orderType}
              branchId={typeValues.branchId}
              onNext={handleDetailsNext}
              onBack={() => setStep('dishes')}
              isSubmitting={isPending}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function buildPayload(
  typeValues: TypeStepValues,
  cart: CartItem[],
  details: OrderDetails,
  waiterId: number
) {
  const base = {
    branchId: typeValues.branchId,
    waiterId,
    orderType: typeValues.orderType,
    customerName: typeValues.customerName,
    customerPhone: typeValues.customerPhone,
    items: cart.map((i) => ({
      dishId: i.dishId,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      notes: i.notes || undefined,
    })),
  }

  if (details.type === 'DINE_IN') {
    return { ...base, tableId: details.tableId, notes: details.notes }
  }

  if (details.type === 'TAKEAWAY') {
    return { ...base, notes: details.notes }
  }

  // DELIVERY
  return {
    ...base,
    notes: details.notes,
    delivery: {
      recipientName: details.delivery.recipientName,
      phone: details.delivery.phone,
      address: details.delivery.address,
      reference: details.delivery.reference,
      district: details.delivery.district,
      deliveryFee: details.delivery.deliveryFee,
    },
  }
}
