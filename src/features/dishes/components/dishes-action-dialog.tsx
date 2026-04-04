import { useState } from 'react'
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
import { Form } from '@/components/ui/form'
import { dishFormSchema, type DishFormValues, type Dish } from '../data/schema'
import { useActiveCategories } from '../hooks/use-active-categories'
import { useCreateDish, useUpdateDish } from '../hooks/use-dishes'
import { DishFormFields } from './dish-form-fields'

type DishesActionDialogProps = {
  currentRow?: Dish
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const DishesActionDialog = ({
  currentRow,
  open,
  onOpenChange,
}: DishesActionDialogProps) => {
  const isEdit = !!currentRow
  const createMutation = useCreateDish()
  const updateMutation = useUpdateDish()
  const { data: categories = [] } = useActiveCategories()

  const [imagePreview, setImagePreview] = useState<string | null>(
    currentRow?.imageUrl ?? null
  )

  const form = useForm<DishFormValues>({
    resolver: zodResolver(dishFormSchema),
    defaultValues: isEdit
      ? {
          categoryId: currentRow.categoryId,
          name: currentRow.name,
          description: currentRow.description ?? '',
          basePrice: currentRow.basePrice,
          isActive: currentRow.isActive,
        }
      : { name: '', description: '', basePrice: 0, isActive: true },
  })

  const handleClose = () => {
    form.reset()
    setImagePreview(currentRow?.imageUrl ?? null)
    onOpenChange(false)
  }

  const onSubmit = (values: DishFormValues) => {
    const payload = {
      categoryId: values.categoryId,
      name: values.name,
      description: values.description ?? null,
      basePrice: values.basePrice,
      imageUrl: isEdit ? currentRow.imageUrl : null,
      isActive: values.isActive,
      imageFile: values.imageFile,
    }

    const options = { onSuccess: handleClose }

    if (isEdit) {
      updateMutation.mutate({ id: currentRow.id, data: payload }, options)
    } else {
      createMutation.mutate(payload, options)
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={(s) => { if (!s) handleClose() }}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Editar Plato' : 'Agregar Nuevo Plato'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Actualiza el plato aquí. ' : 'Crea un nuevo plato aquí. '}
            Haz clic en guardar cuando termines.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='dish-form' onSubmit={form.handleSubmit(onSubmit)}>
            <DishFormFields
              control={form.control}
              categories={categories}
              imagePreview={imagePreview}
              onImageChange={(file) => {
                form.setValue('imageFile', file)
                setImagePreview(URL.createObjectURL(file))
              }}
              onImageClear={() => {
                form.setValue('imageFile', undefined)
                setImagePreview(null)
              }}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose}>
            Cancelar
          </Button>
          <Button type='submit' form='dish-form' disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
