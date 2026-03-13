import { useState, useEffect, useMemo } from 'react'
import { Trash2, UserPlus, Search } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useChatStore } from '@/stores/chat'
import useAppStore from '@/stores/main'

export function ManageGroupDialog({
  roomId,
  open,
  onOpenChange,
}: {
  roomId: string
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const { getGroupParticipants, addGroupParticipant, removeGroupParticipant } = useChatStore()
  const { employees } = useAppStore()
  const [participants, setParticipants] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && roomId) {
      getGroupParticipants(roomId).then(setParticipants)
      setSearch('')
    }
  }, [open, roomId, getGroupParticipants])

  const validEmployees = useMemo(() => {
    return employees
      .filter((e) => e.user_id && e.status !== 'Desligado')
      .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
  }, [employees, search])

  const handleAdd = async (userId: string) => {
    setIsLoading(true)
    await addGroupParticipant(roomId, userId)
    setParticipants((p) => [...p, userId])
    setIsLoading(false)
  }

  const handleRemove = async (userId: string) => {
    setIsLoading(true)
    await removeGroupParticipant(roomId, userId)
    setParticipants((p) => p.filter((id) => id !== userId))
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-wide text-nuvia-navy font-bold">
            Gerenciar Membros
          </DialogTitle>
        </DialogHeader>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="BUSCAR COLABORADOR..."
            className="pl-9 bg-muted/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[350px] mt-4 pr-4">
          <div className="space-y-3">
            {validEmployees.map((emp) => {
              const isMember = participants.includes(emp.user_id!)
              return (
                <div
                  key={emp.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar className="h-9 w-9 border border-background shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {emp.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-bold uppercase truncate">{emp.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase truncate">
                        {emp.role}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 ml-4">
                    {isMember ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(emp.user_id!)}
                        disabled={isLoading}
                        className="h-8"
                      >
                        <Trash2 className="h-4 w-4 md:mr-1" />
                        <span className="hidden md:inline">REMOVER</span>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAdd(emp.user_id!)}
                        disabled={isLoading}
                        className="h-8"
                      >
                        <UserPlus className="h-4 w-4 md:mr-1" />
                        <span className="hidden md:inline">ADICIONAR</span>
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
            {validEmployees.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8 uppercase">
                Nenhum colaborador encontrado.
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
