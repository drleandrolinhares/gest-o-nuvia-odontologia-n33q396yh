import React, { useState, useMemo } from 'react'
import useAppStore, { type InventoryItem } from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  Package,
  Box,
  MapPin,
  Stethoscope,
  CalendarClock,
  Search,
  AlertTriangle,
  MinusCircle,
  ScanBarcode,
  Barcode,
  ChevronRight,
  ChevronDown,
  CornerDownRight,
  Trash2,
} from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import { AddInventoryModal } from '@/components/inventory/AddInventoryModal'
import { DecreaseStockModal } from '@/components/inventory/DecreaseStockModal'
import { EditInventoryModal } from '@/components/inventory/EditInventoryModal'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function Inventory() {
  const { inventory, specialties, isAdmin, deleteInventoryItem } = useAppStore()
  const { toast } = useToast()

  const [isAdding, setIsAdding] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [barcodeQuery, setBarcodeQuery] = useState('')
  const [showLowStock, setShowLowStock] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])

  const [itemToDecrease, setItemToDecrease] = useState<InventoryItem | null>(null)
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null)

  const [purchaseBaseItemName, setPurchaseBaseItemName] = useState<string>('')

  const confirmDelete = async () => {
    if (!itemToDelete) return
    const res = await deleteInventoryItem(itemToDelete.id)
    if (res.success) {
      toast({
        title: 'SUCESSO',
        description: 'PRODUTO EXCLUÍDO COM SUCESSO',
      })
    } else {
      toast({
        variant: 'destructive',
        title: 'ERRO',
        description: 'NÃO FOI POSSÍVEL EXCLUIR O PRODUTO.',
      })
    }
    setItemToDelete(null)
  }

  const isCriticalStock = (item: InventoryItem) => {
    return (item.minStock ?? 0) > 0 && item.quantity <= item.minStock
  }

  const now = new Date()
  const sixtyDays = new Date()
  sixtyDays.setDate(now.getDate() + 60)

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchSpecialty = selectedSpecialty === 'all' || item.specialty === selectedSpecialty
      const searchLower = searchQuery.toLowerCase()
      const matchSearch =
        item.name.toLowerCase().includes(searchLower) ||
        !!item.brand?.toLowerCase().includes(searchLower)
      const matchBarcode = !barcodeQuery || (item.barcode && item.barcode.includes(barcodeQuery))
      const matchLowStock = showLowStock ? isCriticalStock(item) : true

      return matchSpecialty && matchSearch && matchLowStock && matchBarcode
    })
  }, [inventory, selectedSpecialty, searchQuery, barcodeQuery, showLowStock])

  const groupedInventory = useMemo(() => {
    const groups: Record<string, InventoryItem[]> = {}
    filteredInventory.forEach((item) => {
      const key = item.name.toUpperCase()
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    })

    return Object.entries(groups)
      .map(([name, items]) => {
        const totalQuantity = items.reduce((acc, i) => acc + i.quantity, 0)
        const isCritical = items.some((i) => isCriticalStock(i))
        const hasCriticalObservations = items.some(
          (i) => i.criticalObservations && i.criticalObservations.trim() !== '',
        )
        const totalValue = items.reduce((acc, i) => acc + i.quantity * i.packageCost, 0)
        return {
          name,
          items: items.sort((a, b) => (a.brand || '').localeCompare(b.brand || '')),
          totalQuantity,
          totalValue,
          isCritical,
          hasCriticalObservations,
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [filteredInventory])

  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    )
  }

  const totalCapital = filteredInventory.reduce(
    (acc, item) => acc + item.quantity * item.packageCost,
    0,
  )
  const totalItems = filteredInventory.reduce((acc, item) => acc + item.quantity, 0)

  const topStats = useMemo(() => {
    const volBySpec: Record<string, number> = {}
    const valBySpec: Record<string, number> = {}
    inventory.forEach((i) => {
      if (!i.specialty) return
      volBySpec[i.specialty] = (volBySpec[i.specialty] || 0) + i.quantity
      valBySpec[i.specialty] = (valBySpec[i.specialty] || 0) + i.quantity * i.packageCost
    })
    const topVol = Object.entries(volBySpec).sort((a, b) => b[1] - a[1])[0] || ['N/A', 0]
    const topVal = Object.entries(valBySpec).sort((a, b) => b[1] - a[1])[0] || ['N/A', 0]
    return { maxVolSpec: topVol[0], maxVol: topVol[1], maxValSpec: topVal[0], maxVal: topVal[1] }
  }, [inventory])

  const formatSpecs = (item: InventoryItem) => {
    const specs = []
    if (item.brand) specs.push(item.brand)
    if (item.specialtyDetails) {
      const sd = item.specialtyDetails
      if (sd.implantBrand) specs.push(sd.implantBrand)
      if (sd.implantDiameter) specs.push(`Ø ${sd.implantDiameter}`)
      if (sd.implantHeight) specs.push(`ALT ${sd.implantHeight}`)
      if (sd.prostheticType) specs.push(sd.prostheticType)
      if (sd.prostheticAngle) specs.push(sd.prostheticAngle)
      if (sd.prostheticCollarHeight) specs.push(`CINTA ${sd.prostheticCollarHeight}`)
      if (sd.prostheticDiameter) specs.push(`Ø ${sd.prostheticDiameter}`)
      if (sd.prostheticHeight) specs.push(`ALT ${sd.prostheticHeight}`)
    }
    return specs.join(' • ') || 'SEM ESPECIFICAÇÕES'
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-10 uppercase">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100/80 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
            <Box className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#D81B84]">ESTOQUE</h1>
            <p className="text-muted-foreground mt-1">GERENCIE EMBALAGENS, CÓDIGOS E LOTES.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            className="bg-[#D81B84] hover:bg-[#B71770] text-white whitespace-nowrap shadow-sm font-bold"
            onClick={() => setIsAdding(true)}
          >
            + NOVO PRODUTO
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-muted/30 p-4 rounded-xl border border-muted">
        <div className="relative col-span-1 lg:col-span-3">
          <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D81B84]" />
          <Input
            placeholder="CÓDIGO DE BARRAS..."
            value={barcodeQuery}
            onChange={(e) => setBarcodeQuery(e.target.value)}
            className="pl-9 bg-white border-[#D81B84]/40 focus-visible:ring-[#D81B84] text-sm font-bold tracking-wider"
          />
        </div>

        <div className="relative col-span-1 lg:col-span-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="BUSCAR NOME OU MARCA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>

        <div className="col-span-1 lg:col-span-2">
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="ESPECIALIDADES" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">TODAS</SelectItem>
              {specialties.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1 lg:col-span-3 flex justify-end">
          <Button
            variant={showLowStock ? 'destructive' : 'outline'}
            onClick={() => setShowLowStock(!showLowStock)}
            className={cn(
              'w-full h-10 transition-all duration-200',
              showLowStock
                ? 'bg-red-600 hover:bg-red-700 text-white font-bold shadow-md'
                : 'text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-semibold bg-white shadow-sm',
            )}
          >
            <AlertTriangle
              className={cn('w-4 h-4 mr-2', showLowStock ? 'text-white' : 'text-red-500')}
            />{' '}
            ESTOQUE CRÍTICO
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-600 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-muted-foreground tracking-wider mb-2">
              CAPITAL INVESTIDO ({selectedSpecialty === 'all' ? 'TOTAL' : selectedSpecialty})
            </p>
            <div className="text-2xl font-extrabold text-blue-600 truncate">
              {formatCurrency(totalCapital)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#D81B84] shadow-sm rounded-xl">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-muted-foreground tracking-wider mb-2">
              ITENS EM ESTOQUE ({selectedSpecialty === 'all' ? 'TOTAL' : selectedSpecialty})
            </p>
            <div className="text-2xl font-extrabold text-[#D81B84] truncate">{totalItems}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-muted-foreground tracking-wider mb-2">
              ESPECIALIDADE (MAIOR CAPITAL)
            </p>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-amber-500 truncate">
                {topStats.maxValSpec}
              </span>
              <span className="text-xs font-medium text-muted-foreground mt-1">
                {formatCurrency(topStats.maxVal)}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-muted-foreground tracking-wider mb-2">
              ESPECIALIDADE (MAIOR VOLUME)
            </p>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-emerald-500 truncate">
                {topStats.maxVolSpec}
              </span>
              <span className="text-xs font-medium text-muted-foreground mt-1">
                {topStats.maxVol} ITENS
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-muted rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold text-muted-foreground">
                PRODUTO / DETALHES
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">
                EMBALAGEM & SALA
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">VALIDADE / LOTE</TableHead>
              <TableHead className="font-semibold text-muted-foreground">CUSTO</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-center">
                QTD. TOTAL
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground text-center">
                AÇÕES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedInventory.map((group) => {
              const isExpanded = expandedGroups.includes(group.name)

              return (
                <React.Fragment key={group.name}>
                  <TableRow
                    className="hover:bg-muted/10 cursor-pointer transition-colors border-b-2 bg-slate-50/50"
                    onClick={() => toggleGroup(group.name)}
                  >
                    <TableCell className="py-4 font-black text-[#D81B84] text-base uppercase">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                        {group.hasCriticalObservations && (
                          <AlertTriangle
                            className="w-6 h-6 text-amber-500 fill-amber-100 flex-shrink-0 drop-shadow-sm"
                            title="CONTÉM OBSERVAÇÕES CRÍTICAS"
                          />
                        )}
                        {group.name}
                        {group.isCritical && (
                          <span className="ml-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-extrabold tracking-wider uppercase shadow-sm flex items-center animate-pulse">
                            <AlertTriangle className="w-3 h-3 mr-1" /> CRÍTICO
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-xs font-bold text-muted-foreground">
                      {group.items.length} VARIAÇÕES
                    </TableCell>
                    <TableCell className="py-4"></TableCell>
                    <TableCell className="py-4 font-bold text-muted-foreground">
                      {formatCurrency(group.totalValue)}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[32px] h-[32px] px-2 rounded-full font-bold text-sm bg-blue-100 text-blue-700">
                        {group.totalQuantity}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-center"></TableCell>
                  </TableRow>

                  {isExpanded &&
                    group.items.map((item) => {
                      const expDate = item.expirationDate ? new Date(item.expirationDate) : null
                      const isExpired = expDate && expDate < now
                      const isExpiringSoon = expDate && expDate >= now && expDate <= sixtyDays

                      return (
                        <TableRow
                          key={item.id}
                          className="hover:bg-muted/10 cursor-pointer transition-colors bg-white"
                          onClick={() => setItemToEdit(item)}
                        >
                          <TableCell className="align-top py-4 pl-10">
                            <div className="flex flex-col gap-1.5 mb-2">
                              <div className="font-bold text-nuvia-navy text-xs leading-none uppercase flex items-center gap-2">
                                <CornerDownRight className="w-3.5 h-3.5 text-muted-foreground" />
                                {item.criticalObservations &&
                                  item.criticalObservations.trim() !== '' && (
                                    <AlertTriangle
                                      className="w-5 h-5 text-amber-500 fill-amber-100 flex-shrink-0 drop-shadow-sm"
                                      title={`OBSERVAÇÕES CRÍTICAS: ${item.criticalObservations}`}
                                    />
                                  )}
                                {formatSpecs(item)}
                              </div>
                              {isCriticalStock(item) && (
                                <div className="text-red-600 text-[10px] font-extrabold tracking-wider uppercase flex items-center w-fit ml-5">
                                  ESTOQUE CRÍTICO
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 mt-2 ml-5">
                              {item.barcode && (
                                <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase">
                                  <Barcode className="h-3 w-3" /> CÓD: {item.barcode}
                                </div>
                              )}
                              {item.specialty && (
                                <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase mt-0.5">
                                  <Stethoscope className="h-3 w-3" /> {item.specialty}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="align-top py-4">
                            <span className="inline-block px-2 py-0.5 bg-muted rounded-md text-[10px] font-bold mb-1.5 uppercase">
                              {item.packageType}
                            </span>
                            <div className="text-xs font-semibold text-muted-foreground mb-0.5 uppercase">
                              {item.itemsPerBox} ITENS / EMB.
                            </div>
                            <div className="text-[10px] font-bold text-blue-700 flex flex-col gap-1 mt-2 bg-blue-50 px-2 py-1.5 rounded w-fit">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3" /> SALA:{' '}
                                {item.storageRoom || 'NÃO INF.'}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Box className="w-3 h-3" /> ARMÁRIO:{' '}
                                {item.cabinetNumber || 'NÃO INF.'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="align-top py-4">
                            <div className="flex flex-col gap-1.5 uppercase">
                              {item.expirationDate ? (
                                <div
                                  className={cn(
                                    'text-[10px] font-bold flex items-center gap-1.5 w-fit px-2 py-0.5 rounded',
                                    isExpired
                                      ? 'bg-red-100 text-red-700'
                                      : isExpiringSoon
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'bg-emerald-50 text-emerald-700',
                                  )}
                                >
                                  <CalendarClock className="h-3.5 w-3.5" /> VAL:{' '}
                                  {format(new Date(item.expirationDate), 'dd/MM/yyyy', {
                                    locale: ptBR,
                                  })}
                                  {isExpired && ' (VENCIDO)'}
                                  {isExpiringSoon && ' (ATENÇÃO)'}
                                </div>
                              ) : (
                                <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                                  <CalendarClock className="h-3 w-3" /> VAL: N/I
                                </div>
                              )}
                              <div className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5 mt-1">
                                <Package className="h-3 w-3" /> NFE:{' '}
                                {item.nfeNumber || 'NÃO INFORMADA'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="align-middle py-4 font-bold text-muted-foreground uppercase text-xs">
                            {formatCurrency(item.packageCost)}
                          </TableCell>
                          <TableCell className="align-middle py-4 text-center">
                            <span
                              className={cn(
                                'inline-flex items-center justify-center min-w-[28px] h-[28px] px-2 rounded-full font-black text-xs uppercase',
                                isCriticalStock(item)
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-slate-100 text-slate-700',
                              )}
                            >
                              {item.quantity}
                            </span>
                          </TableCell>
                          <TableCell
                            className="align-middle py-4 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-[10px] text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors uppercase font-bold"
                                onClick={() => setItemToDecrease(item)}
                                disabled={item.quantity === 0}
                              >
                                <MinusCircle className="w-3 h-3 mr-1" /> BAIXAR
                              </Button>
                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setItemToDelete(item)
                                  }}
                                  title="EXCLUIR"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </React.Fragment>
              )
            })}

            {groupedInventory.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground uppercase"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Package className="h-10 w-10 text-muted-foreground/30" />
                    <span className="font-semibold text-muted-foreground">
                      NENHUM PRODUTO ENCONTRADO OU ESTOQUE VAZIO.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <AddInventoryModal
        open={isAdding}
        onOpenChange={(val) => {
          setIsAdding(val)
          if (!val) setPurchaseBaseItemName('')
        }}
        baseItemName={purchaseBaseItemName}
      />
      <DecreaseStockModal
        item={itemToDecrease}
        open={!!itemToDecrease}
        onOpenChange={(val) => {
          if (!val) setItemToDecrease(null)
        }}
      />
      <EditInventoryModal
        item={itemToEdit}
        open={!!itemToEdit}
        onOpenChange={(val) => {
          if (!val) setItemToEdit(null)
        }}
        onNewPurchase={() => {
          setPurchaseBaseItemName(itemToEdit?.name || '')
          setIsAdding(true)
        }}
      />

      <AlertDialog open={!!itemToDelete} onOpenChange={(val) => !val && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="uppercase">EXCLUIR PRODUTO</AlertDialogTitle>
            <AlertDialogDescription className="uppercase font-bold text-red-600">
              TEM CERTEZA QUE DESEJA EXCLUIR ESTE ITEM DO ESTOQUE?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="uppercase">CANCELAR</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white uppercase font-bold"
            >
              EXCLUIR
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
