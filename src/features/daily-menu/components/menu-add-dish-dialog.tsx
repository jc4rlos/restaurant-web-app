import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eachDayOfInterval, format, parseISO } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
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
  FormControl,
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
import { menuAddDishFormSchema, type MenuAddDishFormValues } from '../data/schema'
import { useAddDishToMenu, useMenuItems } from '../hooks/use-daily-menu'
import { useDailyMenuContext } from './daily-menu-provider'
import { formatMenuDateRange } from './menu-date-label'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type DishOption = { id: number; name: string; basePrice: number }

const useAvailableDishes = (
  branchId: number | null,
  date: string | null
) => {
  const { data: menuItems = [] } = useMenuItems(branchId, date)
  const usedDishIds = new Set(menuItems.map((i) => i.dishId))

  return useQuery({
    queryKey: ['dishes', 'active-for-menu', branchId, date, [...usedDishIds]],
    queryFn: async (): Promise<DishOption[]> => {
      const { data, error } = await supabase
        .from('dish')
        .select('id, name, base_price')
        .eq('is_active', true)
        .is('deleted_at', null)
        .order('name', { ascending: true })
      if (error) throw new Error(error.message)
      return (data as { id: number; name: string; base_price: number }[])
        .filter((d) => !usedDishIds.has(d.id))
        .map((d) => ({ id: d.id, name: d.name, basePrice: d.base_price }))
    },
    enabled: !!branchId && !!date,
  })
}

export const MenuAddDishDialog = ({ open, onOpenChange }: Props) => {
  const { selectedBranchId, selectedDate, activeDateRange } =
    useDailyMenuContext()
  const addMutation = useAddDishToMenu()
  const { data: dishes = [] } = useAvailableDishes(
    selectedBranchId,
    selectedDate
  )

  const form = useForm<MenuAddDishFormValues>({
    resolver: zodResolver(menuAddDishFormSchema),
    defaultValues: { price: 0, stock: 10 },
  })

  const selectedDishId = form.watch('dishId')
  useEffect(() => {
    if (selectedDishId) {
      const dish = dishes.find((d) => d.id === selectedDishId)
      if (dish) form.setValue('price', dish.basePrice)
    }
  }, [selectedDishId, dishes, form])

  const getDates = (): string[] => {
    if (!selectedDate) return []
    if (!activeDateRange || activeDateRange.from === activeDateRange.to)
      return [selectedDate]
    return eachDayOfInterval({
      start: parseISO(activeDateRange.from),
      end: parseISO(activeDateRange.to),
    }).map((d) => format(d, 'yyyy-MM-dd'))
  }

  const rangeLabel =
    activeDateRange && activeDateRange.from !== activeDateRange.to
      ? formatMenuDateRange(activeDateRange.from, activeDateRange.to)
      : null

  const onSubmit = (values: MenuAddDishFormValues) => {
    if (!selectedBranchId || !selectedDate) return
    addMutation.mutate(
      {
        branchId: selectedBranchId,
        dishId: values.dishId,
        dates: getDates(),
        price: values.price,
        stock: values.stock,
      },
      {
        onSuccess: () => {
          form.reset({ price: 0, stock: 10 })
          onOpenChange(false)
        },
      }
    )
  }

  const handleClose = () => {
    form.reset({ price: 0, stock: 10 })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(s) => { if (!s) handleClose() }}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>Agregar Plato al Menú</DialogTitle>
          <DialogDescription>
            {rangeLabel
              ? `Se agregará a todos los días: ${rangeLabel}`
              : 'Agrega un plato al menú del día seleccionado.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='menu-add-dish-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='dishId'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Plato</FormLabel>
                  <div className='col-span-4'>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      defaultValue={field.value ? String(field.value) : undefined}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Selecciona un plato' />
                      </SelectTrigger>
                      <SelectContent>
                        {dishes.map((d) => (
                          <SelectItem key={d.id} value={String(d.id)}>
                            {d.name}
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
              name='price'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Precio (S/.)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={0}
                      step='0.01'
                      className='col-span-4'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='stock'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={0}
                      step='1'
                      className='col-span-4'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type='submit'
            form='menu-add-dish-form'
            disabled={addMutation.isPending}
          >
            {addMutation.isPending ? 'Agregando...' : 'Agregar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
