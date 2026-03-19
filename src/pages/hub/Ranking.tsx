import { useState, useEffect } from 'react'
import { useHubStore, RankingItem } from '@/stores/hub'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trophy, Medal, Star } from 'lucide-react'
import { Podium } from '@/components/hub/Podium'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const getAvatarUrl = (id: string) => {
  if (!id) return ''
  const seed = (id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100) + 1
  return `https://img.usecurling.com/ppl/thumbnail?seed=${seed}`
}

const MONTHS = [
  { val: 1, label: 'JANEIRO' },
  { val: 2, label: 'FEVEREIRO' },
  { val: 3, label: 'MARÇO' },
  { val: 4, label: 'ABRIL' },
  { val: 5, label: 'MAIO' },
  { val: 6, label: 'JUNHO' },
  { val: 7, label: 'JULHO' },
  { val: 8, label: 'AGOSTO' },
  { val: 9, label: 'SETEMBRO' },
  { val: 10, label: 'OUTUBRO' },
  { val: 11, label: 'NOVEMBRO' },
  { val: 12, label: 'DEZEMBRO' },
]

export default function Ranking() {
  const { getRanking } = useHubStore()
  const [ranking, setRanking] = useState<RankingItem[]>([])
  const [loading, setLoading] = useState(true)

  const now = new Date()
  const [month, setMonth] = useState<number>(now.getMonth() + 1)
  const [year, setYear] = useState<number>(now.getFullYear())

  useEffect(() => {
    setLoading(true)
    getRanking(year, month).then((data) => {
      setRanking(data.filter((r) => r.total_points > 0))
      setLoading(false)
    })
  }, [year, month, getRanking])

  const others = ranking.slice(3)

  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div className="bg-[#0A192F] p-6 rounded-xl shadow-lg border border-[#D4AF37]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-black tracking-widest text-[#D4AF37] flex items-center gap-3">
            <Trophy className="h-7 w-7 text-white" /> RANKING DE PERFORMANCE
          </h1>
          <p className="text-slate-300 mt-1.5 text-xs font-bold tracking-widest uppercase">
            ACOMPANHE O ENGAJAMENTO E PONTUAÇÃO DO TIME
          </p>
        </div>
        <div className="flex items-center gap-2 relative z-10 bg-white/10 p-1 rounded-lg border border-white/10 backdrop-blur-sm">
          <Select value={month.toString()} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-32 bg-transparent text-white border-none font-bold tracking-widest h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.val} value={m.val.toString()} className="font-bold">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year.toString()} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-24 bg-transparent text-white border-none font-bold tracking-widest h-9 border-l border-white/20 rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[year - 1, year, year + 1].map((y) => (
                <SelectItem key={y} value={y.toString()} className="font-bold">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : ranking.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-white/50">
          <Medal className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <p className="font-bold text-base tracking-widest">NENHUM PONTO REGISTRADO NESTE MÊS.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <Card className="border-none shadow-xl bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0A192F]/5 to-transparent"></div>
            <CardContent className="p-0 relative z-10">
              <Podium items={ranking} />
            </CardContent>
          </Card>

          {others.length > 0 && (
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
              <div className="bg-slate-50 p-4 border-b">
                <h3 className="font-black text-sm tracking-widest text-slate-600 flex items-center gap-2">
                  <Star className="h-4 w-4" /> DEMAIS PARTICIPANTES
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {others.map((item, idx) => (
                  <div
                    key={item.user_id}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-slate-400 w-6 text-center">
                        {idx + 4}º
                      </span>
                      <Avatar className="h-10 w-10 border shadow-sm">
                        <AvatarImage src={getAvatarUrl(item.employee_id)} />
                        <AvatarFallback>{item.employee_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-sm text-slate-800">{item.employee_name}</span>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black tracking-wider">
                      {item.total_points} PTS
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
