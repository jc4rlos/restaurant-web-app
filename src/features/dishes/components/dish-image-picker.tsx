import { useRef } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type DishImagePickerProps = {
  preview: string | null
  onFileChange: (file: File) => void
  onClear: () => void
}

export const DishImagePicker = ({
  preview,
  onFileChange,
  onClear,
}: DishImagePickerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileChange(file)
  }

  return (
    <div className='flex items-center gap-3'>
      {preview ? (
        <div className='relative h-16 w-16'>
          <img
            src={preview}
            alt='preview'
            className='h-16 w-16 rounded-md object-cover'
          />
          <button
            type='button'
            onClick={onClear}
            className='absolute -right-2 -top-2 rounded-full bg-destructive p-0.5 text-white'
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div
          className='flex h-16 w-16 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/40 hover:border-muted-foreground/70'
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus size={20} className='text-muted-foreground' />
        </div>
      )}

      <Button
        type='button'
        variant='outline'
        size='sm'
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? 'Cambiar' : 'Seleccionar'}
      </Button>

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleChange}
      />
    </div>
  )
}
