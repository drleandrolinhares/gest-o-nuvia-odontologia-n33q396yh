import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@/stores/main'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { formatCurrency } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(1, 'Obrigatório'),
  packageCost: z.coerce.number().min(0),
  storageLocation: z.string().min(1, 'Obrigatório'),
  packageType: z.string(),
  itemsPerBox: z.coerce.number().min(1),
  productionYield: z.coerce.number().min(1),
  minStock: z.coerce.number().min(0),
  quantity: z.coerce.number().min(0),
  lastBrand: z.string().optional(),
  lastValue: z.coerce.number().optional(),
  notes: z.string().optional(),
})

export function AddInventoryModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (val: boolean) => void
}) {
  const { addInventoryItem } = useAppStore()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      packageCost: 0,
      storageLocation: '',
      packageType: 'Caixa',
      itemsPerBox: 1,
      productionYield: 1,
      minStock: 0,
      quantity: 0,
      lastBrand: '',
      lastValue: 0,
      notes: '',
    },
  })

  const pCost = form.watch('packageCost') || 0
  const iBox = form.watch('itemsPerBox') || 1
  const pYield = form.watch('productionYield') || 1
  const qty = form.watch('quantity') || 0

  const unitCost = pCost / (iBox * pYield || 1)
  const totalCost = qty * pCost

  const onSubmit = (v: z.infer<typeof schema>) => {
    addInventoryItem({
      ...v,
      unitCost,
      lastBrand: v.lastBrand || '',
      lastValue: v.lastValue || 0,
      notes: v.notes || '',
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) form.reset()
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Novo Produto no Estoque</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Material</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="EX: RESINA A2"
                      className="border-[#D81B84] focus-visible:ring-[#D81B84]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="packageCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo da Embalagem Fechada (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storageLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local de Armazenamento</FormLabel>
                    <FormControl>
                      <Input placeholder="EX: SALA 1 - ARMÁRIO A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="p-5 bg-slate-50 rounded-xl border grid gap-5">
              <div className="grid gap-1.5">
                <FormLabel className="text-sm font-semibold">Tipos de Embalagem</FormLabel>
                <div className="flex flex-col gap-2">
                  <Button type="button" variant="outline" className="w-fit bg-white">
                    NOVA EMBALAGEM
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Preencha o último campo para adicionar um novo tipo automaticamente.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="itemsPerBox"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade de Itens na Caixa</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productionYield"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rendimento de Produção</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estoque Mínimo (Aviso)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-1.5">
                  <FormLabel className="text-sm font-semibold">
                    Custo Unitário de Produção
                  </FormLabel>
                  <div className="h-10 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-md font-bold border border-emerald-100 flex items-center">
                    {formatCurrency(unitCost)}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qtd. Comprada (Inicial em Caixas)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="border-blue-200"
                        placeholder="EX: 10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-1.5">
                <FormLabel className="text-sm font-semibold">Custo Total da Compra Atual</FormLabel>
                <div className="h-10 px-3 py-2 bg-muted/40 rounded-md font-bold flex items-center">
                  {formatCurrency(totalCost)}
                </div>
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-semibold text-muted-foreground text-sm">
                Detalhes da Compra & Histórico (Opcional)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lastBrand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca da última compra</FormLabel>
                      <FormControl>
                        <Input placeholder="EX: 3M, IVOCLAR..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da última compra (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[100px]"
                        placeholder="ADICIONE NOTAS, LINKS DE FORNECEDORES OU DETALHES..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#D81B84] hover:bg-[#B71770] text-white">
                Cadastrar Produto
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
