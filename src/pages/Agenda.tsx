import { useState } from 'react'
import useAppStore from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar as CalendarIcon, Clock, Trash2, Plus, Users, MapPin, Bell } from 'lucide-react'

export default function Agenda() {
  const { agenda, addAgendaItem, removeAgendaItem, currentUserId, employees, isAdmin } =
    useAppStore()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('Reunião')
  const [date, setDate] = useState('')

  const currentUser = employees.find((e) => e.id === currentUserId)
  const canEdit = isAdmin || currentUser?.agendaAccess === 'ADD_EDIT'

  const sortedAgenda = [...agenda].sort((a, b) => a.title.localeCompare(b.title))

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && date) {
      addAgendaItem({ title, date, type, createdBy: currentUser?.name || 'Admin' })
      setOpen(false)
      setTitle('')
      setDate('')
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'Reunião':
        return <Users className="h-5 w-5 text-blue-500" />
      case 'Viagem':
        return <MapPin className="h-5 w-5 text-emerald-500" />
      case 'Lembrete':
        return <Bell className="h-5 w-5 text-amber-500" />
      default:
        return <Clock className="h-5 w-5 text-primary" />
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">AGENDA</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie compromissos, reuniões e lembretes da clínica.
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => setOpen(true)} className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> NOVO COMPROMISSO
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {sortedAgenda.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border border-dashed rounded-lg bg-card/50">
            NENHUM COMPROMISSO AGENDADO.
          </div>
        ) : (
          sortedAgenda.map((item) => (
            <Card key={item.id} className="hover:border-primary/50 transition-colors shadow-sm">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{item.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />{' '}
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span>•</span>
                      <span>{item.type}</span>
                    </div>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAgendaItem(item.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ADICIONAR COMPROMISSO</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">TÍTULO</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">TIPO</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consulta">CONSULTA</SelectItem>
                  <SelectItem value="Reunião">REUNIÃO</SelectItem>
                  <SelectItem value="Viagem">VIAGEM</SelectItem>
                  <SelectItem value="Lembrete">LEMBRETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">DATA</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                CANCELAR
              </Button>
              <Button type="submit">SALVAR COMPROMISSO</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
