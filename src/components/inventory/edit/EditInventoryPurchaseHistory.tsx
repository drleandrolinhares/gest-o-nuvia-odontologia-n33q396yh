import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import useAppStore, { type InventoryItem, type PurchaseRecord } from '@/stores/main'
import {
  editPurchaseSchema,
  formatCurrencyInput,
  type EditPurchaseFormSchema,
} from './editInventorySchema'

interface EditInventoryPurchaseHistoryProps {
  item: InventoryItem | null
  canEdit: boolean
}

export function EditInventoryPurchaseHistory({ item, canEdit }: EditInventoryPurchaseHistoryProps) {
  const { suppliers, updatePurchaseHistory, removePurchaseHistory } = useAppStore()
  const { toast } = useToast()
  const [editingPurchase, setEditingPurchase] = useState<PurchaseRecord | null>(null)

  const editPurchaseForm = useForm<EditPurchaseFormSchema>({
    resolver: zodResolver(editPurchaseSchema),
    defaultValues: { quantity: 1, price: 0, supplierId: '', nfeNumber: '' },
  })

  useEffect(() => {
    if (editingPurchase) {
      editPurchaseForm.reset({
        quantity: editingPurchase.quantity,
        price: editingPurchase.price,
        supplierId: editingPurchase.supplierId || '',
        nfeNumber: editingPurchase.nfeNumber || '',
      })
    }
  }, [editingPurchase, editPurchaseForm])

  const handleRemovePurchase = async (purchaseId: string) => {
    if (!item) return
    if (!window.confirm('Tem certeza que deseja excluir este registro de compra?')) return
    const res = await removePurchaseHistory(item.id, purchaseId)
    if (res.success) {
      toast({ title: 'SUCESSO', description: 'Registro de compra excluído.' })
    } else {
      toast({ variant: 'destructive', title: 'ERRO', description: 'Falha ao excluir registro.' })
    }
  }

  const onEditPurchaseSubmit = async (v: EditPurchaseFormSchema) => {
    if (!item || !editingPurchase) return
    const res = await updatePurchaseHistory(item.id, editingPurchase.id, {
      quantity: v.quantity,
      price: v.price,
      supplierId: v.supplierId === 'none' ? undefined : v.supplierId,
      nfeNumber: v.nfeNumber || '',
    })
    if (res.success) {
      toast({ title: 'SUCESSO', description: 'Registro de compra atualizado.' })
      setEditingPurchase(null)
    } else {
      toast({ variant: 'destructive', title: 'ERRO', description: 'Falha ao atualizar.' })
    }
  }

  return (
    <>
      <div className="border rounded-xl shadow-sm bg-white overflow-hidden mt-2">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-bold text-xs uppercase text-muted-foreground w-32">
                DATA
              </TableHead>
              <TableHead className="font-bold text-xs uppercase text-muted-foreground">
                FORNECEDOR
              </TableHead>
              <TableHead className="font-bold text-xs uppercase text-muted-foreground text-center">
                QTD. COMPRADA (EMB.)
              </TableHead>
              <TableHead className="font-bold text-xs uppercase text-muted-foreground">
                VALOR (EMB)
              </TableHead>
              <TableHead className="font-bold text-xs uppercase text-muted-foreground text-center w-24">
                AÇÕES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!item?.purchaseHistory || item.purchaseHistory.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground uppercase font-semibold text-xs"
                >
                  NENHUMA COMPRA REGISTRADA.
                </TableCell>
              </TableRow>
            ) : (
              item.purchaseHistory.map((ph) => {
                const supplier = suppliers.find((s) => s.id === ph.supplierId)
                return (
                  <TableRow key={ph.id}>
                    <TableCell className="font-medium text-xs">
                      {format(new Date(ph.date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="text-xs font-bold uppercase text-slate-700">
                      {supplier ? supplier.name : 'NÃO INFORMADO'}
                    </TableCell>
                    <TableCell className="text-center font-black text-sm">{ph.quantity}</TableCell>
                    <TableCell className="font-bold text-sm text-emerald-600">
                      {formatCurrency(ph.price)}
                    </TableCell>
                    <TableCell className="text-center">
                      {canEdit ? (
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-blue-600 hover:bg-blue-50"
                            onClick={(e) => {
                              e.preventDefault()
                              setEditingPurchase(ph)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:bg-red-50"
                            onClick={(e) => {
                              e.preventDefault()
                              handleRemovePurchase(ph.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingPurchase} onOpenChange={(val) => !val && setEditingPurchase(null)}>
        <DialogContent className="max-w-md uppercase">
          <DialogHeader>
            <DialogTitle>EDITAR COMPRA</DialogTitle>
          </DialogHeader>
          <Form {...editPurchaseForm}>
            <form
              onSubmit={editPurchaseForm.handleSubmit(onEditPurchaseSubmit)}
              className="space-y-4 pt-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editPurchaseForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>QTD. COMPRADA (EMB.)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="uppercase" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editPurchaseForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VALOR DA EMBALAGEM (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          data-lpignore="true"
                          data-form-type="other"
                          value={formatCurrencyInput(field.value)}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="uppercase"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editPurchaseForm.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FORNECEDOR</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="uppercase">
                          <SelectValue placeholder="SELECIONE" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">NENHUM</SelectItem>
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
              <FormField
                control={editPurchaseForm.control}
                name="nfeNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NÚMERO DA NFE</FormLabel>
                    <FormControl>
                      <Input {...field} className="uppercase" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setEditingPurchase(null)}>
                  CANCELAR
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  SALVAR ALTERAÇÕES
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
