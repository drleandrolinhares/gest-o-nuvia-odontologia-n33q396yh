import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Gift, Plus } from 'lucide-react'
import useAppStore from '@/stores/main'

export function BonusSettings() {
  const { bonusTypes, addBonusType, removeBonusType } = useAppStore()
  const [newType, setNewType] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (newType.trim()) {
      addBonusType(newType.trim())
      setNewType('')
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-nuvia-navy">
            <Gift className="h-5 w-5 text-nuvia-gold" /> TIPOS DE BONIFICAÇÃO
          </CardTitle>
          <CardDescription>GERENCIE OS TIPOS DE BONIFICAÇÃO DISPONÍVEIS.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAdd} className="flex gap-2">
            <Input
              placeholder="NOVO TIPO..."
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            />
            <Button type="submit" disabled={!newType.trim()}>
              <Plus className="h-4 w-4 mr-2" /> ADD
            </Button>
          </form>
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
            {[...bonusTypes]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((type) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors shadow-sm"
                >
                  <span className="font-medium text-sm text-nuvia-navy uppercase">{type.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-8 w-8"
                    onClick={() => removeBonusType(type.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            {bonusTypes.length === 0 && (
              <div className="text-center py-6 text-muted-foreground text-sm uppercase border border-dashed rounded-md bg-card/50">
                NENHUM TIPO CADASTRADO.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
