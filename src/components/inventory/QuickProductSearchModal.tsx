import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import useAppStore, { type InventoryItem } from '@/stores/main'
import { formatCurrency, cn } from '@/lib/utils'
import {
  Search,
  Package,
  Box,
  MapPin,
  CalendarClock,
  Tag,
  Barcode,
  Factory,
  ClipboardList,
  Zap,
  AlertTriangle,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function DetailItem({
  label,
  value,
  icon: Icon,
  valueClass,
}: {
  label: string
  value: string
  icon?: any
  valueClass?: string
}) {
  return (
    <div className="flex flex-col gap-1 bg-muted/20 p-3 rounded-lg border border-muted/50">
      <span className="text-[10px] font-black text-muted-foreground flex items-center gap-1.5 uppercase tracking-widest">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </span>
      <span className={cn('text-sm font-bold uppercase truncate', valueClass)} title={value}>
        {value}
      </span>
    </div>
  )
}

export function QuickProductSearchModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (val: boolean) => void
}) {
  const { inventory, suppliers } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null)

  const filteredInventory = useMemo(() => {
    if (!searchTerm) return []
    const lower = searchTerm.toLowerCase()
    return inventory
      .filter(
        (item) =>
          item.name.toLowerCase().includes(lower) ||
          (item.barcode && item.barcode.includes(lower)) ||
          (item.brand && item.brand.toLowerCase().includes(lower)),
      )
      .slice(0, 5)
  }, [searchTerm, inventory])

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setTimeout(() => {
        setSearchTerm('')
        setSelectedProduct(null)
      }, 200)
    }
    onOpenChange(val)
  }

  const getSupplierName = (item: InventoryItem) => {
    if (!item.purchaseHistory || item.purchaseHistory.length === 0) return 'NÃO REGISTRADO'
    const lastPurchase = item.purchaseHistory[0]
    if (!lastPurchase.supplierId) return 'NÃO REGISTRADO'
    const supplier = suppliers.find((s) => s.id === lastPurchase.supplierId)
    return supplier ? supplier.name : 'NÃO REGISTRADO'
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'NÃO INFORMADO'
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: ptBR })
    } catch {
      return 'DATA INVÁLIDA'
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl uppercase gap-0 p-0 overflow-hidden bg-background">
        <div className="p-6 pb-4 border-b bg-muted/10">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-black text-nuvia-navy flex items-center gap-2">
              <Search className="w-5 h-5 text-[#D81B84]" />
              CONSULTA RÁPIDA DE PRODUTOS
            </DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase tracking-wider">
              BUSQUE POR NOME, MARCA OU CÓDIGO DE BARRAS
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D81B84] font-bold" />
            <Input
              autoFocus
              placeholder="DIGITE PARA BUSCAR..."
              className="pl-9 h-12 text-sm font-bold bg-white uppercase border-[#D81B84]/30 focus-visible:ring-[#D81B84]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                if (selectedProduct) setSelectedProduct(null)
              }}
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-muted/5 min-h-[300px] max-h-[65vh] overflow-y-auto">
          {!selectedProduct && searchTerm && (
            <div className="space-y-2 animate-fade-in">
              {filteredInventory.map((item) => (
                <button
                  key={item.id}
                  className="w-full text-left p-4 bg-white border rounded-xl hover:border-[#D81B84] hover:shadow-md transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                  onClick={() => setSelectedProduct(item)}
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="font-black text-base text-foreground uppercase truncate flex items-center gap-2">
                      {item.criticalObservations && item.criticalObservations.trim() !== '' && (
                        <AlertTriangle
                          className="w-5 h-5 text-amber-500 fill-amber-100 flex-shrink-0 drop-shadow-sm"
                          title="OBSERVAÇÃO CRÍTICA"
                        />
                      )}
                      {item.name}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 mt-1 truncate">
                      <Tag className="w-3 h-3 flex-shrink-0" /> {item.brand || 'SEM MARCA'} •{' '}
                      {item.packageType}
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0 bg-muted/30 sm:bg-transparent p-2 sm:p-0 rounded-lg flex-shrink-0">
                    <div className="text-[10px] font-black text-muted-foreground tracking-wider">
                      ESTOQUE
                    </div>
                    <div
                      className={cn(
                        'font-black text-lg',
                        item.quantity <= (item.minStock || 0) ? 'text-red-600' : 'text-emerald-600',
                      )}
                    >
                      {item.quantity} UN
                    </div>
                  </div>
                </button>
              ))}
              {filteredInventory.length === 0 && (
                <div className="p-8 text-center bg-white border rounded-xl border-dashed">
                  <Package className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <div className="text-sm font-bold text-muted-foreground uppercase">
                    NENHUM PRODUTO ENCONTRADO.
                  </div>
                </div>
              )}
            </div>
          )}

          {!selectedProduct && !searchTerm && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 py-12">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <span className="text-sm font-bold tracking-widest uppercase">
                INICIE SUA BUSCA ACIMA
              </span>
            </div>
          )}

          {selectedProduct && (
            <div className="space-y-6 animate-fade-in pb-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-black text-[#D81B84] uppercase leading-tight flex items-center gap-2">
                  {selectedProduct.criticalObservations &&
                    selectedProduct.criticalObservations.trim() !== '' && (
                      <AlertTriangle className="w-7 h-7 text-amber-500 fill-amber-100 flex-shrink-0 drop-shadow-sm" />
                    )}
                  {selectedProduct.name}
                </h3>
                <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" /> {selectedProduct.brand || 'SEM MARCA'} •{' '}
                  {selectedProduct.specialty || 'SEM ESPECIALIDADE'}
                </p>
              </div>

              {selectedProduct.criticalObservations && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 mt-4 shadow-sm animate-fade-in">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-black text-amber-900 tracking-widest uppercase mb-1">
                      OBSERVAÇÕES CRÍTICAS
                    </div>
                    <div className="font-bold text-sm text-amber-800 uppercase leading-snug">
                      {selectedProduct.criticalObservations}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center gap-8 mt-4 mb-2 shadow-sm">
                <div>
                  <div className="text-[10px] font-black text-blue-900 tracking-widest uppercase mb-1">
                    SALA DE ARMAZENAMENTO
                  </div>
                  <div className="font-bold text-base text-blue-800 uppercase flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedProduct.storageRoom || 'NÃO INFORMADA'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-blue-900 tracking-widest uppercase mb-1">
                    NÚMERO DO ARMÁRIO
                  </div>
                  <div className="font-bold text-base text-blue-800 uppercase flex items-center gap-2">
                    <Box className="w-4 h-4" />
                    {selectedProduct.cabinetNumber || 'NÃO INFORMADO'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 text-slate-900 p-4 rounded-xl border border-slate-200 flex flex-col justify-center shadow-sm">
                  <div className="text-[10px] font-black tracking-widest mb-1 opacity-70">
                    QTD. EM ESTOQUE
                  </div>
                  <div className="text-3xl font-black">{selectedProduct.quantity}</div>
                </div>
                <div className="bg-emerald-50 text-emerald-900 p-4 rounded-xl border border-emerald-100 flex flex-col justify-center shadow-sm">
                  <div className="text-[10px] font-black tracking-widest mb-1 opacity-70">
                    CUSTO (EMBALAGEM)
                  </div>
                  <div className="text-2xl font-black">
                    {formatCurrency(selectedProduct.packageCost)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <DetailItem
                  label="EMBALAGEM DE COMPRA"
                  value={selectedProduct.packageType}
                  icon={Box}
                />
                <DetailItem
                  label="ITENS / EMB."
                  value={String(selectedProduct.itemsPerBox)}
                  icon={Package}
                />
                <DetailItem
                  label="ESTOQUE MÍNIMO"
                  value={String(selectedProduct.minStock)}
                  icon={ClipboardList}
                />
                <DetailItem
                  label="CÓDIGO DE BARRAS"
                  value={selectedProduct.barcode || 'NÃO INFORMADO'}
                  icon={Barcode}
                />
                <DetailItem
                  label="VALIDADE"
                  value={formatDate(selectedProduct.expirationDate)}
                  icon={CalendarClock}
                />
                <DetailItem
                  label="NÚMERO DA NFE"
                  value={selectedProduct.nfeNumber || 'NÃO INFORMADO'}
                  icon={ClipboardList}
                />
              </div>

              {selectedProduct.specialty === 'IMPLANTODONTIA' &&
                selectedProduct.specialtyDetails && (
                  <div className="space-y-3 pt-2">
                    <h4 className="font-black text-xs text-blue-900 tracking-widest border-b border-blue-100 pb-2 flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5" /> DETALHES TÉCNICOS (IMPLANTE)
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      <DetailItem
                        label="MARCA"
                        value={selectedProduct.specialtyDetails.implantBrand || '-'}
                      />
                      <DetailItem
                        label="DIÂMETRO"
                        value={
                          selectedProduct.specialtyDetails.implantDiameter
                            ? selectedProduct.specialtyDetails.implantDiameter + ' MM'
                            : '-'
                        }
                      />
                      <DetailItem
                        label="ALTURA"
                        value={
                          selectedProduct.specialtyDetails.implantHeight
                            ? selectedProduct.specialtyDetails.implantHeight + ' MM'
                            : '-'
                        }
                      />
                    </div>
                  </div>
                )}

              {selectedProduct.specialty === 'PRÓTESE' &&
                selectedProduct.specialtyDetails?.isProstheticComponent && (
                  <div className="space-y-3 pt-2">
                    <h4 className="font-black text-xs text-blue-900 tracking-widest border-b border-blue-100 pb-2 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5" /> DETALHES TÉCNICOS (COMPONENTE PROTÉTICO)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <DetailItem
                        label="TIPO"
                        value={selectedProduct.specialtyDetails.prostheticType || '-'}
                      />
                      {selectedProduct.specialtyDetails.prostheticAngle && (
                        <DetailItem
                          label="ÂNGULO"
                          value={selectedProduct.specialtyDetails.prostheticAngle}
                        />
                      )}
                      {selectedProduct.specialtyDetails.prostheticCollarHeight && (
                        <DetailItem
                          label="CINTA"
                          value={selectedProduct.specialtyDetails.prostheticCollarHeight}
                        />
                      )}
                      {selectedProduct.specialtyDetails.prostheticDiameter && (
                        <DetailItem
                          label="DIÂMETRO"
                          value={selectedProduct.specialtyDetails.prostheticDiameter}
                        />
                      )}
                      {selectedProduct.specialtyDetails.prostheticHeight && (
                        <DetailItem
                          label="ALTURA"
                          value={selectedProduct.specialtyDetails.prostheticHeight}
                        />
                      )}
                    </div>
                  </div>
                )}

              <div className="space-y-3 pt-2">
                <h4 className="font-black text-xs text-muted-foreground tracking-widest border-b pb-2 flex items-center gap-2">
                  <Factory className="w-3.5 h-3.5" /> HISTÓRICO E FORNECEDORES
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <DetailItem label="ÚLTIMO FORNECEDOR" value={getSupplierName(selectedProduct)} />
                  <DetailItem
                    label="MARCA DA ÚLTIMA COMPRA"
                    value={selectedProduct.lastBrand || 'NÃO INFORMADO'}
                  />
                </div>
              </div>

              {selectedProduct.notes && (
                <div className="pt-2">
                  <DetailItem label="OBSERVAÇÕES" value={selectedProduct.notes} />
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
