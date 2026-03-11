import { useState, useMemo } from 'react'
import useAppStore from '@/stores/main'
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
import { Package, Box, Stethoscope, Tag, CalendarClock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { AddInventoryModal } from '@/components/inventory/AddInventoryModal'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Inventory() {
  const { inventory, specialties } = useAppStore()
  const [isAdding, setIsAdding] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all')

  const filteredInventory = useMemo(() => {
    if (selectedSpecialty === 'all') return inventory
    return inventory.filter((item) => item.specialty === selectedSpecialty)
  }, [inventory, selectedSpecialty])

  const totalCapital = filteredInventory.reduce(
    (acc, item) => acc + item.quantity * item.packageCost,
    0,
  )

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100/80 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
            <Box className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#D81B84]">
              Controle de Estoque
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie embalagens, custos e rendimentos detalhados.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Filtrar Especialidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Especialidades</SelectItem>
              {specialties.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="bg-[#D81B84] hover:bg-[#B71770] text-white whitespace-nowrap"
            onClick={() => setIsAdding(true)}
          >
            + Novo Produto
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-600 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Capital Investido ({selectedSpecialty === 'all' ? 'Total' : selectedSpecialty})
            </p>
            <div className="text-4xl font-extrabold text-blue-600">
              {formatCurrency(totalCapital)}
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
              <TableHead className="font-semibold text-muted-foreground">
                Custo Emb. Fechada
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground text-center">
                Qtd. Atual
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">Capital Retido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/10">
                <TableCell className="align-top py-4">
                  <div className="font-bold text-[#D81B84] mb-1.5 text-base">{item.name}</div>
                  <div className="flex flex-col gap-1">
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
                        <CalendarClock className="h-3.5 w-3.5" />
                        Val: {format(new Date(item.expirationDate), 'dd/MM/yyyy', { locale: ptBR })}
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
                  <span className="inline-flex items-center justify-center min-w-[32px] h-[32px] px-2 rounded-full bg-muted font-bold text-sm">
                    {item.quantity}
                  </span>
                </TableCell>
                <TableCell className="align-middle py-4 font-bold text-muted-foreground">
                  {formatCurrency(item.quantity * item.packageCost)}
                </TableCell>
              </TableRow>
            ))}
            {filteredInventory.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Nenhum produto encontrado
                  {selectedSpecialty !== 'all' ? ` para a especialidade ${selectedSpecialty}` : ''}.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <AddInventoryModal open={isAdding} onOpenChange={setIsAdding} />
    </div>
  )
}
