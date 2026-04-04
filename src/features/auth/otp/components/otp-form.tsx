import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'
import { verifyOtp, getEmployeeByUserId } from '../../auth-service'

const formSchema = z.object({
  otp: z.string().length(6, 'Ingresa el código de 6 dígitos.'),
})

interface OtpFormProps extends React.HTMLAttributes<HTMLFormElement> {
  email: string
  redirectTo?: string
}

export function OtpForm({
  className,
  email,
  redirectTo,
  ...props
}: OtpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  const otp = form.watch('otp')

  async function onSubmit({ otp: token }: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const session = await verifyOtp(email, token)
      const employee = await getEmployeeByUserId(session.user.id)

      auth.setUser({
        employeeId: employee.id,
        email: session.user.email ?? email,
        role: employee.role,
        exp: (session.expires_at ?? 0) * 1000,
      })
      auth.setAccessToken(session.access_token)

      navigate({ to: redirectTo || '/', replace: true })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Código inválido.')
      form.reset()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='otp'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='sr-only'>Código OTP</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  containerClassName='justify-between sm:[&>[data-slot="input-otp-group"]>div]:w-12'
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={otp.length < 6 || isLoading}>
          {isLoading ? 'Verificando...' : 'Verificar'}
        </Button>
      </form>
    </Form>
  )
}
