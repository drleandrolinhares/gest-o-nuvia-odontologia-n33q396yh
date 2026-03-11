import { useState } from 'react'
import useAppStore from '@/stores/main'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/utils'

interface AddInventoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddInventoryModal({ open, onOpenChange }: AddInventoryModalProps) {
  const { addInventoryItem } = useAppStore()
  const [f, setF] = useState({
    name: '',
    packageCost: 0,
    storageLocation: '',
    packageType: 'Caixa',
    itemsPerBox: 1,
    productionYield: 1,
    minStock: 0,
    quantity: 0,
    lastBrand: '',
    lastValue: 0,
    notes: '',
  })

  const unitCost = f.packageCost / (f.itemsPerBox * f.productionYield || 1)
  const totalCost = f.quantity * f.packageCost

  const handleSubmit = () => {
    addInventoryItem({ ...f, unitCost })
    setF({
      name: '',
      packageCost: 0,
      storageLocation: '',
      packageType: 'Caixa',
      itemsPerBox: 1,
      productionYield: 1,
      minStock: 0,
      quantity: 0,
      lastBrand: '',
      lastValue: 0,
      notes: '',
    })
    onOpenChange(false)
  }

  const handleChange = (key: string, value: any) => setF((prev) => ({ ...prev, [key]: value }))

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="grid gap-1.5">
      <Label className="text-sm font-semibold">{label}</Label>
      {children}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Novo Produto no Estoque</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <Field label="Nome do Material">
            <Input
              value={f.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="EX: RESINA A2"
              className="border-[#D81B84] focus-visible:ring-[#D81B84]"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Custo da Embalagem Fechada (R$)">
              <Input
                type="number"
                step="0.01"
                value={f.packageCost || ''}
                onChange={(e) => handleChange('packageCost', Number(e.target.value))}
              />
            </Field>
            <Field label="Local de Armazenamento">
              <Input
                value={f.storageLocation}
                onChange={(e) => handleChange('storageLocation', e.target.value)}
                placeholder="EX: SALA 1 - ARMÁRIO A"
              />
            </Field>
          </div>

          <div className="p-5 bg-slate-50 rounded-xl border grid gap-5">
            <Field label="Tipos de Embalagem">
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-fit bg-white">
                  NOVA EMBALAGEM
                </Button>
                <p className="text-xs text-muted-foreground">
                  Preencha o último campo para adicionar um novo tipo automaticamente.
                </p>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-5">
              <Field label="Quantidade de Itens na Caixa">
                <Input
                  type="number"
                  value={f.itemsPerBox || ''}
                  onChange={(e) => handleChange('itemsPerBox', Number(e.target.value))}
                />
              </Field>
              <Field label="Rendimento de Produção">
                <Input
                  type="number"
                  value={f.productionYield || ''}
                  onChange={(e) => handleChange('productionYield', Number(e.target.value))}
                />
              </Field>
              <Field label="Estoque Mínimo (Aviso)">
                <Input
                  type="number"
                  value={f.minStock || ''}
                  onChange={(e) => handleChange('minStock', Number(e.target.value))}
                />
              </Field>
              <Field label="Custo Unitário de Produção">
                <div className="h-10 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-md font-bold border border-emerald-100 flex items-center">
                  {formatCurrency(unitCost)}
                </div>
              </Field>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <Field label="Qtd. Comprada (Inicial em Caixas)">
              <Input
                type="number"
                value={f.quantity || ''}
                onChange={(e) => handleChange('quantity', Number(e.target.value))}
                placeholder="EX: 10"
                className="border-blue-200"
              />
            </Field>
            <Field label="Custo Total da Compra Atual">
              <div className="h-10 px-3 py-2 bg-muted/40 rounded-md font-bold flex items-center">
                {formatCurrency(totalCost)}
              </div>
            </Field>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold text-muted-foreground text-sm">
              Detalhes da Compra & Histórico (Opcional)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Marca da última compra">
                <Input
                  value={f.lastBrand}
                  onChange={(e) => handleChange('lastBrand', e.target.value)}
                  placeholder="EX: 3M, IVOCLAR..."
                />
              </Field>
              <Field label="Valor da última compra (R$)">
                <Input
                  type="number"
                  step="0.01"
                  value={f.lastValue || ''}
                  onChange={(e) => handleChange('lastValue', Number(e.target.value))}
                />
              </Field>
            </div>
            <Field label="Observações">
              <Textarea
                value={f.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="ADICIONE NOTAS, LINKS DE FORNECEDORES OU DETALHES..."
                className="min-h-[100px]"
              />
            </Field>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="bg-[#D81B84] hover:bg-[#B71770] text-white" onClick={handleSubmit}>
            Cadastrar Produto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
