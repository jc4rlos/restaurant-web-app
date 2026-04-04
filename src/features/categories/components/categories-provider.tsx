import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useState,
} from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Category } from '../data/schema'

type CategoriesDialogType = 'add' | 'edit' | 'delete'

type CategoriesContextType = {
  open: CategoriesDialogType | null
  setOpen: (str: CategoriesDialogType | null) => void
  currentRow: Category | null
  setCurrentRow: Dispatch<React.SetStateAction<Category | null>>
}

const CategoriesContext = createContext<CategoriesContextType | null>(null)

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useDialogState<CategoriesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Category | null>(null)

  return (
    <CategoriesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CategoriesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCategories = () => {
  const ctx = useContext(CategoriesContext)
  if (!ctx)
    throw new Error('useCategories must be used within <CategoriesProvider>')
  return ctx
}
