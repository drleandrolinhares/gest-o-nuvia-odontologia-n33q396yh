import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { CalendarDays, Check, ChevronsUpDown } from 'lucide-react'
import { Employee } from '@/stores/main'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: any) => void
  employees: Employee[]
  agendaTypes: string[]
  currentUserId: string | null
}

export function AgendaAddDialog({
  open,
  onOpenChange,
  onAdd,
  employees,
  agendaTypes,
  currentUserId,
}: Props) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [assignedTo, setAssignedTo] = useState('none')
  const [openAssignee, setOpenAssignee] = useState(false)
  const [involvesThirdParty, setInvolvesThirdParty] = useState(false)
  const [thirdPartyDetails, setThirdPartyDetails] = useState('')

  const currentUser = employees.find((e) => e.id === currentUserId)
  const activeEmployees = employees.filter((e) => e.status !== 'Desligado')

  const resetForm = () => {
    setTitle('')
    setType('')
    setDate('')
    setTime('')
    setLocation('')
    setAssignedTo('none')
    setInvolvesThirdParty(false)
    setThirdPartyDetails('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && date && time && location && type) {
      onAdd({
        title: title.toUpperCase(),
        date,
        time,
        type,
        location: location.toUpperCase(),
        assignedTo: assignedTo === 'none' ? undefined : assignedTo,
        involvesThirdParty,
        thirdPartyDetails: involvesThirdParty ? thirdPartyDetails.toUpperCase() : '',
        createdBy: currentUser?.name || 'SISTEMA',
        requester_id: currentUserId,
        is_completed: false,
      })
      onOpenChange(false)
      resetForm()
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) resetForm()
      }}
    >
      <DialogContent className="max-w-lg uppercase">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="h-5 w-5 text-primary" /> NOVO COMPROMISSO / PEDIDO
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">
              TÍTULO DO COMPROMISSO / PEDIDO *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="EX: REUNIÃO DE RESULTADOS, COMPRAR MATERIAIS..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">TIPO *</label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger>
                  <SelectValue placeholder="SELECIONE..." />
                </SelectTrigger>
                <SelectContent>
                  {agendaTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">RESPONSÁVEL</label>
              <Popover open={openAssignee} onOpenChange={setOpenAssignee}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openAssignee}
                    className="w-full justify-between uppercase"
                  >
                    {assignedTo === 'none'
                      ? 'GERAL / CLÍNICA'
                      : activeEmployees.find((e) => e.id === assignedTo)?.name}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="BUSCAR..." className="uppercase" />
                    <CommandList>
                      <CommandEmpty>NENHUM ENCONTRADO.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="GERAL CLINICA"
                          onSelect={() => {
                            setAssignedTo('none')
                            setOpenAssignee(false)
                          }}
                          className="uppercase"
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              assignedTo === 'none' ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          GERAL / CLÍNICA
                        </CommandItem>
                        {activeEmployees.map((e) => (
                          <CommandItem
                            key={e.id}
                            value={e.name}
                            onSelect={() => {
                              setAssignedTo(e.id)
                              setOpenAssignee(false)
                            }}
                            className="uppercase"
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                assignedTo === e.id ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                            {e.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">DATA LIMITE *</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">HORÁRIO *</label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">LOCAL *</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="SALA 1, ONLINE, ETC."
            />
          </div>

          <div className="pt-4 border-t border-muted">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-foreground">ENVOLVE TERCEIROS?</label>
              <Switch checked={involvesThirdParty} onCheckedChange={setInvolvesThirdParty} />
            </div>
            {involvesThirdParty && (
              <div className="mt-3 space-y-2 animate-fade-in-up">
                <label className="text-xs font-semibold text-muted-foreground">
                  DETALHES DOS TERCEIROS (NOME, EMPRESA, ETC)
                </label>
                <Textarea
                  value={thirdPartyDetails}
                  onChange={(e) => setThirdPartyDetails(e.target.value)}
                  required={involvesThirdParty}
                  rows={2}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              CANCELAR
            </Button>
            <Button type="submit">SALVAR COMPROMISSO</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
