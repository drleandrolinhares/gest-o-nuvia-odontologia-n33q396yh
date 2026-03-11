import { useState } from 'react'
import useAppStore, { Supplier } from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Truck, Edit2, Link as LinkIcon, Phone, Mail, Building } from 'lucide-react'

export default function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, removeSupplier, isAdmin } = useAppStore()
  const [openForm, setOpenForm] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [contact, setContact] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [hasSpecialNegotiation, setHasSpecialNegotiation] = useState(false)
  const [negotiationNotes, setNegotiationNotes] = useState('')

  const sortedSuppliers = [...suppliers].sort((a, b) => a.name.localeCompare(b.name))

  const handleOpenForm = (item?: Supplier) => {
    if (item) {
      setEditingId(item.id)
      setName(item.name)
      setCnpj(item.cnpj)
      setContact(item.contact)
      setPhone(item.phone)
      setEmail(item.email)
      setWebsite(item.website || '')
      setHasSpecialNegotiation(!!item.hasSpecialNegotiation)
      setNegotiationNotes(item.negotiationNotes || '')
    } else {
      setEditingId(null)
      setName('')
      setCnpj('')
      setContact('')
      setPhone('')
      setEmail('')
      setWebsite('')
      setHasSpecialNegotiation(false)
      setNegotiationNotes('')
    }
    setOpenForm(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && contact) {
      const data = {
        name: name.toUpperCase(),
        cnpj: cnpj.toUpperCase(),
        contact: contact.toUpperCase(),
        phone: phone.toUpperCase(),
        email: email.toUpperCase(),
        website: website.toLowerCase(),
        hasSpecialNegotiation,
        negotiationNotes: hasSpecialNegotiation ? negotiationNotes.toUpperCase() : '',
      }

      if (editingId) {
        updateSupplier(editingId, data)
      } else {
        addSupplier(data)
      }
      setOpenForm(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">FORNECEDORES</h1>
          <p className="text-muted-foreground mt-1">
            GESTÃO DE FORNECEDORES DE MATERIAIS CLÍNICOS E SERVIÇOS.
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => handleOpenForm()} className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> NOVO FORNECEDOR
          </Button>
        )}
      </div>

      <Card className="shadow-sm border-muted overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold text-muted-foreground">
                NOME / RAZÃO SOCIAL
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">CNPJ</TableHead>
              <TableHead className="font-semibold text-muted-foreground">CONTATO</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-right">
                AÇÕES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSuppliers.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-muted/10 cursor-pointer transition-colors"
                onClick={() => setSelectedSupplier(item)}
              >
                <TableCell>
                  <div className="font-bold text-primary flex items-center gap-2">
                    {item.name}
                    {item.hasSpecialNegotiation && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-bold">
                        NEGOCIAÇÃO
                      </span>
                    )}
                  </div>
                  {item.website && (
                    <div className="text-xs text-muted-foreground lowercase mt-0.5">
                      {item.website}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-muted-foreground">
                  {item.cnpj || 'NÃO INFORMADO'}
                </TableCell>
                <TableCell>
                  <div className="font-semibold">{item.contact}</div>
                  <div className="text-xs text-muted-foreground">{item.phone}</div>
                </TableCell>
                <TableCell
                  className="text-right whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isAdmin && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenForm(item)}
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                        title="EDITAR"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSupplier(item.id)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="REMOVER"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {sortedSuppliers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  NENHUM FORNECEDOR CADASTRADO.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Form Dialog */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-lg uppercase">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />{' '}
              {editingId ? 'EDITAR FORNECEDOR' : 'ADICIONAR FORNECEDOR'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-2 max-h-[70vh] overflow-y-auto pr-2">
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
                <label className="text-xs font-semibold text-muted-foreground">
                  SITE (OPCIONAL)
                </label>
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
                <Switch
                  checked={hasSpecialNegotiation}
                  onCheckedChange={setHasSpecialNegotiation}
                />
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
              <Button type="button" variant="outline" onClick={() => setOpenForm(false)}>
                CANCELAR
              </Button>
              <Button type="submit">SALVAR FORNECEDOR</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={!!selectedSupplier} onOpenChange={(o) => !o && setSelectedSupplier(null)}>
        <DialogContent className="max-w-xl uppercase">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl text-primary border-b pb-4">
              <Building className="h-6 w-6" /> DETALHES DO FORNECEDOR
            </DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedSupplier.name}</h3>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  CNPJ: {selectedSupplier.cnpj || 'NÃO INFORMADO'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border shadow-sm">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">CONTATO PRINCIPAL</p>
                    <p className="text-sm font-medium">{selectedSupplier.contact}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">TELEFONE</p>
                    <p className="text-sm font-medium">{selectedSupplier.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">E-MAIL</p>
                    <p className="text-sm font-medium lowercase">
                      {selectedSupplier.email || 'NÃO INFORMADO'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <LinkIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">SITE / URL</p>
                    {selectedSupplier.website ? (
                      <a
                        href={`https://${selectedSupplier.website.replace(/^https?:\/\//, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-primary hover:underline lowercase"
                      >
                        {selectedSupplier.website}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-muted-foreground">NÃO INFORMADO</p>
                    )}
                  </div>
                </div>
              </div>

              {selectedSupplier.hasSpecialNegotiation && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                    ESTE FORNECEDOR POSSUI NEGOCIAÇÃO ESPECIAL
                  </h4>
                  <p className="text-sm text-amber-800 bg-white/50 p-3 rounded border border-amber-100 whitespace-pre-wrap">
                    {selectedSupplier.negotiationNotes}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedSupplier(null)}>
                  FECHAR
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
