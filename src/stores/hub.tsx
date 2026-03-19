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

export type MonthlyReading = {
  id: string
  user_id: string
  submission_date: string
  reference_month: string
  material_name: string
  main_learning: string
  practical_application: string
  observations?: string
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
  allReads: HubAnnouncementRead[]
  feedbacks: HubFeedback[]
  monthlyReadings: MonthlyReading[]
  unreadAnnouncements: HubAnnouncement[]
  isLoading: boolean
  fetchAnnouncements: () => Promise<void>
  createAnnouncement: (title: string, content: string) => Promise<{ success: boolean; error?: any }>
  updateAnnouncement: (
    id: string,
    data: Partial<HubAnnouncement>,
  ) => Promise<{ success: boolean; error?: any }>
  deleteAnnouncement: (id: string) => Promise<{ success: boolean; error?: any }>
  markAsRead: (
    announcement: HubAnnouncement,
  ) => Promise<{ success: boolean; points?: number; error?: any }>
  submitFeedback: (
    excellent: string,
    improvement: string,
  ) => Promise<{ success: boolean; error?: any }>
  getRanking: (year: number, month: number) => Promise<RankingItem[]>
  fetchAllFeedbacks: () => Promise<HubFeedback[]>
  fetchAllReadsForAnnouncement: (announcementId: string) => Promise<HubAnnouncementRead[]>
  submitMonthlyReading: (
    data: Omit<MonthlyReading, 'id' | 'user_id' | 'submission_date' | 'created_at'>,
  ) => Promise<{ success: boolean; error?: any }>
}

const HubContext = createContext<HubStore | undefined>(undefined)

export function HubProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState<HubAnnouncement[]>([])
  const [allReads, setAllReads] = useState<HubAnnouncementRead[]>([])
  const [feedbacks, setFeedbacks] = useState<HubFeedback[]>([])
  const [monthlyReadings, setMonthlyReadings] = useState<MonthlyReading[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchAnnouncements = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const [{ data: annData }, { data: readsData }, { data: fbData }, { data: readingData }] =
        await Promise.all([
          supabase.from('hub_announcements').select('*').order('created_at', { ascending: false }),
          supabase.from('hub_announcement_reads').select('*'),
          supabase
            .from('hub_feedbacks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('monthly_readings' as any)
            .select('*')
            .order('reference_month', { ascending: false }),
        ])

      if (annData) setAnnouncements(annData)
      if (readsData) setAllReads(readsData)
      if (fbData) setFeedbacks(fbData)
      if (readingData) setMonthlyReadings(readingData)
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
    .filter(
      (a) =>
        a.active && !allReads.some((r) => r.announcement_id === a.id && r.user_id === user?.id),
    )
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
      let points = 0
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
      if (data) setAllReads((prev) => [...prev, data])
      return { success: true, points }
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

  const submitMonthlyReading = async (
    data: Omit<MonthlyReading, 'id' | 'user_id' | 'submission_date' | 'created_at'>,
  ) => {
    if (!user) return { success: false }
    try {
      const { data: result, error } = await supabase
        .from('monthly_readings' as any)
        .insert([{ ...data, user_id: user.id }])
        .select()
        .single()

      if (error) throw error
      if (result) {
        setMonthlyReadings((prev) =>
          [result, ...prev].sort((a, b) => b.reference_month.localeCompare(a.reference_month)),
        )
      }
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
        allReads,
        feedbacks,
        monthlyReadings,
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
        submitMonthlyReading,
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
