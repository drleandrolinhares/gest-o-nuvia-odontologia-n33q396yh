import { useState, useMemo } from 'react'
import { Plus, Trash2, TrendingUp, Users, CalendarCheck, PhoneCall, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export interface LeadEntry {
  id: string
  date: string
  channel: string
  investment: number
  newLeads: number
  scheduled: number
  attended: number
  followUpContacts: number
  rescued: number
}

const CHANNELS = ['Instagram', 'Google', 'Indicação', 'WhatsApp', 'Outros']

function KpiCard({
  title,
  icon: Icon,
  color,
  value,
  description,
}: {
  title: string
  icon: any
  color: string
  value: string
  description: string
}) {
  return (
    <Card className="border-slate-200 shadow-sm relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${color}`} />
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-bold text-slate-500 flex items-center justify-between">
          {title}
          <Icon
            className="w-4 h-4"
            style={{ color: color.replace('bg-', 'text-').replace('500', '500') }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-nuvia-navy">{value}</div>
        <p className="text-xs font-bold text-slate-400 mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

export function CrcLeadAgendamento() {
  const [entries, setEntries] = useState<LeadEntry[]>([
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      channel: 'Instagram',
      investment: 500,
      newLeads: 50,
      scheduled: 15,
      attended: 10,
      followUpContacts: 20,
      rescued: 5,
    },
    {
      id: '2',
      date: new Date().toISOString().split('T')[0],
      channel: 'Google',
      investment: 300,
      newLeads: 25,
      scheduled: 10,
      attended: 8,
      followUpContacts: 10,
      rescued: 2,
    },
  ])

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    channel: 'Instagram',
    investment: '',
    newLeads: '',
    scheduled: '',
    attended: '',
    followUpContacts: '',
    rescued: '',
  })

  const handleAdd = () => {
    if (!form.investment || !form.newLeads || !form.scheduled || !form.attended) return

    setEntries([
      ...entries,
      {
        id: Math.random().toString(),
        date: form.date,
        channel: form.channel,
        investment: Number(form.investment),
        newLeads: Number(form.newLeads),
        scheduled: Number(form.scheduled),
        attended: Number(form.attended),
        followUpContacts: Number(form.followUpContacts) || 0,
        rescued: Number(form.rescued) || 0,
      },
    ])
    setForm((p) => ({
      ...p,
      investment: '',
      newLeads: '',
      scheduled: '',
      attended: '',
      followUpContacts: '',
      rescued: '',
    }))
  }

  const totals = useMemo(
    () =>
      entries.reduce(
        (acc, curr) => ({
          investment: acc.investment + curr.investment,
          newLeads: acc.newLeads + curr.newLeads,
          scheduled: acc.scheduled + curr.scheduled,
          attended: acc.attended + curr.attended,
          followUpContacts: acc.followUpContacts + curr.followUpContacts,
          rescued: acc.rescued + curr.rescued,
        }),
        { investment: 0, newLeads: 0, scheduled: 0, attended: 0, followUpContacts: 0, rescued: 0 },
      ),
    [entries],
  )

  const agendamentosPerc = totals.newLeads > 0 ? (totals.scheduled / totals.newLeads) * 100 : 0
  const comparecimentosPerc = totals.scheduled > 0 ? (totals.attended / totals.scheduled) * 100 : 0
  const resgatePerc =
    totals.followUpContacts > 0 ? (totals.rescued / totals.followUpContacts) * 100 : 0
  const cpl = totals.newLeads > 0 ? totals.investment / totals.newLeads : 0

  const channelData = useMemo(() => {
    const map: Record<string, { channel: string; investment: number; leads: number }> = {}
    entries.forEach((e) => {
      if (!map[e.channel]) map[e.channel] = { channel: e.channel, investment: 0, leads: 0 }
      map[e.channel].investment += e.investment
      map[e.channel].leads += e.newLeads
    })
    return Object.values(map).map((d) => ({ ...d, cpl: d.leads > 0 ? d.investment / d.leads : 0 }))
  }, [entries])

  const chartConfig = { cpl: { label: 'CPL', color: 'hsl(var(--primary))' } }

  return (
    <div className="space-y-6 animate-fade-in uppercase">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="AGENDAMENTOS"
          icon={CalendarCheck}
          color="bg-blue-500"
          value={`${agendamentosPerc.toFixed(1)}%`}
          description={`${totals.scheduled} de ${totals.newLeads} leads`}
        />
        <KpiCard
          title="COMPARECIMENTOS"
          icon={Users}
          color="bg-green-500"
          value={`${comparecimentosPerc.toFixed(1)}%`}
          description={`${totals.attended} de ${totals.scheduled} agendados`}
        />
        <KpiCard
          title="RESGATE FOLLOW-UP"
          icon={PhoneCall}
          color="bg-orange-500"
          value={`${resgatePerc.toFixed(1)}%`}
          description={`${totals.rescued} resgatados de ${totals.followUpContacts} contatos`}
        />
        <KpiCard
          title="CUSTO POR LEAD (CPL)"
          icon={DollarSign}
          color="bg-purple-500"
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cpl)}
          description={`Investimento Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.investment)}`}
        />
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> CUSTO POR LEAD POR CANAL
        </h3>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={channelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="channel"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#64748B', fontWeight: 'bold' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#64748B', fontWeight: 'bold' }}
              tickFormatter={(val) => `R$ ${val}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: '#F1F5F9' }} />
            <Bar dataKey="cpl" fill="var(--color-cpl)" radius={[4, 4, 0, 0]} maxBarSize={50} />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-black text-nuvia-navy mb-4">LANÇAMENTO DIÁRIO POR CANAL</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500">DATA</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                className="font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500">CANAL</Label>
              <Select
                value={form.channel}
                onValueChange={(v) => setForm((p) => ({ ...p, channel: v }))}
              >
                <SelectTrigger className="font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHANNELS.map((c) => (
                    <SelectItem key={c} value={c} className="font-bold">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500">INVESTIMENTO (R$)</Label>
              <Input
                type="number"
                value={form.investment}
                onChange={(e) => setForm((p) => ({ ...p, investment: e.target.value }))}
                className="font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500">LEADS NOVOS</Label>
              <Input
                type="number"
                value={form.newLeads}
                onChange={(e) => setForm((p) => ({ ...p, newLeads: e.target.value }))}
                className="font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500">AGENDAMENTOS</Label>
              <Input
                type="number"
                value={form.scheduled}
                onChange={(e) => setForm((p) => ({ ...p, scheduled: e.target.value }))}
                className="font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500">COMPARECIMENTOS</Label>
              <Input
                type="number"
                value={form.attended}
                onChange={(e) => setForm((p) => ({ ...p, attended: e.target.value }))}
                className="font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500" title="Contatos >30 dias">
                CONTATOS FOLLOW-UP
              </Label>
              <Input
                type="number"
                value={form.followUpContacts}
                onChange={(e) => setForm((p) => ({ ...p, followUpContacts: e.target.value }))}
                className="font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500">RESGATES</Label>
              <Input
                type="number"
                value={form.rescued}
                onChange={(e) => setForm((p) => ({ ...p, rescued: e.target.value }))}
                className="font-bold"
              />
            </div>
            <div className="col-span-full flex justify-end mt-2">
              <Button
                onClick={handleAdd}
                className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" /> ADICIONAR
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold text-slate-500 text-xs">DATA</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs">CANAL</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs text-right">
                  INVEST.
                </TableHead>
                <TableHead className="font-bold text-slate-500 text-xs text-center">
                  LEADS
                </TableHead>
                <TableHead className="font-bold text-slate-500 text-xs text-center">
                  AGEND.
                </TableHead>
                <TableHead className="font-bold text-slate-500 text-xs text-center">
                  COMP.
                </TableHead>
                <TableHead className="font-bold text-slate-500 text-xs text-center">
                  RESGATES
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-slate-400 font-bold text-xs"
                  >
                    NENHUM LANÇAMENTO REGISTRADO
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-bold text-nuvia-navy text-xs">
                      {new Date(e.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-bold bg-slate-50">
                        {e.channel}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-right text-xs">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(e.investment)}
                    </TableCell>
                    <TableCell className="font-bold text-center text-xs">{e.newLeads}</TableCell>
                    <TableCell className="font-bold text-center text-xs">{e.scheduled}</TableCell>
                    <TableCell className="font-bold text-center text-xs">{e.attended}</TableCell>
                    <TableCell className="font-bold text-center text-xs">{e.rescued}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEntries(entries.filter((x) => x.id !== e.id))}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
