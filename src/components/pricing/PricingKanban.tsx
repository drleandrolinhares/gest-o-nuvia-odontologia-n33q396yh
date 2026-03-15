import { useState, useMemo } from 'react'
import useAppStore, { PriceItem } from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Filter } from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import { calculateProfitability, getMarginColor } from '@/lib/pricing'
import { PricingEditModal } from './PricingEditModal'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function PricingKanban() {
  const { priceList, appSettings, removePriceItem } = useAppStore()
  const [editingItem, setEditingItem] = useState<PriceItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [filterHigh, setFilterHigh] = useState(true)
  const [filterMedium, setFilterMedium] = useState(true)
  const [filterLow, setFilterLow] = useState(true)

  const filteredItems = useMemo(() => {
    return priceList.filter((item) => {
      const { marginPct } = calculateProfitability(item, appSettings)
      if (marginPct >= 20 && !filterHigh) return false
      if (marginPct >= 10 && marginPct < 20 && !filterMedium) return false
      if (marginPct < 10 && !filterLow) return false
      return true
    })
  }, [priceList, appSettings, filterHigh, filterMedium, filterLow])

  const handleOpenNew = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item: PriceItem) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('TEM CERTEZA QUE DESEJA EXCLUIR ESTE PROCEDIMENTO?')) {
      await removePriceItem(id)
    }
  }

  return (
    <div className="space-y-4 animate-fade-in uppercase">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
            <Filter className="h-4 w-4" /> FILTRAR POR MARGEM:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterHigh(!filterHigh)}
              className={cn(
                'rounded-full h-8 px-4 font-bold border',
                filterHigh
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800'
                  : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50',
              )}
            >
              <div
                className={cn(
                  'w-2 h-2 rounded-full mr-2',
                  filterHigh ? 'bg-emerald-500' : 'bg-slate-300',
                )}
              />
              ALTA (&gt; 20%)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterMedium(!filterMedium)}
              className={cn(
                'rounded-full h-8 px-4 font-bold border',
                filterMedium
                  ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800'
                  : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50',
              )}
            >
              <div
                className={cn(
                  'w-2 h-2 rounded-full mr-2',
                  filterMedium ? 'bg-amber-500' : 'bg-slate-300',
                )}
              />
              MÉDIA (10% a 20%)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterLow(!filterLow)}
              className={cn(
                'rounded-full h-8 px-4 font-bold border',
                filterLow
                  ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800'
                  : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50',
              )}
            >
              <div
                className={cn(
                  'w-2 h-2 rounded-full mr-2',
                  filterLow ? 'bg-red-500' : 'bg-slate-300',
                )}
              />
              BAIXA (&lt; 10%)
            </Button>
          </div>
        </div>
        <Button
          onClick={handleOpenNew}
          className="bg-[#D81B84] hover:bg-[#B71770] text-white font-bold whitespace-nowrap shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" /> NOVO PROCEDIMENTO
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="w-[350px] font-bold text-slate-600">PROCEDIMENTO</TableHead>
                <TableHead className="font-bold text-slate-600">SETOR</TableHead>
                <TableHead className="font-bold text-slate-600 text-right">
                  VALOR VENDA FINAL
                </TableHead>
                <TableHead className="font-bold text-slate-600 text-center">TEMPO EXEC.</TableHead>
                <TableHead className="font-bold text-slate-600 text-center">CUSTO / MIN</TableHead>
                <TableHead className="font-bold text-slate-600 text-right">
                  CUSTO FIXO EST.
                </TableHead>
                <TableHead className="font-bold text-slate-600 text-center w-[100px]">
                  AÇÕES
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const { marginPct, costPerMinute, fixedCost } = calculateProfitability(
                  item,
                  appSettings,
                )
                const marginColor = getMarginColor(marginPct)

                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => handleEdit(item)}
                  >
                    <TableCell className="p-3">
                      <div
                        className={cn(
                          'rounded-xl p-3 flex items-center justify-between shadow-sm transition-transform group-hover:scale-[1.01]',
                          marginColor.bg,
                          marginColor.text,
                        )}
                      >
                        <div className="flex flex-col overflow-hidden pr-4">
                          <span className="font-extrabold text-sm truncate" title={item.work_type}>
                            {item.work_type}
                          </span>
                          <span className="text-[10px] font-bold opacity-90 mt-0.5 truncate">
                            {item.category}
                          </span>
                        </div>
                        <div className="font-black text-lg tracking-tight shrink-0">
                          {marginPct.toFixed(1)}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold tracking-wider text-[10px] uppercase"
                      >
                        {item.sector || 'GERAL'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-black text-slate-800 text-base">
                      {formatCurrency(item.price)}
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-600">
                      {item.execution_time ? `${item.execution_time} min` : '-'}
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-500">
                      {formatCurrency(costPerMinute)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-600">
                      {formatCurrency(fixedCost)}
                    </TableCell>
                    <TableCell className="text-center p-3">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(item)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(item.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-muted-foreground font-bold"
                  >
                    NENHUM PROCEDIMENTO ENCONTRADO PARA ESTES FILTROS.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <PricingEditModal item={editingItem} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}
