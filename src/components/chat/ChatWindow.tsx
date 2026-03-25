import { useState, useRef, useEffect, useMemo } from 'react'
import { ArrowLeft, Send, Users, Loader2, Settings, AlertTriangle, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useChatStore } from '@/stores/chat'
import useAppStore from '@/stores/main'
import { cn } from '@/lib/utils'
import { ManageGroupDialog } from './ManageGroupDialog'

export function ChatWindow() {
  const [input, setInput] = useState('')
  const [manageOpen, setManageOpen] = useState(false)
  const {
    activeRoomId,
    rooms,
    messages,
    sendMessage,
    onlineUsers,
    isLoadingRoom,
    isLoadingMore,
    hasMoreMessages,
    isMasterUser,
    closeRoom,
    roomError,
    loadMoreMessages,
  } = useChatStore()
  const { employees, currentUserId } = useAppStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeRoom = useMemo(() => rooms.find((r) => r.id === activeRoomId), [rooms, activeRoomId])
  const roomMsgs = useMemo(
    () => (activeRoomId ? messages[activeRoomId] || [] : []),
    [messages, activeRoomId],
  )

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'auto' })
    }
  }, [roomMsgs])

  const isRoomLoading = isLoadingRoom

  if (isRoomLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-muted/20 text-muted-foreground p-8 text-center uppercase h-full overflow-hidden min-w-0">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <h3 className="text-lg font-bold">CARREGANDO CONVERSA...</h3>
      </div>
    )
  }

  if (roomError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-muted/20 text-muted-foreground p-8 text-center uppercase h-full overflow-hidden min-w-0 animate-fade-in-up relative">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 md:hidden shrink-0"
          onClick={closeRoom}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-bold text-destructive">NÃO FOI POSSÍVEL CARREGAR A CONVERSA</h3>
        <p className="text-sm mt-2 max-w-md font-medium">{roomError}</p>
        <Button variant="outline" className="mt-6" onClick={closeRoom}>
          VOLTAR
        </Button>
      </div>
    )
  }

  if (!activeRoomId || !activeRoom) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-muted/20 text-muted-foreground p-8 text-center uppercase h-full overflow-hidden min-w-0">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-bold">SELECIONE UMA CONVERSA</h3>
        <p className="text-sm mt-2 max-w-md">
          ESCOLHA UM COLABORADOR OU GRUPO NO MENU LATERAL PARA INICIAR A COMUNICAÇÃO.
        </p>
      </div>
    )
  }

  const isGroup = activeRoom.type === 'group'
  const targetUser = !isGroup ? employees.find((e) => e.user_id === activeRoom.other_user_id) : null
  const isOnline = targetUser ? onlineUsers.includes(targetUser.user_id!) : false
  const displayName = isGroup
    ? activeRoom.name || activeRoom.department || 'GRUPO'
    : targetUser?.name || 'DESCONHECIDO'

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(activeRoomId, input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-background h-full min-w-0 overflow-hidden relative animate-fade-in">
      <div className="h-16 border-b flex items-center px-3 md:px-6 shrink-0 bg-card justify-between shadow-sm z-10">
        <div className="flex items-center gap-2 overflow-hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0 -ml-1 mr-1"
            onClick={closeRoom}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          {isGroup ? (
            <div className="h-10 w-10 rounded-md bg-primary/20 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-primary" />
            </div>
          ) : (
            <div className="relative shrink-0">
              <Avatar className="h-10 w-10 border">
                <AvatarFallback className="bg-muted font-bold text-sm">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background',
                  isOnline ? 'bg-emerald-500' : 'bg-slate-300',
                )}
              />
            </div>
          )}
          <div className="overflow-hidden ml-1">
            <h3 className="font-bold text-foreground uppercase truncate">{displayName}</h3>
            <p className="text-xs text-muted-foreground uppercase truncate">
              {isGroup
                ? 'CANAL DO GRUPO'
                : `${isOnline ? 'ONLINE' : 'OFFLINE'} • ${targetUser?.role || ''}`}
            </p>
          </div>
        </div>
        {isGroup && isMasterUser && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setManageOpen(true)}
            className="ml-2 shrink-0"
          >
            <Settings className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">MEMBROS</span>
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4 md:p-6 min-h-0">
        <div className="space-y-4 pb-4">
          {hasMoreMessages[activeRoomId] && (
            <div className="flex justify-center py-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs uppercase font-bold text-muted-foreground hover:text-foreground"
                onClick={() => loadMoreMessages(activeRoomId)}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <><Loader2 className="h-3 w-3 mr-2 animate-spin" /> CARREGANDO...</>
                ) : (
                  <><ChevronUp className="h-3 w-3 mr-2" /> CARREGAR MENSAGENS ANTERIORES</>
                )}
              </Button>
            </div>
          )}
          {roomMsgs.map((msg, idx) => {
            const isMe = msg.sender_id === currentUserId
            const sender = employees.find((e) => e.user_id === msg.sender_id)
            const showName =
              isGroup && !isMe && (idx === 0 || roomMsgs[idx - 1].sender_id !== msg.sender_id)

            return (
              <div key={msg.id} className={cn('flex flex-col', isMe ? 'items-end' : 'items-start')}>
                {showName && sender && (
                  <span className="text-[10px] font-bold text-muted-foreground mb-1 ml-1 uppercase">
                    {sender.name}
                  </span>
                )}
                <div
                  className={cn(
                    'max-w-[85%] md:max-w-[75%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words shadow-sm',
                    isMe
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted text-foreground rounded-tl-sm',
                  )}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                  {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )
          })}
          <div ref={scrollRef} className="h-1" />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-card shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="DIGITE SUA MENSAGEM..."
            className="flex-1 min-h-[44px] max-h-32 bg-background border rounded-md px-3 py-2.5 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary uppercase transition-shadow"
            rows={1}
            disabled={isRoomLoading}
          />
          <Button
            type="button"
            onClick={handleSend}
            size="icon"
            className="h-[44px] w-[44px] shrink-0 font-bold"
            disabled={!input.trim() || isRoomLoading}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {activeRoom && isGroup && (
        <ManageGroupDialog roomId={activeRoom.id} open={manageOpen} onOpenChange={setManageOpen} />
      )}
    </div>
  )
}
