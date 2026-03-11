import { useState } from 'react'
import useAppStore, { Supplier } from '@/stores/main'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit2, Truck } from 'lucide-react'
import { SupplierFormDialog } from './SupplierFormDialog'
import { SupplierDetailsDialog } from './SupplierDetailsDialog'

export function SuppliersManagement() {
  const { suppliers, addSupplier, updateSupplier, removeSupplier, can, isAdmin } = useAppStore()
  const [openForm, setOpenForm] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  const sortedSuppliers = [...suppliers].sort((a, b) => a.name.localeCompare(b.name))

  const canAdd = isAdmin || can('fornecedores', 'criar_fornecedor')
  const canEdit = isAdmin || can('fornecedores', 'editar_fornecedor')
  const canViewNotes = isAdmin || can('fornecedores', 'ver_notas')

  const handleOpenForm = (item?: Supplier) => {
    setEditingSupplier(item || null)
    setOpenForm(true)
  }

  const handleSave = (data: Partial<Supplier>) => {
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, data)
    } else {
      addSupplier(data as Omit<Supplier, 'id'>)
    }
    setOpenForm(false)
  }

  return (
    <Card className="uppercase animate-fade-in-up">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" /> FORNECEDORES
          </CardTitle>
          <CardDescription className="mt-1 uppercase">
            GESTÃO DE FORNECEDORES DE MATERIAIS CLÍNICOS E SERVIÇOS.
          </CardDescription>
        </div>
        {canAdd && (
          <Button onClick={() => handleOpenForm()} className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> NOVO FORNECEDOR
          </Button>
        )}
      </CardHeader>

      <div className="border-t border-muted overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold text-muted-foreground">
                NOME / RAZÃO SOCIAL
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">CNPJ</TableHead>
              <TableHead className="font-semibold text-muted-foreground">CONTATO</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-right">
                AÇÕES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSuppliers.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-muted/10 cursor-pointer transition-colors"
                onClick={() => setSelectedSupplier(item)}
              >
                <TableCell>
                  <div className="font-bold text-primary flex items-center gap-2">
                    {item.name}
                    {canViewNotes && item.hasSpecialNegotiation && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-bold">
                        NEGOCIAÇÃO
                      </span>
                    )}
                  </div>
                  {item.website && (
                    <div className="text-xs text-muted-foreground lowercase mt-0.5">
                      {item.website}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-muted-foreground">
                  {item.cnpj || 'NÃO INFORMADO'}
                </TableCell>
                <TableCell>
                  <div className="font-semibold">{item.contact}</div>
                  <div className="text-xs text-muted-foreground">{item.phone}</div>
                </TableCell>
                <TableCell
                  className="text-right whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenForm(item)}
                      className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                      title="EDITAR"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSupplier(item.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="REMOVER"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {sortedSuppliers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-muted-foreground font-semibold"
                >
                  NENHUM FORNECEDOR CADASTRADO.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <SupplierFormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        supplier={editingSupplier}
        onSave={handleSave}
      />
      <SupplierDetailsDialog
        supplier={selectedSupplier}
        onClose={() => setSelectedSupplier(null)}
      />
    </Card>
  )
}
