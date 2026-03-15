import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { FixedExpenseDetail } from '@/stores/main'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type ExpenseDetailsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  expenseLabel: string
  details: FixedExpenseDetail[]
  onSave: (details: FixedExpenseDetail[], total: number) => void
}

export function ExpenseDetailsModal({
  open,
  onOpenChange,
  expenseLabel,
  details,
  onSave,
}: ExpenseDetailsModalProps) {
  const [items, setItems] = useState<FixedExpenseDetail[]>([])

  useEffect(() => {
    if (open) {
      setItems(details || [])
    }
  }, [open, details])

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), description: '', amount: 0 }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id))
  }

  const updateItem = (id: string, field: keyof FixedExpenseDetail, value: string | number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  const total = items.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)

  const handleSave = () => {
    onSave(items, total)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <div className="p-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle className="uppercase flex items-center gap-2">
              DETALHES DE: <span className="text-primary">{expenseLabel || 'NOVA DESPESA'}</span>
            </DialogTitle>
            <DialogDescription className="uppercase font-semibold">
              DETALHE OS SUB-ITENS QUE COMPÕEM ESTE CUSTO. O VALOR TOTAL SERÁ ATUALIZADO
              AUTOMATICAMENTE.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold text-slate-600">DESCRIÇÃO</TableHead>
                  <TableHead className="font-bold text-slate-600 w-[200px]">VALOR (R$)</TableHead>
                  <TableHead className="w-[80px] text-center">AÇÕES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50">
                    <TableCell className="p-3 align-top">
                      <Input
                        placeholder="DESCRIÇÃO (EX: COLAB 1)"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="bg-white shadow-sm border-slate-200"
                      />
                    </TableCell>
                    <TableCell className="p-3 align-top">
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={item.amount || ''}
                          onChange={(e) => updateItem(item.id, 'amount', e.target.value)}
                          className="pl-9 bg-white font-medium shadow-sm border-slate-200"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="p-3 text-center align-top">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-10 w-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-12 text-muted-foreground font-bold"
                    >
                      NENHUM SUB-ITEM ADICIONADO. CLIQUE ABAIXO PARA DETALHAR.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={addItem}
              className="w-full border-dashed border-2 h-12 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" /> ADICIONAR ITEM
            </Button>
          </div>
        </div>

        <div className="p-6 border-t bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center sm:items-start w-full sm:w-auto bg-slate-50 px-6 py-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-1">
                SOMA TOTAL
              </span>
              <span className="text-2xl font-black text-primary tracking-tight">
                {formatCurrency(total)}
              </span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => onOpenChange(false)}
              >
                CANCELAR
              </Button>
              <Button onClick={handleSave} className="font-bold w-full sm:w-auto shadow-md">
                CONFIRMAR VALOR
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
