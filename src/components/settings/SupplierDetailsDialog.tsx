import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Building, Truck, Phone, Mail, LinkIcon } from 'lucide-react'
import { Supplier } from '@/stores/main'

export function SupplierDetailsDialog({
  supplier,
  onClose,
}: {
  supplier: Supplier | null
  onClose: () => void
}) {
  return (
    <Dialog open={!!supplier} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl uppercase">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-primary border-b pb-4">
            <Building className="h-6 w-6" /> DETALHES DO FORNECEDOR
          </DialogTitle>
        </DialogHeader>
        {supplier && (
          <div className="mt-4 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">{supplier.name}</h3>
              <p className="text-sm text-muted-foreground font-medium mt-1">
                CNPJ: {supplier.cnpj || 'NÃO INFORMADO'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border shadow-sm">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-muted-foreground">CONTATO PRINCIPAL</p>
                  <p className="text-sm font-medium">{supplier.contact}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-muted-foreground">TELEFONE</p>
                  <p className="text-sm font-medium">{supplier.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-muted-foreground">E-MAIL</p>
                  <p className="text-sm font-medium lowercase">
                    {supplier.email || 'NÃO INFORMADO'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <LinkIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-muted-foreground">SITE / URL</p>
                  {supplier.website ? (
                    <a
                      href={`https://${supplier.website.replace(/^https?:\/\//, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-primary hover:underline lowercase"
                    >
                      {supplier.website}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-muted-foreground">NÃO INFORMADO</p>
                  )}
                </div>
              </div>
            </div>

            {supplier.hasSpecialNegotiation && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                  ESTE FORNECEDOR POSSUI NEGOCIAÇÃO ESPECIAL
                </h4>
                <p className="text-sm text-amber-800 bg-white/50 p-3 rounded border border-amber-100 whitespace-pre-wrap">
                  {supplier.negotiationNotes}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                FECHAR
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
