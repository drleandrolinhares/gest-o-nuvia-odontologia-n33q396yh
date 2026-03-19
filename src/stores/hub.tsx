import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { differenceInMinutes } from 'date-fns'

export type HubAnnouncement = {
  id: string
  title: string
  content: string
  active: boolean
  created_by: string
  created_at: string
}

export type HubAnnouncementRead = {
  id: string
  user_id: string
  announcement_id: string
  read_at: string
  points_earned: number
}

export type HubFeedback = {
  id: string
  user_id: string
  excellent_content: string
  improvement_content: string
  points_earned: number
  created_at: string
}

export type RankingItem = {
  user_id: string
  employee_id: string
  employee_name: string
  total_points: number
}

interface HubStore {
  announcements: HubAnnouncement[]
  reads: HubAnnouncementRead[]
  feedbacks: HubFeedback[]
  unreadAnnouncements: HubAnnouncement[]
  isLoading: boolean
  fetchAnnouncements: () => Promise<void>
  createAnnouncement: (title: string, content: string) => Promise<{ success: boolean; error?: any }>
  updateAnnouncement: (
    id: string,
    data: Partial<HubAnnouncement>,
  ) => Promise<{ success: boolean; error?: any }>
  deleteAnnouncement: (id: string) => Promise<{ success: boolean; error?: any }>
  markAsRead: (announcement: HubAnnouncement) => Promise<{ success: boolean; error?: any }>
  submitFeedback: (
    excellent: string,
    improvement: string,
  ) => Promise<{ success: boolean; error?: any }>
  getRanking: (year: number, month: number) => Promise<RankingItem[]>
  fetchAllFeedbacks: () => Promise<HubFeedback[]>
  fetchAllReadsForAnnouncement: (announcementId: string) => Promise<HubAnnouncementRead[]>
}

const HubContext = createContext<HubStore | undefined>(undefined)

export function HubProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState<HubAnnouncement[]>([])
  const [reads, setReads] = useState<HubAnnouncementRead[]>([])
  const [feedbacks, setFeedbacks] = useState<HubFeedback[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchAnnouncements = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const [{ data: annData }, { data: readsData }, { data: fbData }] = await Promise.all([
        supabase.from('hub_announcements').select('*').order('created_at', { ascending: false }),
        supabase.from('hub_announcement_reads').select('*').eq('user_id', user.id),
        supabase
          .from('hub_feedbacks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ])

      if (annData) setAnnouncements(annData)
      if (readsData) setReads(readsData)
      if (fbData) setFeedbacks(fbData)
    } catch (err) {
      console.error('Error fetching hub data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) fetchAnnouncements()
    else setIsLoading(false)
  }, [fetchAnnouncements, user])

  const unreadAnnouncements = announcements
    .filter((a) => a.active && !reads.some((r) => r.announcement_id === a.id))
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  const createAnnouncement = async (title: string, content: string) => {
    if (!user) return { success: false }
    try {
      const { data, error } = await supabase
        .from('hub_announcements')
        .insert([{ title, content, created_by: user.id }])
        .select()
        .single()
      if (error) throw error
      if (data) setAnnouncements((prev) => [data, ...prev])
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const updateAnnouncement = async (id: string, data: Partial<HubAnnouncement>) => {
    try {
      const { error } = await supabase.from('hub_announcements').update(data).eq('id', id)
      if (error) throw error
      setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)))
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const deleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase.from('hub_announcements').delete().eq('id', id)
      if (error) throw error
      setAnnouncements((prev) => prev.filter((a) => a.id !== id))
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const markAsRead = async (announcement: HubAnnouncement) => {
    if (!user) return { success: false }
    try {
      const diffMinutes = differenceInMinutes(new Date(), new Date(announcement.created_at))
      let points = 5
      if (diffMinutes <= 10) points = 30
      else if (diffMinutes <= 60) points = 10

      const { data, error } = await supabase
        .from('hub_announcement_reads')
        .insert([
          {
            user_id: user.id,
            announcement_id: announcement.id,
            points_earned: points,
          },
        ])
        .select()
        .single()

      if (error) throw error
      if (data) setReads((prev) => [...prev, data])
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const submitFeedback = async (excellent: string, improvement: string) => {
    if (!user) return { success: false }
    try {
      const { data, error } = await supabase
        .from('hub_feedbacks')
        .insert([
          {
            user_id: user.id,
            excellent_content: excellent,
            improvement_content: improvement,
            points_earned: 50,
          },
        ])
        .select()
        .single()

      if (error) throw error
      if (data) setFeedbacks((prev) => [data, ...prev])
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const getRanking = async (year: number, month: number) => {
    try {
      const { data, error } = await supabase.rpc('get_monthly_ranking', {
        year_val: year,
        month_val: month,
      })
      if (error) throw error
      return data as RankingItem[]
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const fetchAllFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('hub_feedbacks')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as HubFeedback[]
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const fetchAllReadsForAnnouncement = async (announcementId: string) => {
    try {
      const { data, error } = await supabase
        .from('hub_announcement_reads')
        .select('*')
        .eq('announcement_id', announcementId)
      if (error) throw error
      return data as HubAnnouncementRead[]
    } catch (error) {
      console.error(error)
      return []
    }
  }

  return (
    <HubContext.Provider
      value={{
        announcements,
        reads,
        feedbacks,
        unreadAnnouncements,
        isLoading,
        fetchAnnouncements,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        markAsRead,
        submitFeedback,
        getRanking,
        fetchAllFeedbacks,
        fetchAllReadsForAnnouncement,
      }}
    >
      {children}
    </HubContext.Provider>
  )
}

export function useHubStore() {
  const context = useContext(HubContext)
  if (!context) throw new Error('useHubStore must be used within HubProvider')
  return context
}
