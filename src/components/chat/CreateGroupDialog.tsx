import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Search } from 'lucide-react'
import { useChatStore } from '@/stores/chat'
import useAppStore from '@/stores/main'

export function CreateGroupDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const [name, setName] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const { createGroupRoom, isLoadingRoom } = useChatStore()
  const { employees, currentUserId } = useAppStore()

  const validEmployees = useMemo(() => {
    return employees.filter(
      (e) => e.user_id && e.user_id !== currentUserId && e.status !== 'Desligado',
    )
  }, [employees, currentUserId])

  const filteredEmployees = useMemo(() => {
    return validEmployees.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
  }, [validEmployees, search])

  const handleCreate = async () => {
    if (!name.trim()) return
    await createGroupRoom(name.trim(), selected)
    onOpenChange(false)
    setName('')
    setSearch('')
    setSelected([])
  }

  const toggleUser = (userId: string) => {
    setSelected((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-wide text-nuvia-navy font-bold">
            Novo Grupo
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 flex flex-col gap-4">
          <Input
            placeholder="NOME DO GRUPO..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="uppercase"
            autoFocus
          />

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase">
              Participantes ({selected.length})
            </span>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="BUSCAR COLABORADOR..."
                className="pl-9 bg-muted/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[200px] border rounded-md p-2">
              <div className="space-y-1">
                {filteredEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => toggleUser(emp.user_id!)}
                  >
                    <Checkbox
                      checked={selected.includes(emp.user_id!)}
                      onCheckedChange={() => toggleUser(emp.user_id!)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                        {emp.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium uppercase truncate">{emp.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase truncate">
                        {emp.role}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredEmployees.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4 uppercase">
                    Nenhum colaborador encontrado
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoadingRoom}
          >
            CANCELAR
          </Button>
          <Button type="button" onClick={handleCreate} disabled={!name.trim() || isLoadingRoom}>
            CRIAR GRUPO
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
