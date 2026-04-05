import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Switch } from '@/components/ui/switch'
import { menuItemEditFormSchema, type MenuItemEditFormValues, type DailyMenuItem } from '../data/schema'
import { useUpdateMenuItem } from '../hooks/use-daily-menu'

type Props = {
  item: DailyMenuItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const MenuItemEditDialog = ({ item, open, onOpenChange }: Props) => {
  const updateMutation = useUpdateMenuItem()

  const form = useForm<MenuItemEditFormValues>({
    resolver: zodResolver(menuItemEditFormSchema),
    defaultValues: {
      price: item.price,
      stock: item.stock,
      isActive: item.isActive,
    },
  })

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  const onSubmit = (values: MenuItemEditFormValues) => {
    updateMutation.mutate(
      { id: item.id, data: values },
      { onSuccess: handleClose }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(s) => { if (!s) handleClose() }}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader className='text-start'>
          <DialogTitle>Editar — {item.dishName}</DialogTitle>
          <DialogDescription>
            Actualiza el precio, stock y estado del plato en el menú.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='menu-item-edit-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
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

            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Activo</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
            form='menu-item-edit-form'
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
