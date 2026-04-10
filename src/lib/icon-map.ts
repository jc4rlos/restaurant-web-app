import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LayoutList,
  ShieldCheck,
  UtensilsCrossed,
  Users,
  HandPlatter,  
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  LayoutList,
  Users,
  UtensilsCrossed,
  CalendarDays,
  ClipboardList,
  ShieldCheck,
  HandPlatter,  
}

export const resolveIcon = (name: string | null): LucideIcon | undefined =>
  name ? ICON_MAP[name] : undefined
