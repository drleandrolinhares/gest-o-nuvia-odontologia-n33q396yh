import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Plus, Box, LayoutGrid, Package } from 'lucide-react'
import useAppStore from '@/stores/main'
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

export function InventorySettings() {
  const { inventoryOptions, addInventoryOption, removeInventoryOption } = useAppStore()

  const categories = [
    { id: 'STORAGE_ROOM', label: 'SALAS DE ARMAZENAMENTO' },
    { id: 'MARCA_IMPLANTE', label: 'MARCAS DE IMPLANTE' },
    { id: 'TIPO_COMPONENTE', label: 'TIPOS DE COMPONENTE' },
    { id: 'EMBALAGEM_CONSUMO', label: 'EMBALAGEM DE CONSUMO' },
  ]

  const [newValues, setNewValues] = useState<Record<string, string>>({})
  const [optionToDelete, setOptionToDelete] = useState<string | null>(null)

  const handleAdd = (e: React.FormEvent, category: string) => {
    e.preventDefault()
    const val = newValues[category]?.trim()
    if (val) {
      addInventoryOption(category, val.toUpperCase())
      setNewValues((p) => ({ ...p, [category]: '' }))
    }
  }

  const handleDelete = () => {
    if (optionToDelete) {
      removeInventoryOption(optionToDelete)
      setOptionToDelete(null)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 uppercase animate-fade-in-up">
      {categories.map((cat) => {
        const options = inventoryOptions
          .filter((o) => {
            const oCat = o.category.toUpperCase()
            if (cat.id === 'STORAGE_ROOM') {
              return oCat === 'STORAGE_ROOM' || oCat === 'SALA_ARMAZENAMENTO'
            }
            return oCat === cat.id
          })
          .sort((a, b) => a.value.localeCompare(b.value))

        return (
          <Card key={cat.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-nuvia-navy text-sm font-bold">
                {cat.id === 'STORAGE_ROOM' ? (
                  <LayoutGrid className="h-4 w-4 text-emerald-500" />
                ) : cat.id === 'EMBALAGEM_CONSUMO' ? (
                  <Package className="h-4 w-4 text-[#D81B84]" />
                ) : (
                  <Box className="h-4 w-4 text-blue-500" />
                )}
                {cat.label}
              </CardTitle>
              <CardDescription className="uppercase text-xs font-semibold">
                OPÇÕES PARA OS FORMULÁRIOS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={(e) => handleAdd(e, cat.id)} className="flex gap-2">
                <Input
                  placeholder="NOVA OPÇÃO..."
                  value={newValues[cat.id] || ''}
                  onChange={(e) => setNewValues((p) => ({ ...p, [cat.id]: e.target.value }))}
                  className="uppercase font-bold text-xs"
                />
                <Button
                  type="submit"
                  disabled={!newValues[cat.id]?.trim()}
                  className="font-bold text-xs"
                >
                  <Plus className="h-4 w-4 mr-2" /> ADD
                </Button>
              </form>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {options.map((opt) => (
                  <div
                    key={opt.id}
                    className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors shadow-sm"
                  >
                    <span className="font-bold text-xs text-nuvia-navy uppercase truncate">
                      {opt.value}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0"
                      onClick={() => setOptionToDelete(opt.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {options.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground text-xs uppercase border border-dashed rounded-md bg-card/50 font-bold">
                    NENHUMA OPÇÃO CADASTRADA.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}

      <AlertDialog
        open={!!optionToDelete}
        onOpenChange={(open) => !open && setOptionToDelete(null)}
      >
        <AlertDialogContent className="uppercase">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-nuvia-navy">
              EXCLUIR OPÇÃO?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-semibold text-muted-foreground">
              TEM CERTEZA QUE DESEJA EXCLUIR ESTA OPÇÃO? ELA NÃO ESTARÁ MAIS DISPONÍVEL NOS
              FORMULÁRIOS.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bold">CANCELAR</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
            >
              EXCLUIR
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
