import { AlertTriangle, PackageX } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useStockAlerts } from '../hooks/use-dashboard'

export const StockAlerts = () => {
  const { data = [], isLoading } = useStockAlerts()

  return (
    <Card className='border-0 shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-2 text-sm font-semibold'>
          <AlertTriangle className='h-4 w-4 text-amber-500' />
          Alertas de stock
          {data.length > 0 && (
            <Badge variant='destructive' className='ml-auto text-[10px]'>
              {data.length}
            </Badge>
          )}
        </CardTitle>
        <p className='text-xs text-muted-foreground'>Menú de hoy con stock ≤ 5</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex flex-col gap-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-10 rounded-lg' />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className='flex flex-col items-center gap-2 py-8 text-muted-foreground'>
            <PackageX className='h-8 w-8 opacity-40' />
            <p className='text-sm'>Todo el stock está bien</p>
          </div>
        ) : (
          <div className='flex flex-col gap-2'>
            {data.map((item) => (
              <Alert
                key={item.menuItemId}
                className={`py-2 ${item.stock === 0 ? 'border-destructive/50 bg-destructive/5' : 'border-amber-200 bg-amber-50 dark:bg-amber-950/20'}`}
              >
                <AlertDescription className='flex items-center justify-between text-xs'>
                  <span className='font-medium'>{item.dishName}</span>
                  <div className='flex items-center gap-2'>
                    <span className='text-muted-foreground'>{item.branchName}</span>
                    <Badge
                      variant={item.stock === 0 ? 'destructive' : 'outline'}
                      className={`text-[10px] ${item.stock === 0 ? '' : 'border-amber-400 text-amber-700'}`}
                    >
                      {item.stock === 0 ? 'Sin stock' : `${item.stock} restantes`}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
