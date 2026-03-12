import { useState, useRef, useEffect, useMemo } from 'react'
import { Send, Users, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useChatStore } from '@/stores/chat'
import useAppStore from '@/stores/main'
import { cn } from '@/lib/utils'

export function ChatWindow() {
  const [input, setInput] = useState('')
  const { activeRoomId, rooms, messages, sendMessage, onlineUsers, isLoadingRoom } = useChatStore()
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

  if (isLoadingRoom) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-muted/20 text-muted-foreground p-8 text-center uppercase">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <h3 className="text-lg font-bold">CARREGANDO CONVERSA...</h3>
      </div>
    )
  }

  if (!activeRoomId || !activeRoom) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-muted/20 text-muted-foreground p-8 text-center uppercase">
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

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(activeRoomId, input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-background h-full">
      <div className="h-16 border-b flex items-center px-6 shrink-0 bg-card">
        {isGroup ? (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/20 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground uppercase">{activeRoom.department}</h3>
              <p className="text-xs text-muted-foreground uppercase">CANAL DO SETOR</p>
            </div>
          </div>
        ) : targetUser ? (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 border">
                <AvatarFallback className="bg-muted font-bold text-sm">
                  {targetUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background',
                  isOnline ? 'bg-emerald-500' : 'bg-slate-300',
                )}
              />
            </div>
            <div>
              <h3 className="font-bold text-foreground uppercase">{targetUser.name}</h3>
              <p className="text-xs text-muted-foreground uppercase">
                {isOnline ? 'ONLINE' : 'OFFLINE'} • {targetUser.role}
              </p>
            </div>
          </div>
        ) : (
          <h3 className="font-bold">USUÁRIO DESCONHECIDO</h3>
        )}
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4 pb-4">
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
                    'max-w-[75%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words',
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
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-card shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="DIGITE SUA MENSAGEM..."
            className="flex-1 min-h-[44px] max-h-32 bg-background border rounded-md px-3 py-2.5 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary uppercase"
            rows={1}
          />
          <Button onClick={handleSend} size="icon" className="h-[44px] w-[44px] shrink-0">
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2 uppercase tracking-widest">
          PRESSIONE ENTER PARA ENVIAR
        </p>
      </div>
    </div>
  )
}
