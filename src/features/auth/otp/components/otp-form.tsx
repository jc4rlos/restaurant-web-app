import { cn } from '@/lib/utils'

export function OtpForm({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-center text-sm text-muted-foreground', className)}>
      La autenticación por OTP no está habilitada.
    </div>
  )
}
