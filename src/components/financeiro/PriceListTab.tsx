import { useState, useMemo } from 'react'
import useAppStore, { PriceList } from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Edit2, Trash2, ArrowUpRight } from 'lucide-react'
import { calculateProfitability, getMarginColorHex } from '@/lib/finance'
import { formatCurrency } from '@/lib/utils'
import { PriceListModal } from './PriceListModal'
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
import { useToast } from '@/hooks/use-toast'

export function PriceListTab() {
  const { priceList, appSettings, deletePriceList } = useAppStore()
  const { toast } = useToast()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<PriceList | null>(null)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const filteredList = useMemo(() => {
    return priceList.filter(
      (item) =>
        item.work_type.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()),
    )
  }, [priceList, search])

  const groupedList = useMemo(() => {
    const groups: Record<string, PriceList[]> = {}
    filteredList.forEach((item) => {
      const cat = item.category || 'GERAL'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(item)
    })
    return groups
  }, [filteredList])

  const handleEdit = (item: PriceList) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  const handleAddNew = () => {
    setSelectedItem(null)
    setModalOpen(true)
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      const res = await deletePriceList(itemToDelete)
      if (res.success) {
        toast({ title: 'SUCESSO', description: 'ITEM REMOVIDO DA TABELA.' })
      } else {
        toast({ variant: 'destructive', title: 'ERRO', description: 'FALHA AO REMOVER.' })
      }
      setItemToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative w-full sm:w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="BUSCAR POR SERVIÇO OU CATEGORIA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-50"
          />
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md whitespace-nowrap w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" /> NOVO SERVIÇO
        </Button>
      </div>

      <div className="flex overflow-x-auto pb-6 gap-6 scrollbar-hide items-start">
        {Object.entries(groupedList)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([category, items]) => (
            <div
              key={category}
              className="flex-shrink-0 w-[340px] bg-slate-100/50 rounded-xl border p-3 flex flex-col h-full max-h-[70vh]"
            >
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-black text-nuvia-navy uppercase tracking-widest text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  {category}
                </h3>
                <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {items.length} ITENS
                </span>
              </div>

              <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                {items.map((item) => {
                  const stats = calculateProfitability(item, appSettings)
                  const marginColor = getMarginColorHex(stats.margin)

                  return (
                    <Card
                      key={item.id}
                      className="border-l-4 shadow-sm hover:shadow-md transition-all group bg-white cursor-pointer"
                      style={{ borderLeftColor: marginColor }}
                      onClick={() => handleEdit(item)}
                    >
                      <CardContent className="p-4 relative">
                        <div className="flex justify-between items-start mb-2 pr-8">
                          <h4
                            className="font-extrabold text-sm text-slate-800 leading-tight uppercase line-clamp-2"
                            title={item.work_type}
                          >
                            {item.work_type}
                          </h4>
                          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(item)
                              }}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation()
                                setItemToDelete(item.id)
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">
                              PREÇO
                            </p>
                            <p className="text-sm font-black text-emerald-700">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">
                              MARGEM
                            </p>
                            <p
                              className="text-sm font-black flex items-center justify-end gap-1"
                              style={{ color: marginColor }}
                            >
                              {stats.margin.toFixed(1)}% <ArrowUpRight className="h-3 w-3" />
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}

        {Object.keys(groupedList).length === 0 && (
          <div className="w-full text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-white/50 flex flex-col items-center">
            <Search className="h-10 w-10 text-slate-300 mb-3" />
            <p className="font-bold text-sm tracking-widest uppercase">
              NENHUM SERVIÇO ENCONTRADO NA TABELA DE PREÇOS.
            </p>
          </div>
        )}
      </div>

      <PriceListModal open={modalOpen} onOpenChange={setModalOpen} item={selectedItem} />

      <AlertDialog open={!!itemToDelete} onOpenChange={(v) => !v && setItemToDelete(null)}>
        <AlertDialogContent className="uppercase">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-nuvia-navy">
              EXCLUIR SERVIÇO?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-bold text-red-600">
              TEM CERTEZA QUE DESEJA REMOVER ESTE ITEM DA TABELA DE PREÇOS?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bold">CANCELAR</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              EXCLUIR
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
