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
import { useToast } from '@/hooks/use-toast'

export function DecreaseStockModal({
  item,
  open,
  onOpenChange,
}: {
  item: InventoryItem | null
  open: boolean
  onOpenChange: (val: boolean) => void
}) {
  const { registerDefinitiveOutflow } = useAppStore()
  const { toast } = useToast()
  const [outflowType, setOutflowType] = useState<'partial' | 'total'>('partial')

  const schema = z.object({
    quantity: z.coerce.number().min(1, 'A quantidade deve ser maior que 0'),
    recipient: z.string().min(1, 'Informe o destinatário ou paciente'),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      quantity: 1,
      recipient: '',
    },
  })

  useEffect(() => {
    if (open) {
      setOutflowType('partial')
      form.reset({ quantity: 1, recipient: '' })
    }
  }, [open, form])

  useEffect(() => {
    if (outflowType === 'total' && item) {
      form.setValue('quantity', item.quantity)
    } else if (outflowType === 'partial' && item) {
      form.setValue('quantity', 1)
    }
  }, [outflowType, item, form])

  const onSubmit = async (v: z.infer<typeof schema>) => {
    if (!item) return
    const qtyToRemove = outflowType === 'total' ? item.quantity : v.quantity

    if (qtyToRemove > item.quantity) {
      form.setError('quantity', { message: 'Quantidade excede o estoque atual' })
      return
    }

    const res = await registerDefinitiveOutflow(item.id, qtyToRemove, v.recipient)
    if (res.success) {
      toast({ title: 'SUCESSO', description: 'BAIXA REGISTRADA COM SUCESSO.' })
      onOpenChange(false)
    } else {
      toast({ variant: 'destructive', title: 'ERRO', description: 'FALHA AO REGISTRAR BAIXA.' })
    }
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="uppercase">Registrar Saída de Estoque</DialogTitle>
          <DialogDescription className="uppercase text-xs font-semibold">
            REGISTRE A RETIRADA OU USO DEFINITIVO DE PRODUTOS DO ESTOQUE.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-blue-50/50 p-4 rounded-lg flex flex-col gap-1 mb-2 border border-blue-200/50 uppercase">
          <h4 className="font-semibold text-sm text-blue-900">{item.name}</h4>
          <div className="text-xs text-blue-800 font-bold tracking-wider">
            ESTOQUE ATUAL:{' '}
            <span className="font-black text-blue-700 text-sm">{item.quantity} UNIDADES</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <FormLabel className="uppercase font-bold text-muted-foreground tracking-wider">
                Tipo de Saída
              </FormLabel>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={outflowType === 'partial' ? 'default' : 'outline'}
                  onClick={() => setOutflowType('partial')}
                  className={cn(
                    'uppercase font-bold',
                    outflowType === 'partial' ? 'bg-blue-600 hover:bg-blue-700 text-white' : '',
                  )}
                >
                  Saída Parcial
                </Button>
                <Button
                  type="button"
                  variant={outflowType === 'total' ? 'default' : 'outline'}
                  onClick={() => setOutflowType('total')}
                  className={cn(
                    'uppercase font-bold',
                    outflowType === 'total' ? 'bg-blue-600 hover:bg-blue-700 text-white' : '',
                  )}
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
                    <FormLabel className="uppercase font-bold text-muted-foreground tracking-wider">
                      QTD. A RETIRAR (UNIDADES)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        max={item.quantity}
                        min={1}
                        className="uppercase font-bold"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem className="animate-fade-in">
                  <FormLabel className="uppercase font-bold text-muted-foreground tracking-wider">
                    Entregue para / Paciente
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="EX: PACIENTE MARIA OU CADEIRA 1"
                      {...field}
                      className="uppercase font-bold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="uppercase font-bold"
              >
                Cancelar
              </Button>
              <Button type="submit" variant="destructive" className="uppercase font-bold">
                Confirmar Saída
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
