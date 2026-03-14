import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Plus, Box, LayoutGrid } from 'lucide-react'
import useAppStore from '@/stores/main'

export function InventorySettings() {
  const { inventoryOptions, addInventoryOption, removeInventoryOption } = useAppStore()

  const categories = [
    { id: 'SALA_ARMAZENAMENTO', label: 'SALAS DE ARMAZENAMENTO' },
    { id: 'MARCA_IMPLANTE', label: 'MARCAS DE IMPLANTE' },
    { id: 'TIPO_COMPONENTE', label: 'TIPOS DE COMPONENTE' },
  ]

  const [newValues, setNewValues] = useState<Record<string, string>>({})

  const handleAdd = (e: React.FormEvent, category: string) => {
    e.preventDefault()
    const val = newValues[category]?.trim()
    if (val) {
      addInventoryOption(category, val.toUpperCase())
      setNewValues((p) => ({ ...p, [category]: '' }))
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 uppercase">
      {categories.map((cat) => {
        const options = inventoryOptions
          .filter((o) => o.category === cat.id)
          .sort((a, b) => a.value.localeCompare(b.value))

        return (
          <Card key={cat.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-nuvia-navy text-sm">
                {cat.id === 'SALA_ARMAZENAMENTO' ? (
                  <LayoutGrid className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Box className="h-4 w-4 text-blue-500" />
                )}
                {cat.label}
              </CardTitle>
              <CardDescription className="uppercase text-xs">
                OPÇÕES PARA OS FORMULÁRIOS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={(e) => handleAdd(e, cat.id)} className="flex gap-2">
                <Input
                  placeholder="NOVA OPÇÃO..."
                  value={newValues[cat.id] || ''}
                  onChange={(e) => setNewValues((p) => ({ ...p, [cat.id]: e.target.value }))}
                  className="uppercase"
                />
                <Button type="submit" disabled={!newValues[cat.id]?.trim()}>
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
                      className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0"
                      onClick={() => removeInventoryOption(opt.id)}
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
    </div>
  )
}
