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
import { Package, Calculator, History, ShoppingCart, Trash2 } from 'lucide-react'

export function EditInventoryModal({
  item,
  open,
  onOpenChange,
  onNewPurchase,
}: {
  item: InventoryItem | null
  open: boolean
  onOpenChange: (val: boolean) => void
  onNewPurchase: () => void
}) {
  const { updateInventoryQuantity, deleteInventoryItem, isAdmin, can, suppliers } = useAppStore()

  const [manualQty, setManualQty] = useState(item?.quantity || 0)

  const canMove = isAdmin || can('estoque', 'registrar_movimentacao')
  const canViewCosts = isAdmin || can('estoque', 'visualizar_custos')
  const canDelete = isAdmin || can('estoque', 'remover_item')

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

  const handleDelete = () => {
    deleteInventoryItem(item.id)
    onOpenChange(false)
  }

  const getSupplierName = (id?: string) => {
    if (!id) return '-'
    const s = suppliers.find((sup) => sup.id === id)
    return s ? s.name : '-'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto uppercase">
        <DialogHeader className="flex flex-row items-start justify-between pr-8">
          <div>
            <DialogTitle className="text-2xl font-bold text-[#D81B84]">{item.name}</DialogTitle>
            <DialogDescription className="uppercase mt-1">
              {item.brand} • {item.specialty || 'SEM ESPECIALIDADE'} • {item.packageType}
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            {canDelete && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleDelete}
                className="text-destructive hover:bg-destructive/10 -mt-2"
                title="REMOVER PRODUTO"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
            {canMove && (
              <Button
                onClick={() => {
                  onOpenChange(false)
                  setTimeout(onNewPurchase, 300)
                }}
                className="bg-[#D81B84] hover:bg-[#B71770] text-white tracking-widest font-bold h-10"
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> NOVA COMPRA
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-500" /> ATUALIZAÇÃO MANUAL (ADMIN/EDICAO)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAdmin || can('estoque', 'editar_item') ? (
                <div className="flex items-end gap-3">
                  <div className="space-y-1 flex-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      QUANTIDADE EM ESTOQUE
                    </label>
                    <Input
                      type="number"
                      value={manualQty}
                      onChange={(e) => setManualQty(Number(e.target.value))}
                      className="font-bold text-lg h-12 uppercase"
                    />
                  </div>
                  <Button
                    onClick={handleManualUpdate}
                    className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    SALVAR
                  </Button>
                </div>
              ) : (
                <div className="text-2xl font-black text-blue-600">{item.quantity} UNIDADES</div>
              )}
            </CardContent>
          </Card>

          {canViewCosts && (
            <Card className="border-l-4 border-l-emerald-500 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-emerald-500" /> PREÇO MÉDIO DAS ÚLTIMAS 5
                  COMPRAS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-emerald-600">
                  {formatCurrency(avgPrice)}
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-bold">
                  CUSTO ATUAL REGISTRADO: {formatCurrency(item.packageCost)}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {canViewCosts && (
          <div className="mt-6 border-t pt-6 space-y-6">
            <div>
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-nuvia-navy">
                <History className="h-4 w-4" /> HISTÓRICO DE COMPRAS (ÚLTIMAS 5)
              </h4>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-bold">DATA</TableHead>
                      <TableHead className="font-bold">FORNECEDOR</TableHead>
                      <TableHead className="font-bold">LOTE / VALIDADE</TableHead>
                      <TableHead className="text-center font-bold">QTD.</TableHead>
                      <TableHead className="text-right font-bold">VALOR TOTAL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentHistory.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell className="font-medium text-xs">
                          {new Date(h.date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-muted-foreground">
                          {getSupplierName(h.supplierId)}
                        </TableCell>
                        <TableCell className="text-xs">
                          {h.lot ? (
                            <span className="font-mono bg-muted px-1 py-0.5 rounded">{h.lot}</span>
                          ) : (
                            '-'
                          )}
                          {h.expirationDate && (
                            <div className="text-orange-600 mt-1">
                              VAL: {new Date(h.expirationDate).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-black text-base">
                          {h.quantity}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(h.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {recentHistory.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-6 text-muted-foreground font-bold"
                        >
                          NENHUM REGISTRO DE COMPRA ENCONTRADO.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
