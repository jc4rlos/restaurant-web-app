import { useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { OtpForm } from './components/otp-form'

export function Otp() {
  const { email } = useSearch({ from: '/(auth)/otp' })

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-base tracking-tight'>
            Verificación de código
          </CardTitle>
          <CardDescription>
            Ingresa el código de 6 dígitos enviado a{' '}
            <span className='font-medium text-foreground'>{email}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OtpForm />
        </CardContent>
        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            ¿No lo recibiste?{' '}
            <a
              href={`/sign-in`}
              className='underline underline-offset-4 hover:text-primary'
            >
              Volver e intentar de nuevo.
            </a>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
