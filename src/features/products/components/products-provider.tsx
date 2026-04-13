import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useState,
} from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Product } from '../data/schema'

type ProductsDialogType = 'add' | 'edit' | 'delete'

type ProductsContextType = {
  selectedBranchId: number | null
  setSelectedBranchId: Dispatch<React.SetStateAction<number | null>>
  open: ProductsDialogType | null
  setOpen: (str: ProductsDialogType | null) => void
  currentRow: Product | null
  setCurrentRow: Dispatch<React.SetStateAction<Product | null>>
}

const ProductsContext = createContext<ProductsContextType | null>(null)

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)
  const [open, setOpen] = useDialogState<ProductsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Product | null>(null)

  return (
    <ProductsContext.Provider
      value={{
        selectedBranchId,
        setSelectedBranchId,
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProductsContext = () => {
  const ctx = useContext(ProductsContext)
  if (!ctx)
    throw new Error('useProductsContext must be used within <ProductsProvider>')
  return ctx
}
