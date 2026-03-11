import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Truck } from 'lucide-react'
import { Supplier } from '@/stores/main'

export function SupplierFormDialog({
  open,
  onOpenChange,
  supplier,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: Supplier | null
  onSave: (data: Partial<Supplier>) => void
}) {
  const [name, setName] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [contact, setContact] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [hasSpecialNegotiation, setHasSpecialNegotiation] = useState(false)
  const [negotiationNotes, setNegotiationNotes] = useState('')

  useEffect(() => {
    if (open) {
      if (supplier) {
        setName(supplier.name)
        setCnpj(supplier.cnpj)
        setContact(supplier.contact)
        setPhone(supplier.phone)
        setEmail(supplier.email)
        setWebsite(supplier.website || '')
        setHasSpecialNegotiation(!!supplier.hasSpecialNegotiation)
        setNegotiationNotes(supplier.negotiationNotes || '')
      } else {
        setName('')
        setCnpj('')
        setContact('')
        setPhone('')
        setEmail('')
        setWebsite('')
        setHasSpecialNegotiation(false)
        setNegotiationNotes('')
      }
    }
  }, [open, supplier])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && contact) {
      onSave({
        name: name.toUpperCase(),
        cnpj: cnpj.toUpperCase(),
        contact: contact.toUpperCase(),
        phone: phone.toUpperCase(),
        email: email.toUpperCase(),
        website: website.toLowerCase(),
        hasSpecialNegotiation,
        negotiationNotes: hasSpecialNegotiation ? negotiationNotes.toUpperCase() : '',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg uppercase">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />{' '}
            {supplier ? 'EDITAR FORNECEDOR' : 'ADICIONAR FORNECEDOR'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">
              NOME / RAZÃO SOCIAL *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="EX: DENTAL CREMER"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">CNPJ</label>
              <Input
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">SITE (OPCIONAL)</label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="WWW.EXEMPLO.COM.BR"
                className="lowercase"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                CONTATO (NOME) *
              </label>
              <Input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                placeholder="EX: MARIA"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">TELEFONE *</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="(00) 0000-0000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">E-MAIL</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="CONTATO@FORNECEDOR.COM"
            />
          </div>
          <div className="pt-4 border-t border-muted">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-foreground">
                EXISTÊNCIA DE NEGOCIAÇÃO ESPECIAL?
              </label>
              <Switch checked={hasSpecialNegotiation} onCheckedChange={setHasSpecialNegotiation} />
            </div>
            {hasSpecialNegotiation && (
              <div className="mt-3 space-y-2 animate-fade-in-up">
                <label className="text-xs font-semibold text-muted-foreground">
                  NOTAS E DETALHES DA NEGOCIAÇÃO
                </label>
                <Textarea
                  value={negotiationNotes}
                  onChange={(e) => setNegotiationNotes(e.target.value)}
                  placeholder="DESCRIÇÃO DE DESCONTOS, PRAZOS, CONDIÇÕES..."
                  rows={3}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              CANCELAR
            </Button>
            <Button type="submit">SALVAR FORNECEDOR</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
