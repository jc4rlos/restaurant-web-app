import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { type DateRange as DayPickerRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { menuCreateFormSchema, type MenuCreateFormValues } from '../data/schema'
import { useActiveBranches } from '../hooks/use-active-branches'
import { useDailyMenuContext, type DateRange } from './daily-menu-provider'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const MenuCreateDialog = ({ open, onOpenChange }: Props) => {
  const { openDetail } = useDailyMenuContext()
  const { data: branches = [] } = useActiveBranches()
  const [calendarRange, setCalendarRange] = useState<DayPickerRange | undefined>()

  const form = useForm<MenuCreateFormValues>({
    resolver: zodResolver(menuCreateFormSchema),
  })

  const onSubmit = (values: MenuCreateFormValues) => {
    const from = format(values.dateRange.from, 'yyyy-MM-dd')
    const to = values.dateRange.to
      ? format(values.dateRange.to, 'yyyy-MM-dd')
      : from

    const range: DateRange = { from, to }
    openDetail(values.branchId, from, range)
    form.reset()
    setCalendarRange(undefined)
    onOpenChange(false)
  }

  const handleClose = () => {
    form.reset()
    setCalendarRange(undefined)
    onOpenChange(false)
  }

  const dateRange = form.watch('dateRange')
  const dateLabel = dateRange?.from
    ? dateRange.to && dateRange.to !== dateRange.from
      ? `${format(dateRange.from, "dd MMM", { locale: es })} — ${format(dateRange.to, "dd MMM yyyy", { locale: es })}`
      : format(dateRange.from, "dd 'de' MMMM 'de' yyyy", { locale: es })
    : 'Selecciona una fecha o rango'

  return (
    <Dialog open={open} onOpenChange={(s) => { if (!s) handleClose() }}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>Nuevo Menú</DialogTitle>
          <DialogDescription>
            Selecciona la sucursal y la fecha (o rango de fechas) para programar el menú.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='menu-create-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='branchId'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Sucursal</FormLabel>
                  <div className='col-span-4'>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      defaultValue={field.value ? String(field.value) : undefined}
                    >
                      <SelectTrigger className='w-full'>
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
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='dateRange'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Fecha</FormLabel>
                  <div className='col-span-4'>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className='me-2 h-4 w-4' />
                          {dateLabel}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='range'
                          selected={calendarRange}
                          onSelect={(range) => {
                            setCalendarRange(range)
                            if (range?.from) {
                              field.onChange({
                                from: range.from,
                                to: range.to,
                              })
                            }
                          }}
                          numberOfMonths={1}
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose}>
            Cancelar
          </Button>
          <Button type='submit' form='menu-create-form'>
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
