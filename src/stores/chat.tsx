import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { playNotificationSound } from '@/lib/audio'
import { toast } from '@/components/ui/use-toast'

export type ChatRoom = {
  id: string
  name: string | null
  type: 'individual' | 'group'
  department: string | null
  other_user_id?: string
  created_at?: string
}

export type ChatMessage = {
  id: string
  room_id: string
  sender_id: string
  content: string
  created_at: string
}

interface ChatStore {
  rooms: ChatRoom[]
  messages: Record<string, ChatMessage[]>
  unreadCounts: Record<string, number>
  onlineUsers: string[]
  activeRoomId: string | null
  isLoadingRoom: boolean
  openIndividualRoom: (userId: string) => Promise<void>
  openGroupRoom: (dept: string) => Promise<void>
  sendMessage: (roomId: string, content: string) => Promise<void>
  closeRoom: () => void
}

const ChatContext = createContext<ChatStore | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({})
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null)
  const [isLoadingRoom, setIsLoadingRoom] = useState(false)

  const activeRoomIdRef = useRef<string | null>(null)

  useEffect(() => {
    activeRoomIdRef.current = activeRoomId
  }, [activeRoomId])

  const fetchMyRooms = useCallback(async () => {
    if (!user || !user.id) return
    try {
      const { data: myParts, error: partsError } = await supabase
        .from('chat_participants')
        .select('room_id')
        .eq('user_id', user.id)

      if (partsError) {
        console.error('Error fetching chat participants', partsError)
        return
      }

      if (!myParts || myParts.length === 0) {
        setRooms([])
        return
      }

      const roomIds = myParts.map((p) => p.room_id)
      if (roomIds.length === 0) return

      const { data: roomsData, error: roomsError } = await supabase
        .from('chat_rooms')
        .select('*')
        .in('id', roomIds)

      if (roomsError) {
        console.error('Error fetching chat rooms', roomsError)
        return
      }

      const indRooms = roomsData?.filter((r) => r.type === 'individual').map((r) => r.id) || []
      const otherUsers: Record<string, string> = {}

      if (indRooms.length > 0) {
        const { data: others } = await supabase
          .from('chat_participants')
          .select('room_id, user_id')
          .in('room_id', indRooms)
          .neq('user_id', user.id)
        others?.forEach((o) => {
          otherUsers[o.room_id] = o.user_id
        })
      }

      setRooms(
        roomsData?.map((r) => ({
          ...r,
          other_user_id: r.type === 'individual' ? otherUsers[r.id] : undefined,
        })) || [],
      )
    } catch (err) {
      console.warn('Error in fetchMyRooms:', err)
    }
  }, [user])

  const fetchUnread = useCallback(async () => {
    if (!user || !user.id) return
    try {
      const { data, error } = await supabase.rpc('get_unread_counts', { user_id_param: user.id })
      if (error) {
        console.error('Error fetching unread counts', error)
        return
      }
      if (data) {
        const counts: Record<string, number> = {}
        data.forEach((r: any) => (counts[r.room_id] = Number(r.unread_count)))
        setUnreadCounts(counts)
      }
    } catch (err) {
      console.warn('Error in fetchUnread:', err)
    }
  }, [user])

  const markRoomAsRead = useCallback(
    async (roomId: string) => {
      if (!user || !user.id) return
      try {
        await supabase.rpc('mark_room_read', { p_room_id: roomId, p_user_id: user.id })
        setUnreadCounts((prev) => ({ ...prev, [roomId]: 0 }))
      } catch (err) {
        console.warn('Error marking room as read:', err)
      }
    },
    [user],
  )

  const handleNewMessage = useCallback(
    (msg: ChatMessage) => {
      setMessages((prev) => {
        const list = prev[msg.room_id] || []
        if (list.find((m) => m.id === msg.id)) return prev
        return { ...prev, [msg.room_id]: [...list, msg] }
      })

      if (msg.sender_id !== user?.id) {
        const isRoomActive = activeRoomIdRef.current === msg.room_id
        if (!isRoomActive || document.hidden) {
          playNotificationSound()
          setUnreadCounts((prev) => ({ ...prev, [msg.room_id]: (prev[msg.room_id] || 0) + 1 }))
        } else {
          markRoomAsRead(msg.room_id)
        }
      }
    },
    [user?.id, markRoomAsRead],
  )

  useEffect(() => {
    if (!user || !user.id) return

    fetchMyRooms()
    fetchUnread()

    const messageChannel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          handleNewMessage(payload.new as ChatMessage)
        },
      )
      .subscribe()

    const participantChannel = supabase
      .channel('chat_participants_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_participants',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchUnread()
        },
      )
      .subscribe()

    const presenceChannel = supabase.channel('chat_presence', {
      config: { presence: { key: user.id } },
    })

    presenceChannel.on('presence', { event: 'sync' }, () => {
      const state = presenceChannel.presenceState()
      setOnlineUsers(Object.keys(state))
    })

    presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await presenceChannel.track({ online_at: new Date().toISOString() })
      }
    })

    return () => {
      supabase.removeChannel(messageChannel)
      supabase.removeChannel(participantChannel)
      supabase.removeChannel(presenceChannel)
    }
  }, [user, fetchMyRooms, fetchUnread, handleNewMessage])

  const loadMessages = async (roomId: string) => {
    if (!roomId) return
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(300)

      if (error) {
        console.error('Error loading messages', error)
        toast({
          title: 'Aviso',
          description: 'Pode haver um atraso ao carregar o histórico de mensagens.',
          variant: 'default',
        })
        return
      }

      if (data) {
        setMessages((prev) => ({ ...prev, [roomId]: data }))
      }
    } catch (err) {
      console.warn('Error in loadMessages:', err)
    }
  }

  const logAudit = async (action: string) => {
    if (!user || !user.id) return
    try {
      await supabase.from('audit_logs').insert([
        {
          user_id: user.id,
          action: action,
        },
      ])
    } catch (err) {
      console.warn('Error logging audit for chat:', err)
    }
  }

  const openIndividualRoom = async (userId: string) => {
    if (!user || !user.id || !userId) return
    setIsLoadingRoom(true)
    try {
      const { data: roomId, error } = await supabase.rpc('get_or_create_individual_room', {
        user1: user.id,
        user2: userId,
      })

      if (error) {
        console.error('Error calling get_or_create_individual_room RPC:', error)
        throw error
      }

      if (roomId && typeof roomId === 'string') {
        const existingRoom = rooms.find((r) => r.id === roomId)

        if (!existingRoom) {
          const { data: newRoomData, error: fetchError } = await supabase
            .from('chat_rooms')
            .select('*')
            .eq('id', roomId)
            .maybeSingle()

          if (fetchError) {
            console.error('Error fetching chat room', fetchError)
          }

          if (newRoomData) {
            setRooms((prev) => {
              if (prev.find((r) => r.id === roomId)) return prev
              return [...prev, { ...newRoomData, other_user_id: userId }] as ChatRoom[]
            })
          } else {
            console.warn(
              `Room with ID ${roomId} not found immediately after creation. Using fallback state.`,
            )
            setRooms((prev) => {
              if (prev.find((r) => r.id === roomId)) return prev
              return [
                ...prev,
                {
                  id: roomId,
                  type: 'individual',
                  name: null,
                  department: null,
                  other_user_id: userId,
                  created_at: new Date().toISOString(),
                },
              ] as ChatRoom[]
            })
          }
        }

        setActiveRoomId(roomId)
        markRoomAsRead(roomId)
        await loadMessages(roomId)
        logAudit(`INICIOU CONVERSA COM COLABORADOR ID: ${userId}`)
      } else {
        console.warn('Invalid room ID returned from RPC:', roomId)
      }
    } catch (error: any) {
      console.error('Error opening individual room:', error)
      toast({
        title: 'Aviso',
        description: 'Pode haver um pequeno atraso ao iniciar a conversa.',
        variant: 'default',
      })
    } finally {
      setIsLoadingRoom(false)
    }
  }

  const openGroupRoom = async (dept: string) => {
    if (!user || !user.id || !dept) return
    setIsLoadingRoom(true)
    try {
      const { data: roomId, error } = await supabase.rpc('get_or_create_group_room', {
        dept_name: dept,
        creator_id: user.id,
      })

      if (error) {
        console.error('Error calling get_or_create_group_room RPC:', error)
        throw error
      }

      if (roomId && typeof roomId === 'string') {
        const existingRoom = rooms.find((r) => r.id === roomId)

        if (!existingRoom) {
          const { data: newRoomData, error: fetchError } = await supabase
            .from('chat_rooms')
            .select('*')
            .eq('id', roomId)
            .maybeSingle()

          if (fetchError) {
            console.error('Error fetching chat room', fetchError)
          }

          if (newRoomData) {
            setRooms((prev) => {
              if (prev.find((r) => r.id === roomId)) return prev
              return [...prev, newRoomData as ChatRoom]
            })
          } else {
            console.warn(
              `Group room with ID ${roomId} not found immediately. Using fallback state.`,
            )
            setRooms((prev) => {
              if (prev.find((r) => r.id === roomId)) return prev
              return [
                ...prev,
                {
                  id: roomId,
                  type: 'group',
                  name: dept,
                  department: dept,
                  created_at: new Date().toISOString(),
                },
              ] as ChatRoom[]
            })
          }
        }

        setActiveRoomId(roomId)
        markRoomAsRead(roomId)
        await loadMessages(roomId)
        logAudit(`ENTROU NO CANAL DO SETOR: ${dept}`)
      } else {
        console.warn('Invalid room ID returned from RPC:', roomId)
      }
    } catch (error: any) {
      console.error('Error opening group room:', error)
      toast({
        title: 'Aviso',
        description: 'Pode haver um pequeno atraso ao entrar no grupo.',
        variant: 'default',
      })
    } finally {
      setIsLoadingRoom(false)
    }
  }

  const closeRoom = () => setActiveRoomId(null)

  const sendMessage = async (roomId: string, content: string) => {
    if (!user || !user.id || !content.trim()) return
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({ room_id: roomId, sender_id: user.id, content: content.trim() })
        .select()
        .maybeSingle()

      if (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível enviar a mensagem. Verifique sua conexão.',
          variant: 'destructive',
        })
        return
      }

      if (data) {
        setMessages((prev) => {
          const list = prev[roomId] || []
          if (list.find((m) => m.id === data.id)) return prev
          return { ...prev, [roomId]: [...list, data as ChatMessage] }
        })
      }
    } catch (err) {
      console.error('Error in sendMessage:', err)
    }
  }

  const value = {
    rooms,
    messages,
    unreadCounts,
    onlineUsers,
    activeRoomId,
    isLoadingRoom,
    openIndividualRoom,
    openGroupRoom,
    sendMessage,
    closeRoom,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChatStore() {
  const context = useContext(ChatContext)
  if (!context) throw new Error('useChatStore must be used within ChatProvider')
  return context
}
