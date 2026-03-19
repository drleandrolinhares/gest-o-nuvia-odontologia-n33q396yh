import { useState } from 'react'
import { useHubStore, HubAnnouncement } from '@/stores/hub'
import useAppStore from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Megaphone,
  Plus,
  Users,
  Pencil,
  Trash2,
  CalendarClock,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { AddAnnouncementDialog } from '@/components/hub/AddAnnouncementDialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export default function Mural() {
  const { announcements, allReads, deleteAnnouncement } = useHubStore()
  const { isAdmin, employees } = useAppStore()
  const [openAdd, setOpenAdd] = useState(false)
  const [editItem, setEditItem] = useState<HubAnnouncement | null>(null)

  const displayAnnouncements = isAdmin ? announcements : announcements.filter((a) => a.active)

  const activeEmployees = employees
    .filter((e) => e.status !== 'Desligado' && e.user_id)
    .sort((a, b) => a.name.localeCompare(b.name))

  const handleEdit = (a: HubAnnouncement) => {
    setEditItem(a)
    setOpenAdd(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('TEM CERTEZA QUE DESEJA REMOVER ESTE COMUNICADO?')) {
      await deleteAnnouncement(id)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div className="bg-[#0A192F] p-6 rounded-xl shadow-lg border border-[#D4AF37]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-black tracking-widest text-[#D4AF37] flex items-center gap-3">
            <Megaphone className="h-7 w-7 text-white" /> MURAL DE AVISOS
          </h1>
          <p className="text-slate-300 mt-1.5 text-xs font-bold tracking-widest uppercase">
            COMUNICADOS OFICIAIS E AVISOS DA CLÍNICA NUVIA
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => {
              setEditItem(null)
              setOpenAdd(true)
            }}
            className="relative z-10 bg-[#D4AF37] text-[#0A192F] hover:bg-[#B3932D] font-black tracking-widest shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" /> NOVO COMUNICADO
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {displayAnnouncements.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-white/50">
            <Megaphone className="h-10 w-10 mx-auto text-slate-300 mb-3" />
            <p className="font-bold text-sm tracking-widest">
              NENHUM COMUNICADO DISPONÍVEL NO MOMENTO.
            </p>
          </div>
        ) : (
          displayAnnouncements.map((item) => (
            <Card
              key={item.id}
              className={cn(
                'overflow-hidden transition-all',
                !item.active && 'opacity-70 grayscale-[0.3]',
              )}
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-slate-50 p-6 md:w-64 border-r flex flex-col justify-center shrink-0 relative">
                    {!item.active && (
                      <span className="absolute top-3 left-3 bg-slate-300 text-slate-600 text-[9px] px-2 py-0.5 rounded font-black tracking-widest">
                        INATIVO
                      </span>
                    )}
                    <CalendarClock className="h-8 w-8 text-primary/40 mb-3" />
                    <p className="text-xs font-bold text-muted-foreground">PUBLICADO EM:</p>
                    <p className="text-sm font-black text-nuvia-navy">
                      {format(new Date(item.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-slate-800 tracking-wide mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-medium normal-case flex-1">
                      {item.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                      {isAdmin && (
                        <div className="flex gap-2 ml-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="text-slate-500 hover:text-nuvia-navy"
                          >
                            <Pencil className="h-4 w-4 mr-2" /> EDITAR
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <Accordion type="single" collapsible className="w-full mt-4">
                      <AccordionItem value="log" className="border-none">
                        <AccordionTrigger className="text-xs font-bold text-slate-500 hover:text-nuvia-navy tracking-widest uppercase bg-slate-50 px-4 py-3 rounded-lg border data-[state=open]:rounded-b-none data-[state=open]:border-b-0">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" /> LOG DE ASSINATURAS
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="border border-t-0 rounded-b-lg p-0 overflow-hidden">
                          <Table>
                            <TableHeader className="bg-slate-50/50">
                              <TableRow>
                                <TableHead className="font-black text-xs text-slate-500">
                                  COLABORADOR
                                </TableHead>
                                <TableHead className="font-black text-xs text-slate-500">
                                  DATA/HORA DA LEITURA
                                </TableHead>
                                <TableHead className="font-black text-xs text-slate-500">
                                  STATUS
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {activeEmployees.map((emp) => {
                                const read = allReads.find(
                                  (r) => r.announcement_id === item.id && r.user_id === emp.user_id,
                                )
                                const seed =
                                  (emp.id
                                    .split('')
                                    .reduce((acc, char) => acc + char.charCodeAt(0), 0) %
                                    100) +
                                  1
                                return (
                                  <TableRow key={emp.id} className="hover:bg-slate-50/50">
                                    <TableCell>
                                      <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 border shadow-sm">
                                          <AvatarImage
                                            src={`https://img.usecurling.com/ppl/thumbnail?seed=${seed}`}
                                          />
                                          <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                          <span className="font-bold text-xs text-slate-800">
                                            {emp.name}
                                          </span>
                                          <span className="text-[9px] font-bold text-muted-foreground">
                                            {emp.role}
                                          </span>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-bold text-slate-600">
                                      {read
                                        ? format(new Date(read.read_at), "dd/MM/yyyy 'às' HH:mm", {
                                            locale: ptBR,
                                          })
                                        : '-'}
                                    </TableCell>
                                    <TableCell>
                                      {read ? (
                                        <span className="inline-flex items-center gap-1 text-emerald-600 font-black text-[10px] tracking-widest bg-emerald-50 px-2 py-1 rounded">
                                          <CheckCircle2 className="h-3.5 w-3.5" /> LIDO
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 text-amber-500 font-black text-[10px] tracking-widest bg-amber-50 px-2 py-1 rounded">
                                          <Clock className="h-3.5 w-3.5" /> PENDENTE
                                        </span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AddAnnouncementDialog open={openAdd} onOpenChange={setOpenAdd} item={editItem} />
    </div>
  )
}
