import { useEffect } from 'react'
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
import useAppStore, { type InventoryItem, type TemporaryOutflow } from '@/stores/main'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function FinalizeTempOutflowModal({
  data,
  onOpenChange,
}: {
  data: { outflow: TemporaryOutflow; item: InventoryItem } | null
  onOpenChange: (val: boolean) => void
}) {
  const { finalizeTemporaryOutflow } = useAppStore()
  const { toast } = useToast()

  const total = data?.outflow?.quantity || 0

  const schema = z
    .object({
      usedQuantity: z.coerce.number().min(0, 'Inválido'),
      returnedQuantity: z.coerce.number().min(0, 'Inválido'),
    })
    .refine((val) => val.usedQuantity + val.returnedQuantity === total, {
      message: `A soma deve ser exatamente igual ao total (${total}).`,
      path: ['returnedQuantity'],
    })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { usedQuantity: 0, returnedQuantity: 0 },
  })

  useEffect(() => {
    if (data) {
      form.reset({ usedQuantity: total, returnedQuantity: 0 })
    }
  }, [data, form, total])

  const onSubmit = async (v: z.infer<typeof schema>) => {
    if (!data) return
    const res = await finalizeTemporaryOutflow(data.outflow.id, v.usedQuantity, v.returnedQuantity)
    if (res.success) {
      toast({
        title: 'SUCESSO',
        description: 'RECONCILIAÇÃO FINALIZADA COM SUCESSO.',
      })
    } else {
      toast({
        variant: 'destructive',
        title: 'ERRO',
        description: 'NÃO FOI POSSÍVEL FINALIZAR A RECONCILIAÇÃO.',
      })
    }
    onOpenChange(false)
  }

  if (!data) return null

  const { outflow, item } = data
  const currentUsed = form.watch('usedQuantity') || 0
  const currentReturned = form.watch('returnedQuantity') || 0
  const isMatching = currentUsed + currentReturned === total

  return (
    <Dialog open={!!data} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="uppercase text-emerald-600 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> Finalizar Baixa Temporária
          </DialogTitle>
          <DialogDescription className="uppercase font-bold text-xs">
            Informe quantos itens foram efetivamente utilizados e quantos retornaram ao estoque.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-slate-50 border p-4 rounded-xl mb-2">
          <div className="font-black text-sm text-slate-900 uppercase mb-1">{item.name}</div>
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase mt-3 pt-3 border-t">
            <span>COLAB: {outflow.employees?.name}</span>
            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded font-black">
              TOTAL RETIRADO: {total} UN
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="usedQuantity"
                render={({ field }) => (
                  <FormItem className="bg-red-50/50 p-3 rounded-lg border border-red-100">
                    <FormLabel className="uppercase font-black text-red-700 text-[11px] leading-tight block h-8">
                      QTD. UTILIZADA (BAIXA REAL)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        max={total}
                        min={0}
                        className="font-black text-xl text-center bg-white border-red-200 focus-visible:ring-red-500 text-red-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="returnedQuantity"
                render={({ field }) => (
                  <FormItem className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                    <FormLabel className="uppercase font-black text-emerald-700 text-[11px] leading-tight block h-8">
                      QTD. DEVOLVIDA (RETORNO)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        max={total}
                        min={0}
                        className="font-black text-xl text-center bg-white border-emerald-200 focus-visible:ring-emerald-500 text-emerald-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!isMatching && (
              <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs font-bold flex items-center gap-2 uppercase border border-amber-200 animate-fade-in">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>
                  ATENÇÃO: A SOMA ({currentUsed + currentReturned}) DEVE SER IGUAL A {total}.
                </span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="uppercase font-bold"
              >
                CANCELAR
              </Button>
              <Button
                type="submit"
                disabled={!isMatching}
                className="bg-emerald-600 hover:bg-emerald-700 text-white uppercase font-bold"
              >
                <CheckCircle className="w-4 h-4 mr-2" /> RECONCILIAR
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
