import { type Control } from 'react-hook-form'
import {
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
import { Textarea } from '@/components/ui/textarea'
import { type CategoryOption } from '../hooks/use-active-categories'
import { type DishFormValues } from '../data/schema'
import { DishImagePicker } from './dish-image-picker'

type DishFormFieldsProps = {
  control: Control<DishFormValues, any, DishFormValues>
  categories: CategoryOption[]
  imagePreview: string | null
  onImageChange: (file: File) => void
  onImageClear: () => void
}

export const DishFormFields = ({
  control,
  categories,
  imagePreview,
  onImageChange,
  onImageClear,
}: DishFormFieldsProps) => (
  <div className='space-y-4'>
    <FormField
      control={control}
      name='categoryId'
      render={({ field }) => (
        <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
          <FormLabel className='col-span-2 text-end'>Categoría</FormLabel>
          <FormControl>
            <Select
              onValueChange={(val) => field.onChange(Number(val))}
              defaultValue={field.value ? String(field.value) : undefined}
            >
              <SelectTrigger className='col-span-4'>
                <SelectValue placeholder='Selecciona una categoría' />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage className='col-span-4 col-start-3' />
        </FormItem>
      )}
    />

    <FormField
      control={control}
      name='name'
      render={({ field }) => (
        <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
          <FormLabel className='col-span-2 text-end'>Nombre</FormLabel>
          <FormControl>
            <Input
              placeholder='Lomo saltado, Ceviche, etc.'
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
      control={control}
      name='description'
      render={({ field }) => (
        <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
          <FormLabel className='col-span-2 pt-2 text-end'>Descripción</FormLabel>
          <FormControl>
            <Textarea
              placeholder='Descripción opcional'
              className='col-span-4 resize-none'
              rows={3}
              {...field}
            />
          </FormControl>
          <FormMessage className='col-span-4 col-start-3' />
        </FormItem>
      )}
    />

    <FormField
      control={control}
      name='basePrice'
      render={({ field }) => (
        <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
          <FormLabel className='col-span-2 text-end'>Precio (S/.)</FormLabel>
          <FormControl>
            <Input
              type='number'
              min={0}
              step='0.01'
              placeholder='0.00'
              className='col-span-4'
              {...field}
            />
          </FormControl>
          <FormMessage className='col-span-4 col-start-3' />
        </FormItem>
      )}
    />

    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
      <FormLabel className='col-span-2 text-end'>Imagen</FormLabel>
      <div className='col-span-4'>
        <DishImagePicker
          preview={imagePreview}
          onFileChange={onImageChange}
          onClear={onImageClear}
        />
      </div>
    </FormItem>

    <FormField
      control={control}
      name='isActive'
      render={({ field }) => (
        <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
          <FormLabel className='col-span-2 text-end'>Activo</FormLabel>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  </div>
)
