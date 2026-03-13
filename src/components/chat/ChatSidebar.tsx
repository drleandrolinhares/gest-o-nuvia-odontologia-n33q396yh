import { useState, useMemo } from 'react'
import { Search, Users, Hash, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/stores/chat'
import useAppStore from '@/stores/main'
import { cn } from '@/lib/utils'
import { CreateGroupDialog } from './CreateGroupDialog'

export function ChatSidebar() {
  const [search, setSearch] = useState('')
  const [createGroupOpen, setCreateGroupOpen] = useState(false)
  const { employees, currentUserId } = useAppStore()
  const { rooms, unreadCounts, onlineUsers, activeRoomId, openIndividualRoom, openRoom } =
    useChatStore()

  const isMaster = useMemo(() => {
    return (
      employees.find((e) => e.user_id === currentUserId)?.teamCategory?.includes('MASTER') || false
    )
  }, [employees, currentUserId])

  const validEmployees = useMemo(() => {
    return employees.filter(
      (e) => e.user_id && e.user_id !== currentUserId && e.status !== 'Desligado',
    )
  }, [employees, currentUserId])

  const groupRooms = useMemo(() => {
    return rooms.filter((r) => r.type === 'group')
  }, [rooms])

  const filteredEmployees = validEmployees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  )
  const filteredGroups = groupRooms.filter((r) =>
    (r.name || r.department || '').toLowerCase().includes(search.toLowerCase()),
  )

  const getUnreadForUser = (userId: string) => {
    const room = rooms.find((r) => r.type === 'individual' && r.other_user_id === userId)
    return room ? unreadCounts[room.id] || 0 : 0
  }

  const getUnreadForRoom = (roomId: string) => {
    return unreadCounts[roomId] || 0
  }

  return (
    <div className="w-80 flex flex-col bg-card border-r h-full shrink-0">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-nuvia-navy mb-4">MENSAGENS</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="BUSCAR CONTATO OU GRUPO..."
            className="pl-9 bg-muted/50 uppercase"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          <div>
            <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3" /> GRUPOS
              </div>
              {isMaster && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-muted"
                  onClick={() => setCreateGroupOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-0.5 mt-1">
              {filteredGroups.map((room) => {
                const unread = getUnreadForRoom(room.id)
                const active = room.id === activeRoomId
                const displayName = room.name || room.department || 'GRUPO DESCONHECIDO'
                return (
                  <button
                    key={room.id}
                    onClick={() => openRoom(room.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-muted transition-colors text-left',
                      active && 'bg-primary/10 hover:bg-primary/15',
                    )}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-8 w-8 rounded-md bg-primary/20 flex items-center justify-center shrink-0">
                        <Hash className="h-4 w-4 text-primary" />
                      </div>
                      <span
                        className={cn(
                          'text-sm font-medium truncate uppercase',
                          active ? 'text-primary font-bold' : 'text-foreground',
                        )}
                      >
                        {displayName}
                      </span>
                    </div>
                    {unread > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-2 h-5 min-w-5 flex items-center justify-center px-1 shrink-0"
                      >
                        {unread}
                      </Badge>
                    )}
                  </button>
                )
              })}
              {filteredGroups.length === 0 && (
                <p className="text-xs text-muted-foreground px-2 py-2 uppercase">
                  NENHUM GRUPO ENCONTRADO.
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              COLABORADORES
            </div>
            <div className="space-y-0.5 mt-1">
              {filteredEmployees.map((emp) => {
                const unread = getUnreadForUser(emp.user_id!)
                const room = rooms.find(
                  (r) => r.type === 'individual' && r.other_user_id === emp.user_id,
                )
                const active = room?.id === activeRoomId
                const isOnline = onlineUsers.includes(emp.user_id!)

                return (
                  <button
                    key={emp.id}
                    onClick={() => openIndividualRoom(emp.user_id!)}
                    className={cn(
                      'w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-muted transition-colors text-left',
                      active && 'bg-primary/10 hover:bg-primary/15',
                    )}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="relative shrink-0">
                        <Avatar className="h-8 w-8 border border-background">
                          <AvatarFallback className="bg-muted text-xs font-bold">
                            {emp.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={cn(
                            'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background',
                            isOnline ? 'bg-emerald-500' : 'bg-slate-300',
                          )}
                        />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span
                          className={cn(
                            'text-sm font-medium truncate uppercase',
                            active ? 'text-primary font-bold' : 'text-foreground',
                          )}
                        >
                          {emp.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate uppercase">
                          {emp.role}
                        </span>
                      </div>
                    </div>
                    {unread > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-2 h-5 min-w-5 flex items-center justify-center px-1 shrink-0"
                      >
                        {unread}
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
      <CreateGroupDialog open={createGroupOpen} onOpenChange={setCreateGroupOpen} />
    </div>
  )
}
