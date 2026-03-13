import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Supplier } from '@/stores/main'
import { Building2, Phone, Mail, Globe, Truck } from 'lucide-react'
import useAppStore from '@/stores/main'

export function SupplierDetailsDialog({
  supplier,
  onClose,
}: {
  supplier: Supplier | null
  onClose: () => void
}) {
  const { can, isAdmin } = useAppStore()
  const canViewNotes = isAdmin || (typeof can === 'function' && can('fornecedores', 'ver_notas'))

  if (!supplier) return null

  return (
    <Dialog open={!!supplier} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md uppercase">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary text-xl border-b pb-4">
            <Truck className="h-6 w-6" /> DETALHES DO FORNECEDOR
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-foreground">{supplier.name}</h3>
            <p className="text-xs font-bold text-muted-foreground">
              CNPJ: {supplier.cnpj || 'NÃO INFORMADO'}
            </p>
          </div>

          <div className="grid gap-3 bg-muted/20 p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-semibold">{supplier.contact}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-semibold">{supplier.phone}</span>
            </div>
            {supplier.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-semibold lowercase">{supplier.email}</span>
              </div>
            )}
            {supplier.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <a
                  href={
                    supplier.website.startsWith('http')
                      ? supplier.website
                      : `https://${supplier.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-primary hover:underline lowercase"
                >
                  {supplier.website}
                </a>
              </div>
            )}
          </div>

          {canViewNotes && supplier.hasSpecialNegotiation && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="text-sm font-bold text-amber-900 mb-2">NEGOCIAÇÃO ESPECIAL</h4>
              <p className="text-sm text-amber-800 bg-white/50 p-3 rounded border border-amber-100 whitespace-pre-wrap font-medium">
                {supplier.negotiationNotes || 'NENHUMA NOTA REGISTRADA.'}
              </p>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              FECHAR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
