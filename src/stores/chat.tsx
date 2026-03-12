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

export type ChatRoom = {
  id: string
  name: string | null
  type: 'individual' | 'group'
  department: string | null
  other_user_id?: string
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

  const activeRoomIdRef = useRef<string | null>(null)

  useEffect(() => {
    activeRoomIdRef.current = activeRoomId
  }, [activeRoomId])

  const fetchMyRooms = useCallback(async () => {
    if (!user) return
    const { data: myParts } = await supabase
      .from('chat_participants')
      .select('room_id')
      .eq('user_id', user.id)
    if (!myParts || myParts.length === 0) return

    const roomIds = myParts.map((p) => p.room_id)
    const { data: roomsData } = await supabase.from('chat_rooms').select('*').in('id', roomIds)

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
  }, [user])

  const fetchUnread = useCallback(async () => {
    if (!user) return
    const { data } = await supabase.rpc('get_unread_counts', { user_id_param: user.id })
    if (data) {
      const counts: Record<string, number> = {}
      data.forEach((r: any) => (counts[r.room_id] = Number(r.unread_count)))
      setUnreadCounts(counts)
    }
  }, [user])

  const markRoomAsRead = useCallback(
    async (roomId: string) => {
      if (!user) return
      await supabase.rpc('mark_room_read', { p_room_id: roomId, p_user_id: user.id })
      setUnreadCounts((prev) => ({ ...prev, [roomId]: 0 }))
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
    if (!user) return

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
      supabase.removeChannel(presenceChannel)
    }
  }, [user, fetchMyRooms, fetchUnread, handleNewMessage])

  const loadMessages = async (roomId: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(300)
    if (data) {
      setMessages((prev) => ({ ...prev, [roomId]: data }))
    }
  }

  const openIndividualRoom = async (userId: string) => {
    if (!user) return
    const { data: roomId } = await supabase.rpc('get_or_create_individual_room', {
      user1: user.id,
      user2: userId,
    })
    if (roomId) {
      if (!rooms.find((r) => r.id === roomId)) await fetchMyRooms()
      setActiveRoomId(roomId)
      markRoomAsRead(roomId)
      loadMessages(roomId)
    }
  }

  const openGroupRoom = async (dept: string) => {
    if (!user) return
    const { data: roomId } = await supabase.rpc('get_or_create_group_room', {
      dept_name: dept,
      creator_id: user.id,
    })
    if (roomId) {
      if (!rooms.find((r) => r.id === roomId)) await fetchMyRooms()
      setActiveRoomId(roomId)
      markRoomAsRead(roomId)
      loadMessages(roomId)
    }
  }

  const closeRoom = () => setActiveRoomId(null)

  const sendMessage = async (roomId: string, content: string) => {
    if (!user || !content.trim()) return
    const { data } = await supabase
      .from('chat_messages')
      .insert({ room_id: roomId, sender_id: user.id, content: content.trim() })
      .select()
      .single()

    if (data) {
      setMessages((prev) => {
        const list = prev[roomId] || []
        if (list.find((m) => m.id === data.id)) return prev
        return { ...prev, [roomId]: [...list, data as ChatMessage] }
      })
    }
  }

  const value = {
    rooms,
    messages,
    unreadCounts,
    onlineUsers,
    activeRoomId,
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
