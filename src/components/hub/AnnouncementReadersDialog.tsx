import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useHubStore, HubAnnouncementRead } from '@/stores/hub'
import useAppStore from '@/stores/main'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CheckCircle2, Clock, Users } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Props {
  announcementId: string | null
  onClose: () => void
}

const getAvatarUrl = (id: string) => {
  if (!id) return ''
  const seed = (id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100) + 1
  return `https://img.usecurling.com/ppl/thumbnail?seed=${seed}`
}

export function AnnouncementReadersDialog({ announcementId, onClose }: Props) {
  const { fetchAllReadsForAnnouncement } = useHubStore()
  const { employees } = useAppStore()
  const [reads, setReads] = useState<HubAnnouncementRead[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (announcementId) {
      setLoading(true)
      fetchAllReadsForAnnouncement(announcementId).then((data) => {
        setReads(data)
        setLoading(false)
      })
    }
  }, [announcementId, fetchAllReadsForAnnouncement])

  const activeEmployees = employees
    .filter((e) => e.status !== 'Desligado' && e.user_id)
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <Dialog open={!!announcementId} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[80vh] flex flex-col uppercase">
        <DialogHeader className="shrink-0 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-nuvia-navy">
            <Users className="h-5 w-5 text-primary" /> HISTÓRICO DE LEITURAS
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-4 space-y-2 pr-2 custom-scrollbar">
          {loading ? (
            <p className="text-center text-muted-foreground py-10 font-bold">CARREGANDO...</p>
          ) : (
            activeEmployees.map((emp) => {
              const read = reads.find((r) => r.user_id === emp.user_id)
              return (
                <div
                  key={emp.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border shadow-sm">
                      <AvatarImage src={getAvatarUrl(emp.id)} />
                      <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-slate-800">{emp.name}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {emp.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {read ? (
                      <div className="flex flex-col items-end text-emerald-600">
                        <span className="flex items-center gap-1 text-xs font-black tracking-wider">
                          <CheckCircle2 className="h-3.5 w-3.5" /> LIDO
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          {format(new Date(read.read_at), 'dd/MM HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs tracking-wider bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        <Clock className="h-3.5 w-3.5" /> PENDENTE
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
