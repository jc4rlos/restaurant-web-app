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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { tableFormSchema, type TableFormValues, type Table } from '../data/schema'
import { useCreateTable, useUpdateTable, useBranches } from '../hooks/use-tables'

type TablesActionDialogProps = {
  currentRow?: Table
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const TablesActionDialog = ({
  currentRow,
  open,
  onOpenChange,
}: TablesActionDialogProps) => {
  const isEdit = !!currentRow
  const createMutation = useCreateTable()
  const updateMutation = useUpdateTable()
  const { data: branches = [] } = useBranches()

  const form = useForm<TableFormValues>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: isEdit
      ? {
          branchId: currentRow.branchId,
          number: currentRow.number,
          capacity: currentRow.capacity,
          isActive: currentRow.isActive,
        }
      : {
          branchId: 0,
          number: '',
          capacity: 4,
          isActive: true,
        },
  })

  const onSubmit = (values: TableFormValues) => {
    if (isEdit) {
      updateMutation.mutate(
        {
          id: currentRow.id,
          data: {
            number: values.number,
            capacity: values.capacity,
            isActive: values.isActive,
          },
        },
        {
          onSuccess: () => {
            form.reset()
            onOpenChange(false)
          },
        }
      )
    } else {
      createMutation.mutate(
        {
          branchId: values.branchId,
          number: values.number,
          capacity: values.capacity,
          isActive: values.isActive,
        },
        {
          onSuccess: () => {
            form.reset()
            onOpenChange(false)
          },
        }
      )
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Editar Mesa' : 'Agregar Nueva Mesa'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Actualiza los datos de la mesa aquí. '
              : 'Crea una nueva mesa aquí. '}
            Haz clic en guardar cuando termines.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='table-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            {!isEdit && (
              <FormField
                control={form.control}
                name='branchId'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Sucursal
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ? String(field.value) : ''}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger className='col-span-4'>
                          <SelectValue placeholder='Selecciona una sucursal' />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem
                              key={branch.id}
                              value={String(branch.id)}
                            >
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name='number'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Número de Mesa
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='1, 2, A5, etc.'
                      className='col-span-4'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='capacity'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Capacidad
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={1}
                      placeholder='Personas'
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
          <Button
            variant='outline'
            onClick={() => {
              form.reset()
              onOpenChange(false)
            }}
          >
            Cancelar
          </Button>
          <Button type='submit' form='table-form' disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}