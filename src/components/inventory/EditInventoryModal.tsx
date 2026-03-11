import { useState, useEffect } from 'react'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useAppStore, { type InventoryItem } from '@/stores/main'
import { formatCurrency } from '@/lib/utils'
import { Package, Calculator, History } from 'lucide-react'

export function EditInventoryModal({
  item,
  open,
  onOpenChange,
}: {
  item: InventoryItem | null
  open: boolean
  onOpenChange: (val: boolean) => void
}) {
  const { updateInventoryQuantity, addPurchaseHistory, isAdmin } = useAppStore()

  const [manualQty, setManualQty] = useState(item?.quantity || 0)
  const [newQty, setNewQty] = useState('')
  const [newPrice, setNewPrice] = useState('')

  useEffect(() => {
    if (item) setManualQty(item.quantity)
  }, [item])

  if (!item) return null

  const history = item.purchaseHistory || []
  const recentHistory = history.slice(0, 5)
  const avgPrice = recentHistory.length
    ? recentHistory.reduce((acc, h) => acc + h.price, 0) / recentHistory.length
    : 0

  const handleManualUpdate = () => {
    updateInventoryQuantity(item.id, manualQty)
  }

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault()
    if (newQty && newPrice) {
      addPurchaseHistory(item.id, {
        date: new Date().toISOString(),
        price: Number(newPrice),
        quantity: Number(newQty),
      })
      setNewQty('')
      setNewPrice('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#D81B84]">{item.name}</DialogTitle>
          <DialogDescription>
            {item.brand} • {item.specialty || 'Sem Especialidade'} • {item.packageType}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-500" /> ATUALIZAÇÃO MANUAL (ADMIN)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAdmin ? (
                <div className="flex items-end gap-3">
                  <div className="space-y-1 flex-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      QUANTIDADE EM ESTOQUE
                    </label>
                    <Input
                      type="number"
                      value={manualQty}
                      onChange={(e) => setManualQty(Number(e.target.value))}
                      className="font-bold text-lg h-12"
                    />
                  </div>
                  <Button
                    onClick={handleManualUpdate}
                    className="h-12 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    SALVAR
                  </Button>
                </div>
              ) : (
                <div className="text-2xl font-black text-blue-600">{item.quantity} UNIDADES</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Calculator className="h-4 w-4 text-emerald-500" /> PREÇO MÉDIO DAS ÚLTIMAS 5
                COMPRAS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-emerald-600">{formatCurrency(avgPrice)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                CUSTO ATUAL REGISTRADO: {formatCurrency(item.packageCost)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 border-t pt-6 space-y-6">
          <div className="bg-muted/30 p-5 rounded-xl border border-muted">
            <h4 className="font-bold text-sm mb-4">REGISTRAR NOVA COMPRA</h4>
            <form onSubmit={handleAddPurchase} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="number"
                placeholder="QTD COMPRADA"
                value={newQty}
                onChange={(e) => setNewQty(e.target.value)}
                required
                min={1}
                className="bg-white"
              />
              <Input
                type="number"
                step="0.01"
                placeholder="VALOR TOTAL PAGO (R$)"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                required
                min={0}
                className="bg-white"
              />
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap"
              >
                ADICIONAR AO HISTÓRICO
              </Button>
            </form>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
              <History className="h-4 w-4" /> HISTÓRICO DE COMPRAS (ÚLTIMAS 5)
            </h4>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>DATA DA COMPRA</TableHead>
                    <TableHead className="text-center">QTD ADICIONADA</TableHead>
                    <TableHead className="text-right">VALOR UNITÁRIO (R$)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentHistory.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="font-medium">
                        {new Date(h.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-center font-bold">{h.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(h.price)}</TableCell>
                    </TableRow>
                  ))}
                  {recentHistory.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                        NENHUM REGISTRO DE COMPRA ENCONTRADO.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
