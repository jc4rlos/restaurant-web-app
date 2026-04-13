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
import {
  productFormSchema,
  type ProductFormValues,
  type Product,
  UNIT_OPTIONS,
} from '../data/schema'
import { useCreateProduct, useUpdateProduct } from '../hooks/use-products'
import { useProductsContext } from './products-provider'

type ProductActionDialogProps = {
  currentRow?: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ProductsActionDialog = ({
  currentRow,
  open,
  onOpenChange,
}: ProductActionDialogProps) => {
  const isEdit = !!currentRow
  const { selectedBranchId } = useProductsContext()
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.name,
          description: currentRow.description ?? '',
          stock: currentRow.stock,
          unitOfMeasure: currentRow.unitOfMeasure,
        }
      : {
          name: '',
          description: '',
          stock: 0,
          unitOfMeasure: '',
        },
  })

  const onSubmit = (values: ProductFormValues) => {
    if (isEdit) {
      updateMutation.mutate(
        {
          id: currentRow.id,
          data: {
            name: values.name,
            description: values.description ?? null,
            stock: values.stock,
            unitOfMeasure: values.unitOfMeasure,
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
          branchId: selectedBranchId!,
          data: {
            name: values.name,
            description: values.description ?? null,
            stock: values.stock,
            unitOfMeasure: values.unitOfMeasure,
          },
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
            {isEdit ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Actualiza el producto aqui. '
              : 'Crea un nuevo producto aqui. '}
            Haz clic en guardar cuando termines.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='product-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Nombre</FormLabel>
                  <div className='col-span-4'>
                    <Input
                      placeholder='Aceite, Arroz, Pollo, etc.'
                      autoComplete='off'
                      {...field}
                    />
                    <FormMessage />
                  </div>
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
                  <div className='col-span-4'>
                    <Input
                      placeholder='Descripción opcional'
                      autoComplete='off'
                      {...field}
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='stock'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Stock</FormLabel>
                  <div className='col-span-4'>
                    <Input
                      type='number'
                      min={0}
                      autoComplete='off'
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 0)
                      }
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='unitOfMeasure'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Unidad medida
                  </FormLabel>
                  <div className='col-span-4'>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Seleccionar unidad' />
                      </SelectTrigger>
                      <SelectContent>
                        {UNIT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
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
          <Button type='submit' form='product-form' disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
