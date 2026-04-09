import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useState,
} from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Table } from '../data/schema'

type TablesDialogType = 'add' | 'edit' | 'delete'

type TablesContextType = {
  open: TablesDialogType | null
  setOpen: (str: TablesDialogType | null) => void
  currentRow: Table | null
  setCurrentRow: Dispatch<React.SetStateAction<Table | null>>
}

const TablesContext = createContext<TablesContextType | null>(null)

export const TablesProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useDialogState<TablesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Table | null>(null)

  return (
    <TablesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TablesContext.Provider>
  )
}

export const useTablesContext = () => {
  const context = useContext(TablesContext)
  if (!context)
    throw new Error('useTablesContext debe estar dentro de TablesProvider')
  return context
}