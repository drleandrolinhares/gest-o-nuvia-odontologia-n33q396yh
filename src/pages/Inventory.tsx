import { useState, useMemo } from 'react'
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
import { Badge } from '@/components/ui/badge'
import {
  Package,
  Box,
  Stethoscope,
  Tag,
  CalendarClock,
  Search,
  AlertTriangle,
  MinusCircle,
} from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import { AddInventoryModal } from '@/components/inventory/AddInventoryModal'
import { DecreaseStockModal } from '@/components/inventory/DecreaseStockModal'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Inventory() {
  const { inventory, specialties } = useAppStore()
  const [isAdding, setIsAdding] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showLowStock, setShowLowStock] = useState(false)
  const [itemToDecrease, setItemToDecrease] = useState<InventoryItem | null>(null)

  const isCriticalStock = (item: InventoryItem) => {
    // If minStock is 0 or undefined, it's considered "not set" for alerting purposes
    return (item.minStock ?? 0) > 0 && item.quantity <= item.minStock
  }

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchSpecialty = selectedSpecialty === 'all' || item.specialty === selectedSpecialty
      const searchLower = searchQuery.toLowerCase()
      const matchSearch =
        item.name.toLowerCase().includes(searchLower) ||
        !!item.brand?.toLowerCase().includes(searchLower)
      const matchLowStock = showLowStock ? isCriticalStock(item) : true

      return matchSpecialty && matchSearch && matchLowStock
    })
  }, [inventory, selectedSpecialty, searchQuery, showLowStock])

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

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100/80 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
            <Box className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#D81B84]">Estoque</h1>
            <p className="text-muted-foreground mt-1">Gerencie embalagens e custos detalhados.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            className="bg-[#D81B84] hover:bg-[#B71770] text-white whitespace-nowrap"
            onClick={() => setIsAdding(true)}
          >
            + Novo Produto
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/30 p-4 rounded-xl border border-muted">
        <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produto ou marca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Todas Especialidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Especialidades</SelectItem>
              {specialties.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant={showLowStock ? 'destructive' : 'outline'}
          onClick={() => setShowLowStock(!showLowStock)}
          className={cn(
            'w-full sm:w-auto h-10 transition-all duration-200',
            showLowStock
              ? 'bg-red-600 hover:bg-red-700 text-white font-bold shadow-md'
              : 'text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-semibold bg-white shadow-sm',
          )}
        >
          <AlertTriangle
            className={cn('w-4 h-4 mr-2', showLowStock ? 'text-white' : 'text-red-500')}
          />
          Filtrar Estoque Crítico
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-600 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Capital Investido ({selectedSpecialty === 'all' ? 'Total' : selectedSpecialty})
            </p>
            <div className="text-2xl font-extrabold text-blue-600 truncate">
              {formatCurrency(totalCapital)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#D81B84] shadow-sm rounded-xl">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Itens em Estoque ({selectedSpecialty === 'all' ? 'Total' : selectedSpecialty})
            </p>
            <div className="text-2xl font-extrabold text-[#D81B84] truncate">{totalItems}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Especialidade com maior capital
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
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Especialidade com mais itens
            </p>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-emerald-500 truncate">
                {topStats.maxVolSpec}
              </span>
              <span className="text-xs font-medium text-muted-foreground mt-1">
                {topStats.maxVol} itens
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
                Produto / Detalhes
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">
                Embalagem & Itens
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">
                Validade / Local
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">Custo Emb.</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-center">
                Qtd.
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">Capital</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-center">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/10">
                <TableCell className="align-top py-4">
                  <div className="flex items-start flex-col gap-1.5 mb-2">
                    <div className="font-bold text-[#D81B84] text-base leading-none">
                      {item.name}
                    </div>
                    {isCriticalStock(item) && (
                      <div className="bg-red-600 text-white text-[10px] px-2 py-0.5 mt-0.5 rounded font-extrabold tracking-wider uppercase shadow-sm flex items-center w-fit animate-pulse">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Estoque Crítico
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    {item.specialty && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Stethoscope className="h-3.5 w-3.5" /> {item.specialty}
                      </div>
                    )}
                    {item.brand && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" /> Marca: {item.brand}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="align-top py-4">
                  <span className="inline-block px-2.5 py-0.5 border border-muted-foreground/20 rounded-full text-[10px] font-semibold mb-1.5">
                    {item.packageType}
                  </span>
                  <div className="text-xs text-muted-foreground mb-0.5">
                    {item.itemsPerBox} item(s) / emb.
                  </div>
                </TableCell>
                <TableCell className="align-top py-4">
                  <div className="flex flex-col gap-1.5">
                    {item.expirationDate ? (
                      <div className="text-xs text-amber-600 font-medium flex items-center gap-1.5 bg-amber-50 w-fit px-1.5 py-0.5 rounded">
                        <CalendarClock className="h-3.5 w-3.5" /> Val:{' '}
                        {format(new Date(item.expirationDate), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <CalendarClock className="h-3.5 w-3.5" /> Val: N/I
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Package className="h-3.5 w-3.5" /> {item.storageLocation}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="align-middle py-4 font-medium text-muted-foreground">
                  {formatCurrency(item.packageCost)}
                </TableCell>
                <TableCell className="align-middle py-4 text-center">
                  <span
                    className={cn(
                      'inline-flex items-center justify-center min-w-[32px] h-[32px] px-2 rounded-full font-bold text-sm',
                      isCriticalStock(item)
                        ? 'bg-red-100 text-red-700'
                        : 'bg-muted text-foreground',
                    )}
                  >
                    {item.quantity}
                  </span>
                </TableCell>
                <TableCell className="align-middle py-4 font-bold text-muted-foreground">
                  {formatCurrency(item.quantity * item.packageCost)}
                </TableCell>
                <TableCell className="align-middle py-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
                    onClick={() => setItemToDecrease(item)}
                    disabled={item.quantity === 0}
                  >
                    <MinusCircle className="w-3.5 h-3.5 mr-1" />
                    Baixar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredInventory.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <AddInventoryModal open={isAdding} onOpenChange={setIsAdding} />
      <DecreaseStockModal
        item={itemToDecrease}
        open={!!itemToDecrease}
        onOpenChange={(val) => {
          if (!val) setItemToDecrease(null)
        }}
      />
    </div>
  )
}
