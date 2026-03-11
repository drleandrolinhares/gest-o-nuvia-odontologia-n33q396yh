import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import useAppStore, { type InventoryItem } from '@/stores/main'
import { cn } from '@/lib/utils'

export function DecreaseStockModal({
  item,
  open,
  onOpenChange,
}: {
  item: InventoryItem | null
  open: boolean
  onOpenChange: (val: boolean) => void
}) {
  const { updateInventoryQuantity } = useAppStore()
  const [outflowType, setOutflowType] = useState<'partial' | 'total'>('partial')

  const schema = z.object({
    quantity: z.coerce.number().min(1, 'A quantidade deve ser maior que 0'),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      quantity: 1,
    },
  })

  useEffect(() => {
    if (open) {
      setOutflowType('partial')
      form.reset({ quantity: 1 })
    }
  }, [open, form])

  useEffect(() => {
    if (outflowType === 'total' && item) {
      form.setValue('quantity', item.quantity)
    } else if (outflowType === 'partial' && item) {
      form.setValue('quantity', 1)
    }
  }, [outflowType, item, form])

  const onSubmit = (v: z.infer<typeof schema>) => {
    if (!item) return
    const qtyToRemove = outflowType === 'total' ? item.quantity : v.quantity

    if (qtyToRemove > item.quantity) {
      form.setError('quantity', { message: 'Quantidade excede o estoque atual' })
      return
    }

    const newQty = item.quantity - qtyToRemove
    updateInventoryQuantity(item.id, newQty)
    onOpenChange(false)
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Saída de Estoque</DialogTitle>
          <DialogDescription>Registre a retirada ou uso de produtos do estoque.</DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 p-4 rounded-lg flex flex-col gap-1 mb-2 border border-border/50">
          <h4 className="font-semibold text-sm text-foreground">{item.name}</h4>
          <div className="text-xs text-muted-foreground">
            Estoque Atual: <span className="font-bold text-foreground">{item.quantity}</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <FormLabel>Tipo de Saída</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={outflowType === 'partial' ? 'default' : 'outline'}
                  onClick={() => setOutflowType('partial')}
                  className={cn(outflowType === 'partial' ? 'bg-blue-600 hover:bg-blue-700' : '')}
                >
                  Saída Parcial
                </Button>
                <Button
                  type="button"
                  variant={outflowType === 'total' ? 'default' : 'outline'}
                  onClick={() => setOutflowType('total')}
                  className={cn(outflowType === 'total' ? 'bg-blue-600 hover:bg-blue-700' : '')}
                >
                  Saída Total (Zerar)
                </Button>
              </div>
            </div>

            {outflowType === 'partial' && (
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="animate-fade-in">
                    <FormLabel>Quantidade a remover</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} max={item.quantity} min={1} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="destructive">
                Confirmar Saída
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
