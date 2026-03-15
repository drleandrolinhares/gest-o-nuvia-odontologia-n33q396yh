import { useState, useMemo } from 'react'
import useAppStore, { PriceItem } from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Plus, Search, Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { calculateProfitability, getMarginColor } from '@/lib/pricing'
import { PricingEditModal } from './PricingEditModal'

export function PricingKanban() {
  const { priceList, appSettings } = useAppStore()
  const [search, setSearch] = useState('')
  const [editingItem, setEditingItem] = useState<PriceItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredItems = useMemo(() => {
    return priceList.filter((item) => item.work_type.toLowerCase().includes(search.toLowerCase()))
  }, [priceList, search])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(filteredItems.map((i) => i.category || 'GERAL')))
    return cats.sort()
  }, [filteredItems])

  const handleOpenNew = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item: PriceItem) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-4 animate-fade-in uppercase h-[calc(100vh-14rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-muted/20 p-3 rounded-xl border border-muted">
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="BUSCAR SERVIÇO..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <Button onClick={handleOpenNew} className="bg-primary text-primary-foreground font-bold">
          <Plus className="h-4 w-4 mr-2" /> NOVO SERVIÇO
        </Button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
        <div className="flex h-full gap-6 px-1 min-w-max">
          {categories.map((cat) => {
            const items = filteredItems.filter((i) => (i.category || 'GERAL') === cat)
            return (
              <div
                key={cat}
                className="w-[320px] shrink-0 flex flex-col bg-slate-100/50 rounded-xl border p-3 h-full"
              >
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-extrabold text-sm text-nuvia-navy tracking-widest">{cat}</h3>
                  <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {items.map((item) => {
                    const { marginPct } = calculateProfitability(item, appSettings)
                    const colors = getMarginColor(marginPct)

                    return (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-lg border shadow-sm cursor-pointer hover:shadow-md hover:border-primary/40 transition-all group"
                        onClick={() => handleEdit(item)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-sm text-slate-800 leading-tight pr-2">
                            {item.work_type}
                          </h4>
                          <Info className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors shrink-0" />
                        </div>
                        <div className="flex items-end justify-between mt-4">
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground mb-0.5">
                              PREÇO BASE
                            </p>
                            <p className="font-black text-primary text-base">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          <div
                            className={`px-2 py-1 rounded text-[10px] font-black tracking-wider border ${colors.bg} ${colors.text} ${colors.border}`}
                          >
                            MARGEM: {marginPct.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {categories.length === 0 && (
            <div className="w-full flex items-center justify-center text-muted-foreground font-bold tracking-widest border-2 border-dashed rounded-xl border-muted">
              NENHUM SERVIÇO CADASTRADO OU ENCONTRADO.
            </div>
          )}
        </div>
      </div>

      <PricingEditModal item={editingItem} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}
