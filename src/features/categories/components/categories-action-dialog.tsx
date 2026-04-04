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
import {
  categoryFormSchema,
  type CategoryFormValues,
} from '../data/schema'
import { type Category } from '../data/schema'
import { useCreateCategory, useUpdateCategory } from '../hooks/use-categories'

type CategoryActionDialogProps = {
  currentRow?: Category
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CategoriesActionDialog = ({
  currentRow,
  open,
  onOpenChange,
}: CategoryActionDialogProps) => {
  const isEdit = !!currentRow
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.name,
          description: currentRow.description ?? '',
          isActive: currentRow.isActive,
        }
      : {
          name: '',
          description: '',
          isActive: true,
        },
  })

  const onSubmit = (values: CategoryFormValues) => {
    if (isEdit) {
      updateMutation.mutate(
        {
          id: currentRow.id,
          data: {
            name: values.name,
            description: values.description ?? null,
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
          name: values.name,
          description: values.description ?? null,
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
            {isEdit ? 'Editar Categoría' : 'Agregar Nueva Categoría'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Actualiza la categoría aquí. '
              : 'Crea una nueva categoría aquí. '}
            Haz clic en guardar cuando termines.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='category-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ensaladas, Sopas, Carnes, etc.'
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
              name='description'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Descripción
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Descripción opcional'
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
          <Button type='submit' form='category-form' disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
