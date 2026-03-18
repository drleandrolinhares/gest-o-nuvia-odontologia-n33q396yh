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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useAppStore, { type InventoryItem } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'

const schema = z.object({
  employeeId: z.string().min(1, 'Obrigatório'),
  quantity: z.coerce.number().min(1, 'A quantidade deve ser maior que 0'),
  destination: z.string().min(1, 'Informe o destino ou observação'),
})

export function TemporaryOutflowModal({
  item,
  open,
  onOpenChange,
}: {
  item: InventoryItem | null
  open: boolean
  onOpenChange: (val: boolean) => void
}) {
  const { employees, addTemporaryOutflow } = useAppStore()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { employeeId: '', quantity: 1, destination: '' },
  })

  useEffect(() => {
    if (open) form.reset({ employeeId: '', quantity: 1, destination: '' })
  }, [open, form])

  const onSubmit = async (v: z.infer<typeof schema>) => {
    if (!item) return
    if (v.quantity > item.quantity) {
      form.setError('quantity', { message: 'Quantidade excede o estoque atual' })
      return
    }
    const res = await addTemporaryOutflow(item.id, v.employeeId, v.quantity, v.destination)
    if (res.success) {
      toast({ title: 'SUCESSO', description: 'BAIXA TEMPORÁRIA REGISTRADA.' })
      onOpenChange(false)
    } else {
      toast({
        variant: 'destructive',
        title: 'ERRO',
        description: 'FALHA AO REGISTRAR BAIXA TEMPORÁRIA.',
      })
    }
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="uppercase text-amber-600">Baixa Temporária</DialogTitle>
          <DialogDescription className="uppercase font-semibold text-xs">
            ATRIBUA ITENS A UM COLABORADOR PARA USO OU TESTE SEM DEDUZIR DEFINITIVAMENTE DO ESTOQUE.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-amber-50/50 p-4 rounded-lg flex flex-col gap-1 mb-2 border border-amber-200/50">
          <h4 className="font-semibold text-sm text-foreground uppercase">{item.name}</h4>
          <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
            ESTOQUE ATUAL:{' '}
            <span className="font-black text-foreground text-sm">{item.quantity} UNIDADES</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase font-bold text-muted-foreground tracking-wider">
                    Colaborador Responsável
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="uppercase font-bold">
                        <SelectValue placeholder="SELECIONE..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees
                        .filter((e) => e.status !== 'Desligado' && e.status !== 'Inativo')
                        .map((e) => (
                          <SelectItem key={e.id} value={e.id} className="uppercase font-semibold">
                            {e.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase font-bold text-muted-foreground tracking-wider">
                    Destino / Observação
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="EX: TESTE EM CADEIRA 3"
                      {...field}
                      className="uppercase font-bold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
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

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="uppercase font-bold"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white uppercase font-bold"
              >
                Confirmar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
