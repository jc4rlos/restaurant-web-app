import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useState,
} from 'react'
import { type DailyMenuItem } from '../data/schema'

export type DateRange = { from: string; to: string }

type DailyMenuContextType = {
  isDetailOpen: boolean
  selectedDate: string | null
  selectedBranchId: number | null
  activeDateRange: DateRange | null
  openDetail: (branchId: number, date: string, range?: DateRange) => void
  closeDetail: () => void

  editingItem: DailyMenuItem | null
  setEditingItem: Dispatch<React.SetStateAction<DailyMenuItem | null>>
  deletingItem: DailyMenuItem | null
  setDeletingItem: Dispatch<React.SetStateAction<DailyMenuItem | null>>

  isAddDishOpen: boolean
  setIsAddDishOpen: Dispatch<React.SetStateAction<boolean>>

  isCreateOpen: boolean
  setIsCreateOpen: Dispatch<React.SetStateAction<boolean>>
}

const DailyMenuContext = createContext<DailyMenuContextType | null>(null)

export const DailyMenuProvider = ({ children }: { children: ReactNode }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)
  const [activeDateRange, setActiveDateRange] = useState<DateRange | null>(null)

  const [editingItem, setEditingItem] = useState<DailyMenuItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<DailyMenuItem | null>(null)
  const [isAddDishOpen, setIsAddDishOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const openDetail = (
    branchId: number,
    date: string,
    range?: DateRange
  ) => {
    setSelectedBranchId(branchId)
    setSelectedDate(date)
    setActiveDateRange(range ?? null)
    setIsDetailOpen(true)
  }

  const closeDetail = () => {
    setIsDetailOpen(false)
    setTimeout(() => {
      setSelectedDate(null)
      setSelectedBranchId(null)
      setActiveDateRange(null)
    }, 300)
  }

  return (
    <DailyMenuContext
      value={{
        isDetailOpen,
        selectedDate,
        selectedBranchId,
        activeDateRange,
        openDetail,
        closeDetail,
        editingItem,
        setEditingItem,
        deletingItem,
        setDeletingItem,
        isAddDishOpen,
        setIsAddDishOpen,
        isCreateOpen,
        setIsCreateOpen,
      }}
    >
      {children}
    </DailyMenuContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDailyMenuContext = () => {
  const ctx = useContext(DailyMenuContext)
  if (!ctx)
    throw new Error(
      'useDailyMenuContext must be used within <DailyMenuProvider>'
    )
  return ctx
}
