import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2 } from 'lucide-react'

export function Ser5sList({ refreshKey }: { refreshKey: number }) {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true)
      const { data: subsData } = await supabase
        .from('ser_5s_submissions' as any)
        .select('*')
        .order('created_at', { ascending: false })

      if (subsData && subsData.length > 0) {
        const userIds = [...new Set(subsData.map((s) => s.user_id))]
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', userIds)

        const profilesMap = (profilesData || []).reduce(
          (acc, p) => {
            acc[p.id] = p.name
            return acc
          },
          {} as Record<string, string>,
        )

        const enhancedSubs = subsData.map((s) => ({
          ...s,
          user_name: profilesMap[s.user_id] || 'Colaborador',
        }))
        setSubmissions(enhancedSubs)
      } else {
        setSubmissions([])
      }
      setLoading(false)
    }
    fetchSubmissions()
  }, [refreshKey])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm font-medium uppercase tracking-wider bg-white rounded-xl border border-slate-100 shadow-sm mt-6">
        Nenhum registro encontrado.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {submissions.map((sub) => (
        <Card
          key={sub.id}
          className="overflow-hidden border-t-4 border-t-emerald-500 shadow-sm hover:shadow-md transition-all"
        >
          <div className="aspect-video w-full bg-slate-100 relative group">
            <img
              src={sub.photo_url}
              alt="5S"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <CardContent className="p-4 space-y-2 bg-white relative z-10">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded uppercase tracking-widest">
                {sub.reference_week}
              </span>
              <span className="text-xs font-medium text-slate-400">
                {format(new Date(sub.created_at), 'dd/MM/yyyy', { locale: ptBR })}
              </span>
            </div>
            <p className="font-bold text-sm text-slate-800 uppercase tracking-wide truncate">
              {sub.user_name}
            </p>
            {sub.notes && (
              <p className="text-xs text-slate-500 line-clamp-2 mt-2 pt-2 border-t border-slate-100 normal-case">
                {sub.notes}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
