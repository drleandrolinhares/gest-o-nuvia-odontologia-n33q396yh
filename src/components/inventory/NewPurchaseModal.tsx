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
import { ShoppingCart } from 'lucide-react'
import { MonthYearInput } from '@/components/ui/month-year-input'

export function NewPurchaseModal({
  item,
  open,
  onOpenChange,
}: {
  item: InventoryItem | null
  open: boolean
  onOpenChange: (val: boolean) => void
}) {
  const { addPurchaseHistory, suppliers } = useAppStore()

  const schema = z.object({
    quantity: z.coerce.number().min(1, 'OBRIGATÓRIO MAIOR QUE 0'),
    price: z.coerce.number().min(0, 'OBRIGATÓRIO'),
    supplierId: z.string().optional(),
    lot: z.string().optional(),
    expirationDate: z.string().optional(),
    nfeNumber: z.string().optional(),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      quantity: 1,
      price: 0,
      supplierId: '',
      lot: '',
      expirationDate: '',
      nfeNumber: '',
    },
  })

  const onSubmit = (v: z.infer<typeof schema>) => {
    if (!item) return
    addPurchaseHistory(item.id, {
      date: new Date().toISOString(),
      price: v.price,
      quantity: v.quantity,
      lot: v.lot?.toUpperCase() || undefined,
      supplierId: v.supplierId || undefined,
      expirationDate: v.expirationDate ? new Date(v.expirationDate).toISOString() : undefined,
      nfeNumber: v.nfeNumber || undefined,
    })
    form.reset()
    onOpenChange(false)
  }

  if (!item) return null

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) form.reset()
      }}
    >
      <DialogContent className="max-w-md uppercase">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#D81B84]">
            <ShoppingCart className="h-5 w-5" /> REGISTRAR NOVA COMPRA
          </DialogTitle>
          <DialogDescription className="uppercase mt-1 text-xs">
            LANÇAMENTO INDEPENDENTE PARA O ITEM <strong>{item.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>QTD. COMPRADA</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} className="uppercase" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VALOR TOTAL (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min={0} className="uppercase" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FORNECEDOR</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="uppercase">
                        <SelectValue placeholder="SELECIONAR..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers.map((s) => (
                        <SelectItem key={s.id} value={s.id} className="uppercase">
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LOTE</FormLabel>
                    <FormControl>
                      <Input placeholder="EX: LT123" className="uppercase" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VALIDADE DO LOTE</FormLabel>
                    <FormControl>
                      <MonthYearInput
                        className="uppercase"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="nfeNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NÚMERO DA NFE</FormLabel>
                  <FormControl>
                    <Input placeholder="EX: 123456" className="uppercase" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                CANCELAR
              </Button>
              <Button type="submit" className="bg-[#D81B84] hover:bg-[#B71770] text-white">
                SALVAR COMPRA
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
