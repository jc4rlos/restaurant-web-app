import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

type Props = {
  date: string
  className?: string
}

export const formatMenuDate = (date: string): string =>
  format(parseISO(date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })

export const formatMenuDateRange = (from: string, to: string): string => {
  if (from === to) return formatMenuDate(from)
  const fromDate = parseISO(from)
  const toDate = parseISO(to)
  const fromLabel = format(fromDate, "EEEE dd 'de' MMMM", { locale: es })
  const toLabel = format(toDate, "EEEE dd 'de' MMMM 'de' yyyy", { locale: es })
  return `${fromLabel} — ${toLabel}`
}

export const MenuDateLabel = ({ date, className }: Props) => (
  <span className={className}>{formatMenuDate(date)}</span>
)
