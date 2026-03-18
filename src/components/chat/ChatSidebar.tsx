import { useState, useMemo, useEffect, useRef } from 'react'
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
import { toast } from '@/components/ui/use-toast'

export function ChatSidebar() {
  const [search, setSearch] = useState('')
  const [createGroupOpen, setCreateGroupOpen] = useState(false)
  const { employees, currentUserId } = useAppStore()
  const {
    rooms,
    unreadCounts,
    onlineUsers,
    activeRoomId,
    openIndividualRoom,
    openRoom,
    isMasterUser,
    isLoadingRoom,
  } = useChatStore()

  const [pulsingRooms, setPulsingRooms] = useState<Record<string, boolean>>({})
  const prevUnreadRef = useRef<Record<string, number>>(unreadCounts)

  useEffect(() => {
    let hasNew = false
    const currentPulsing: Record<string, boolean> = {}

    Object.entries(unreadCounts).forEach(([roomId, count]) => {
      const prevCount = prevUnreadRef.current[roomId] || 0
      if (count > prevCount && roomId !== activeRoomId) {
        currentPulsing[roomId] = true
        hasNew = true
      }
    })

    if (hasNew) {
      setPulsingRooms((prev) => ({ ...prev, ...currentPulsing }))
      const timer = setTimeout(() => {
        setPulsingRooms((prev) => {
          const next = { ...prev }
          Object.keys(currentPulsing).forEach((k) => delete next[k])
          return next
        })
      }, 2500)

      prevUnreadRef.current = unreadCounts
      return () => clearTimeout(timer)
    }

    prevUnreadRef.current = unreadCounts
  }, [unreadCounts, activeRoomId])

  const validEmployees = useMemo(() => {
    return employees.filter((e) => e.user_id !== currentUserId && e.status !== 'Desligado')
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

  const sortedGroups = useMemo(() => {
    return [...filteredGroups].sort((a, b) => {
      const unreadA = unreadCounts[a.id] || 0
      const unreadB = unreadCounts[b.id] || 0

      if (unreadA > 0 && unreadB === 0) return -1
      if (unreadB > 0 && unreadA === 0) return 1

      const timeA = new Date(a.last_message_at || a.created_at || 0).getTime()
      const timeB = new Date(b.last_message_at || b.created_at || 0).getTime()

      if (timeA !== timeB) return timeB - timeA

      const nameA = a.name || a.department || ''
      const nameB = b.name || b.department || ''
      return nameA.localeCompare(nameB)
    })
  }, [filteredGroups, unreadCounts])

  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      const roomA = a.user_id
        ? rooms.find((r) => r.type === 'individual' && r.other_user_id === a.user_id)
        : null
      const roomB = b.user_id
        ? rooms.find((r) => r.type === 'individual' && r.other_user_id === b.user_id)
        : null
      const unreadA = roomA ? unreadCounts[roomA.id] || 0 : 0
      const unreadB = roomB ? unreadCounts[roomB.id] || 0 : 0

      if (unreadA > 0 && unreadB === 0) return -1
      if (unreadB > 0 && unreadA === 0) return 1

      const timeA = roomA ? new Date(roomA.last_message_at || roomA.created_at || 0).getTime() : 0
      const timeB = roomB ? new Date(roomB.last_message_at || roomB.created_at || 0).getTime() : 0

      if (timeA !== timeB) return timeB - timeA

      return (a.name || '').localeCompare(b.name || '')
    })
  }, [filteredEmployees, rooms, unreadCounts])

  return (
    <div className="flex flex-col bg-card h-full shrink-0">
      <div className="p-4 border-b flex flex-col shrink-0 gap-4">
        <h2 className="text-xl font-bold text-nuvia-navy">MENSAGENS</h2>
        {isMasterUser && (
          <Button
            type="button"
            onClick={() => setCreateGroupOpen(true)}
            className="w-full flex items-center justify-center gap-2 font-bold shadow-sm"
          >
            <Plus className="h-4 w-4" /> CRIAR GRUPO
          </Button>
        )}
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
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 space-y-4">
          <div>
            <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3" /> GRUPOS
              </div>
            </div>
            <div className="space-y-0.5 mt-1">
              {sortedGroups.map((room) => {
                const unread = unreadCounts[room.id] || 0
                const active = room.id === activeRoomId
                const isPulsing = pulsingRooms[room.id]
                const displayName = room.name || room.department || 'GRUPO DESCONHECIDO'
                return (
                  <button
                    key={room.id}
                    type="button"
                    disabled={isLoadingRoom}
                    onClick={() => openRoom(room.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-2 py-2 rounded-md transition-all duration-500 text-left disabled:opacity-50 disabled:cursor-not-allowed border border-transparent',
                      active
                        ? 'bg-primary/10 hover:bg-primary/15 border-primary/20'
                        : isPulsing
                          ? 'bg-primary/5 border-primary/30 animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                          : 'hover:bg-muted',
                    )}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-8 w-8 rounded-md bg-primary/20 flex items-center justify-center shrink-0">
                        <Hash className="h-4 w-4 text-primary" />
                      </div>
                      <span
                        className={cn(
                          'text-sm truncate uppercase transition-all duration-300',
                          active
                            ? 'text-primary font-bold'
                            : unread > 0
                              ? 'font-bold text-foreground'
                              : 'font-medium text-foreground',
                        )}
                      >
                        {displayName}
                      </span>
                    </div>
                    {unread > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-2 h-5 min-w-5 flex items-center justify-center px-1.5 shrink-0 rounded-full text-[10px]"
                      >
                        {unread}
                      </Badge>
                    )}
                  </button>
                )
              })}
              {sortedGroups.length === 0 && (
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
              {sortedEmployees.map((emp) => {
                const room = emp.user_id
                  ? rooms.find((r) => r.type === 'individual' && r.other_user_id === emp.user_id)
                  : undefined
                const unread = room ? unreadCounts[room.id] || 0 : 0
                const active = room?.id === activeRoomId
                const isPulsing = room && pulsingRooms[room.id]
                const isOnline = emp.user_id ? onlineUsers.includes(emp.user_id) : false

                return (
                  <button
                    key={emp.id}
                    type="button"
                    disabled={isLoadingRoom}
                    onClick={() => {
                      if (!emp.user_id) {
                        toast({
                          title: 'Ação Indisponível',
                          description:
                            'Este colaborador ainda não possui um acesso ao sistema vinculado. Não é possível iniciar o chat.',
                          variant: 'destructive',
                        })
                        return
                      }
                      openIndividualRoom(emp.user_id)
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-2 py-2 rounded-md transition-all duration-500 text-left disabled:opacity-50 disabled:cursor-not-allowed border border-transparent',
                      active
                        ? 'bg-primary/10 hover:bg-primary/15 border-primary/20'
                        : isPulsing
                          ? 'bg-primary/5 border-primary/30 animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                          : 'hover:bg-muted',
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
                            'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background transition-colors',
                            isOnline ? 'bg-emerald-500' : 'bg-slate-300',
                          )}
                        />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span
                          className={cn(
                            'text-sm truncate uppercase transition-all duration-300',
                            active
                              ? 'text-primary font-bold'
                              : unread > 0
                                ? 'font-bold text-foreground'
                                : 'font-medium text-foreground',
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
                        className="ml-2 h-5 min-w-5 flex items-center justify-center px-1.5 shrink-0 rounded-full text-[10px]"
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
