import { useState } from 'react'
import useAppStore from '@/stores/main'
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
import { Plus, Trash2, Truck } from 'lucide-react'

export default function Suppliers() {
  const { suppliers, addSupplier, removeSupplier, isAdmin } = useAppStore()
  const [open, setOpen] = useState(false)

  const [name, setName] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [contact, setContact] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const sortedSuppliers = [...suppliers].sort((a, b) => a.name.localeCompare(b.name))

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && contact) {
      addSupplier({
        name: name.toUpperCase(),
        cnpj: cnpj.toUpperCase(),
        contact: contact.toUpperCase(),
        phone: phone.toUpperCase(),
        email: email.toUpperCase(),
      })
      setOpen(false)
      setName('')
      setCnpj('')
      setContact('')
      setPhone('')
      setEmail('')
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
          <Button onClick={() => setOpen(true)} className="bg-primary text-primary-foreground">
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
              <TableHead className="font-semibold text-muted-foreground">E-MAIL</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-right">
                AÇÕES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSuppliers.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/10">
                <TableCell>
                  <div className="font-bold text-primary">{item.name}</div>
                </TableCell>
                <TableCell className="font-medium text-muted-foreground">
                  {item.cnpj || 'NÃO INFORMADO'}
                </TableCell>
                <TableCell>
                  <div className="font-semibold">{item.contact}</div>
                  <div className="text-xs text-muted-foreground">{item.phone}</div>
                </TableCell>
                <TableCell className="text-sm font-medium">{item.email || '-'}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSupplier(item.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="REMOVER"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {sortedSuppliers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  NENHUM FORNECEDOR CADASTRADO.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md uppercase">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" /> ADICIONAR FORNECEDOR
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                NOME / RAZÃO SOCIAL
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="EX: DENTAL CREMER"
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">CNPJ</label>
              <Input
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0000-00"
                className="uppercase"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  CONTATO (NOME)
                </label>
                <Input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  placeholder="EX: MARIA"
                  className="uppercase"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">TELEFONE</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="(00) 0000-0000"
                  className="uppercase"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">E-MAIL</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="CONTATO@FORNECEDOR.COM"
                className="uppercase"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                CANCELAR
              </Button>
              <Button type="submit">SALVAR FORNECEDOR</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
