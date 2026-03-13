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
  openRoom: (roomId: string) => Promise<void>
  createGroupRoom: (name: string) => Promise<void>
  addGroupParticipant: (roomId: string, userId: string) => Promise<void>
  removeGroupParticipant: (roomId: string, userId: string) => Promise<void>
  getGroupParticipants: (roomId: string) => Promise<string[]>
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
      if (partsError || !myParts || myParts.length === 0) {
        setRooms([])
        return
      }

      const roomIds = myParts.map((p) => p.room_id)
      const { data: roomsData, error: roomsError } = await supabase
        .from('chat_rooms')
        .select('*')
        .in('id', roomIds)
      if (roomsError) return

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
      const { data } = await supabase.rpc('get_unread_counts', { user_id_param: user.id })
      if (data) {
        const counts: Record<string, number> = {}
        data.forEach((r: any) => (counts[r.room_id] = Number(r.unread_count)))
        setUnreadCounts(counts)
      }
    } catch (err) {}
  }, [user])

  const markRoomAsRead = useCallback(
    async (roomId: string) => {
      if (!user || !user.id) return
      try {
        await supabase.rpc('mark_room_read', { p_room_id: roomId, p_user_id: user.id })
        setUnreadCounts((prev) => ({ ...prev, [roomId]: 0 }))
      } catch (err) {}
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
        () => fetchUnread(),
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_participants',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchMyRooms(),
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'chat_participants',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchMyRooms(),
      )
      .subscribe()

    const presenceChannel = supabase.channel('chat_presence', {
      config: { presence: { key: user.id } },
    })
    presenceChannel.on('presence', { event: 'sync' }, () =>
      setOnlineUsers(Object.keys(presenceChannel.presenceState())),
    )
    presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED')
        await presenceChannel.track({ online_at: new Date().toISOString() })
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
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(300)
      if (data) setMessages((prev) => ({ ...prev, [roomId]: data }))
    } catch (err) {}
  }

  const logAudit = async (action: string) => {
    if (!user || !user.id) return
    try {
      await supabase.from('audit_logs').insert([{ user_id: user.id, action }])
    } catch (err) {}
  }

  const openRoom = async (roomId: string) => {
    if (!roomId) return
    setActiveRoomId(roomId)
    markRoomAsRead(roomId)
    await loadMessages(roomId)
  }

  const createGroupRoom = async (name: string) => {
    if (!user || !user.id || !name.trim()) return
    setIsLoadingRoom(true)
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .insert({ name: name.trim(), type: 'group' })
        .select()
        .single()
      if (error) throw error
      if (data) {
        await supabase.from('chat_participants').insert({ room_id: data.id, user_id: user.id })
        setRooms((prev) => [...prev, data as ChatRoom])
        openRoom(data.id)
        logAudit(`CRIOU GRUPO DE CHAT: ${name}`)
      }
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o grupo.',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingRoom(false)
    }
  }

  const addGroupParticipant = async (roomId: string, userId: string) => {
    try {
      await supabase.from('chat_participants').insert({ room_id: roomId, user_id: userId })
      logAudit(`ADICIONOU USUÁRIO AO GRUPO ID: ${roomId}`)
    } catch (err) {}
  }

  const removeGroupParticipant = async (roomId: string, userId: string) => {
    try {
      await supabase.from('chat_participants').delete().match({ room_id: roomId, user_id: userId })
      logAudit(`REMOVEU USUÁRIO DO GRUPO ID: ${roomId}`)
      if (userId === user?.id) {
        setRooms((prev) => prev.filter((r) => r.id !== roomId))
        if (activeRoomId === roomId) setActiveRoomId(null)
      }
    } catch (err) {}
  }

  const getGroupParticipants = async (roomId: string) => {
    try {
      const { data } = await supabase
        .from('chat_participants')
        .select('user_id')
        .eq('room_id', roomId)
      return (data?.map((d) => d.user_id).filter(Boolean) as string[]) || []
    } catch (err) {
      return []
    }
  }

  const openIndividualRoom = async (userId: string) => {
    if (!user || !user.id || !userId) return
    setIsLoadingRoom(true)
    try {
      const { data: roomId } = await supabase.rpc('get_or_create_individual_room', {
        user1: user.id,
        user2: userId,
      })
      if (roomId && typeof roomId === 'string') {
        const existingRoom = rooms.find((r) => r.id === roomId)
        if (!existingRoom) {
          const { data: newRoomData } = await supabase
            .from('chat_rooms')
            .select('*')
            .eq('id', roomId)
            .maybeSingle()
          if (newRoomData) {
            setRooms((prev) =>
              prev.find((r) => r.id === roomId)
                ? prev
                : [...prev, { ...newRoomData, other_user_id: userId } as ChatRoom],
            )
          }
        }
        openRoom(roomId)
        logAudit(`INICIOU CONVERSA COM COLABORADOR ID: ${userId}`)
      }
    } catch (error: any) {
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
          description: 'Não foi possível enviar a mensagem.',
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
    } catch (err) {}
  }

  return (
    <ChatContext.Provider
      value={{
        rooms,
        messages,
        unreadCounts,
        onlineUsers,
        activeRoomId,
        isLoadingRoom,
        openIndividualRoom,
        openRoom,
        createGroupRoom,
        addGroupParticipant,
        removeGroupParticipant,
        getGroupParticipants,
        sendMessage,
        closeRoom,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatStore() {
  const context = useContext(ChatContext)
  if (!context) throw new Error('useChatStore must be used within ChatProvider')
  return context
}
