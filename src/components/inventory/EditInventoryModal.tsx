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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useAppStore, { type InventoryItem } from '@/stores/main'
import { formatCurrency } from '@/lib/utils'
import { Package, Calculator, History, ShoppingCart, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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
  const {
    updateInventoryQuantity,
    updateInventoryItemDetails,
    deleteInventoryItem,
    suppliers,
    inventoryOptions,
  } = useAppStore()
  const { toast } = useToast()

  const [manualQty, setManualQty] = useState(item?.quantity || 0)
  const [storageRoom, setStorageRoom] = useState(item?.storageRoom || '')
  const [cabinetNumber, setCabinetNumber] = useState(item?.cabinetNumber || '')

  const storageRooms = inventoryOptions.filter(
    (o) =>
      o.category.toLowerCase() === 'storage_room' ||
      o.category === 'STORAGE_ROOM' ||
      o.category === 'SALA_ARMAZENAMENTO',
  )

  useEffect(() => {
    if (item) {
      setManualQty(item.quantity)
      setStorageRoom(item.storageRoom || '')
      setCabinetNumber(item.cabinetNumber || '')
    }
  }, [item])

  if (!item) return null

  const history = item.purchaseHistory || []
  const recentHistory = history.slice(0, 5)
  const avgPrice = recentHistory.length
    ? recentHistory.reduce((acc, h) => acc + h.price, 0) / recentHistory.length
    : 0

  const handleManualUpdate = async () => {
    if (updateInventoryItemDetails) {
      const res = await updateInventoryItemDetails(item.id, {
        quantity: manualQty,
        storageRoom,
        cabinetNumber,
      })
      if (res.success) {
        toast({ title: 'SUCESSO', description: 'DADOS ATUALIZADOS COM SUCESSO.' })
      } else {
        toast({ variant: 'destructive', title: 'ERRO', description: 'FALHA AO ATUALIZAR DADOS.' })
      }
    } else {
      updateInventoryQuantity(item.id, manualQty)
      toast({ title: 'SUCESSO', description: 'QUANTIDADE ATUALIZADA COM SUCESSO.' })
    }
  }

  const handleDelete = async () => {
    const res = await deleteInventoryItem(item.id)
    if (res.success) {
      toast({
        title: 'SUCESSO',
        description: 'PRODUTO EXCLUÍDO COM SUCESSO',
      })
      onOpenChange(false)
    } else {
      toast({
        variant: 'destructive',
        title: 'ERRO',
        description: 'NÃO FOI POSSÍVEL EXCLUIR O PRODUTO.',
      })
    }
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
            <DialogDescription className="uppercase mt-1 font-bold">
              {item.brand} • {item.specialty || 'SEM ESPECIALIDADE'} • {item.packageType}
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              className="text-destructive hover:bg-destructive/10 -mt-2"
              title="REMOVER PRODUTO"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false)
                setTimeout(onNewPurchase, 300)
              }}
              className="bg-[#D81B84] hover:bg-[#B71770] text-white tracking-widest font-bold h-10"
            >
              <ShoppingCart className="h-4 w-4 mr-2" /> NOVA COMPRA
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Card className="border-l-4 border-l-blue-500 shadow-sm md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-900">
                <Package className="h-4 w-4 text-blue-500" /> ATUALIZAÇÃO DE ESTOQUE E LOCAL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">
                    QTD. EM ESTOQUE
                  </label>
                  <Input
                    type="number"
                    value={manualQty}
                    onChange={(e) => setManualQty(Number(e.target.value))}
                    className="font-black text-lg h-10 uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">
                    SALA ARMAZENAMENTO
                  </label>
                  <Select value={storageRoom} onValueChange={setStorageRoom}>
                    <SelectTrigger className="h-10 uppercase font-bold text-xs">
                      <SelectValue placeholder="SELECIONE..." />
                    </SelectTrigger>
                    <SelectContent>
                      {storageRooms.map((r) => (
                        <SelectItem
                          key={r.id}
                          value={r.value}
                          className="uppercase font-bold text-xs"
                        >
                          {r.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">
                    Nº DO ARMÁRIO
                  </label>
                  <Input
                    value={cabinetNumber}
                    onChange={(e) => setCabinetNumber(e.target.value)}
                    className="font-bold text-sm h-10 uppercase"
                    placeholder="EX: A1"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleManualUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black tracking-widest text-xs"
                >
                  SALVAR ALTERAÇÕES
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 shadow-sm h-full flex flex-col justify-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-900">
                <Calculator className="h-4 w-4 text-emerald-500" /> CUSTO MÉDIO (ÚLT. 5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-emerald-600">{formatCurrency(avgPrice)}</div>
              <p className="text-xs text-muted-foreground mt-1 font-bold">
                REGISTRO ATUAL: {formatCurrency(item.packageCost)}
              </p>
            </CardContent>
          </Card>
        </div>

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
                    <TableHead className="font-bold">LOTE / NFE</TableHead>
                    <TableHead className="text-center font-bold">QTD.</TableHead>
                    <TableHead className="text-right font-bold">VALOR TOTAL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentHistory.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="font-bold text-xs text-muted-foreground">
                        {new Date(h.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-xs font-black">
                        {getSupplierName(h.supplierId)}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-col gap-1 font-bold text-muted-foreground">
                          {h.lot ? (
                            <span className="font-mono bg-muted px-1.5 py-0.5 rounded w-fit text-[10px]">
                              LT: {h.lot}
                            </span>
                          ) : (
                            <span>-</span>
                          )}
                          {h.nfeNumber && <span>NFE: {h.nfeNumber}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-black text-base text-nuvia-navy">
                        {h.quantity}
                      </TableCell>
                      <TableCell className="text-right font-black text-nuvia-navy">
                        {formatCurrency(h.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {recentHistory.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-6 text-muted-foreground font-bold text-xs"
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
      </DialogContent>
    </Dialog>
  )
}
