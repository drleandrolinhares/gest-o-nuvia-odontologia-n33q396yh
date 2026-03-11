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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { formatCurrency, cn } from '@/lib/utils'
import { CalendarIcon, Calculator } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const schema = z.object({
  name: z.string().min(1, 'Obrigatório'),
  brand: z.string().optional(),
  specialty: z.string().optional(),
  packageCost: z.coerce.number().min(0),
  packageType: z.string().min(1, 'Obrigatório'),
  itemsPerBox: z.coerce.number().min(1),
  quantity: z.coerce.number().min(0),
  entryDate: z.date().optional(),
  expirationDate: z.date().optional(),
  storageLocation: z.string().min(1, 'Obrigatório'),
  minStock: z.coerce.number().min(0),
  barcode: z.string().optional(),
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
  const { addInventoryItem, packageTypes, specialties } = useAppStore()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      brand: '',
      specialty: '',
      packageCost: 0,
      packageType: 'Caixa',
      itemsPerBox: 1,
      quantity: 0,
      storageLocation: '',
      minStock: 0,
      barcode: '',
      lastBrand: '',
      lastValue: 0,
      notes: '',
    },
  })

  const pCost = form.watch('packageCost') || 0
  const qty = form.watch('quantity') || 0

  const totalCost = qty * pCost

  const onSubmit = (v: z.infer<typeof schema>) => {
    addInventoryItem({
      ...v,
      entryDate: v.entryDate ? v.entryDate.toISOString() : undefined,
      expirationDate: v.expirationDate ? v.expirationDate.toISOString() : undefined,
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto uppercase">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-nuvia-navy">
            NOVO PRODUTO NO ESTOQUE
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-1">
                    <FormLabel>NOME DO MATERIAL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="EX: RESINA A2"
                        className="border-[#D81B84] focus-visible:ring-[#D81B84] uppercase"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MARCA</FormLabel>
                    <FormControl>
                      <Input placeholder="EX: 3M, FGM..." className="uppercase" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ESPECIALIDADE</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="uppercase">
                          <SelectValue placeholder="SELECIONE" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {specialties.map((spec) => (
                          <SelectItem key={spec} value={spec} className="uppercase">
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100 grid gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-5">
                <Calculator className="w-32 h-32" />
              </div>
              <h4 className="font-semibold text-blue-900 flex items-center gap-2 relative z-10">
                INFORMAÇÕES DE COMPRA E EMBALAGEM
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>QTD. COMPRADA</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="bg-white uppercase"
                          placeholder="EX: 10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="itemsPerBox"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ITENS NA EMBALAGEM</FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-white uppercase" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="packageCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VALOR EMB. FECHADA (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          className="bg-white uppercase"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="packageType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TIPO EMBALAGEM</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white uppercase">
                            <SelectValue placeholder="SELECIONE" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {packageTypes.map((pt) => (
                            <SelectItem key={pt} value={pt} className="uppercase">
                              {pt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="pt-3 border-t border-blue-200/50 flex justify-between items-center relative z-10">
                <span className="text-sm font-semibold text-blue-800">VALOR TOTAL DA COMPRA</span>
                <div className="text-2xl font-black text-blue-700">{formatCurrency(totalCost)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <FormField
                control={form.control}
                name="entryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>DATA DE ENTRADA</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal uppercase',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: ptBR })
                            ) : (
                              <span>SELECIONE A DATA</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 uppercase" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>DATA DE VALIDADE</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal uppercase',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: ptBR })
                            ) : (
                              <span>SELECIONE A DATA</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 uppercase" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
              <FormField
                control={form.control}
                name="storageLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LOCAL DE ARMAZENAMENTO</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="EX: SALA 1 - ARMÁRIO A"
                        className="uppercase"
                        {...field}
                      />
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
                    <FormLabel>ESTOQUE MÍNIMO (AVISO)</FormLabel>
                    <FormControl>
                      <Input type="number" className="uppercase" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CÓDIGO DE BARRAS</FormLabel>
                    <FormControl>
                      <Input placeholder="BIPAR OU DIGITAR..." className="uppercase" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-semibold text-muted-foreground text-sm">
                HISTÓRICO & NOTAS (OPCIONAL)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lastBrand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MARCA DA ÚLTIMA COMPRA</FormLabel>
                      <FormControl>
                        <Input placeholder="EX: 3M, IVOCLAR..." className="uppercase" {...field} />
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
                      <FormLabel>VALOR DA ÚLTIMA COMPRA (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" className="uppercase" {...field} />
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
                    <FormLabel>OBSERVAÇÕES</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[100px] uppercase"
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
                CANCELAR
              </Button>
              <Button type="submit" className="bg-[#D81B84] hover:bg-[#B71770] text-white">
                CADASTRAR PRODUTO
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
