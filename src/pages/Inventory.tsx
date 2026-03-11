import { useState } from 'react'
import useAppStore from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, Plus, PackageOpen, TrendingDown } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

export default function Inventory() {
  const { inventory, updateInventoryQuantity, addInventoryItem } = useAppStore()
  const [search, setSearch] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: 0,
    unit: '',
    threshold: 0,
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    addInventoryItem({
      ...newItem,
      lastRestocked: new Date().toISOString().split('T')[0],
    })
    setIsAdding(false)
    setNewItem({ name: '', category: '', quantity: 0, unit: '', threshold: 0 })
  }

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()),
  )

  const lowStockItems = inventory.filter((i) => i.quantity <= i.threshold)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">Estoque Clínico</h1>
          <p className="text-muted-foreground mt-1">Gestão de materiais, níveis e reposição.</p>
        </div>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Item ao Estoque</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label>Nome do Produto</Label>
                <Input
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Categoria</Label>
                <Input
                  required
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Quantidade Inicial</Label>
                  <Input
                    type="number"
                    required
                    min="0"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Unidade (ex: Caixas)</Label>
                  <Input
                    required
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Alerta de Estoque Baixo (Qtd)</Label>
                <Input
                  type="number"
                  required
                  min="0"
                  value={newItem.threshold}
                  onChange={(e) => setNewItem({ ...newItem, threshold: parseInt(e.target.value) })}
                />
              </div>
              <Button type="submit" className="w-full">
                Salvar Item
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens Cadastrados</CardTitle>
            <PackageOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card className={lowStockItems.length > 0 ? 'border-destructive/50 bg-destructive/5' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Estoque Crítico</CardTitle>
            <TrendingDown
              className={
                lowStockItems.length > 0
                  ? 'h-4 w-4 text-destructive'
                  : 'h-4 w-4 text-muted-foreground'
              }
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Abaixo do limite de segurança</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Inventário Consolidado</CardTitle>
            <Input
              placeholder="Buscar itens..."
              className="max-w-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Estoque Atual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações Rápidas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => {
                const isLow = item.quantity <= item.threshold
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell>
                      {isLow ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" /> Repor
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                        >
                          Adequado
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateInventoryQuantity(item.id, Math.max(0, item.quantity - 1))
                          }
                        >
                          -
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateInventoryQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredInventory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum item de estoque encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
