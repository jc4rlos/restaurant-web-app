import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useState,
} from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Dish } from '../data/schema'

type DishesDialogType = 'add' | 'edit' | 'delete'

type DishesContextType = {
  open: DishesDialogType | null
  setOpen: (str: DishesDialogType | null) => void
  currentRow: Dish | null
  setCurrentRow: Dispatch<React.SetStateAction<Dish | null>>
}

const DishesContext = createContext<DishesContextType | null>(null)

export const DishesProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useDialogState<DishesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Dish | null>(null)

  return (
    <DishesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </DishesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDishesContext = () => {
  const ctx = useContext(DishesContext)
  if (!ctx)
    throw new Error('useDishesContext must be used within <DishesProvider>')
  return ctx
}
