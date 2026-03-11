import { useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Trash2, Upload } from 'lucide-react'
import useAppStore from '@/stores/main'

export function DocumentsTab() {
  const { documents, addDocument, removeDocument } = useAppStore()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      addDocument(file.name)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const sortedDocuments = [...documents].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>DOCUMENTOS E NORMATIVAS</CardTitle>
          <CardDescription>
            REPOSITÓRIO DE MANUAIS E PROCEDIMENTOS OPERACIONAIS PADRÃO (POPS) DO RH.
          </CardDescription>
        </div>
        <div>
          <input
            type="file"
            ref={fileRef}
            className="hidden"
            onChange={handleUpload}
            accept=".pdf,.doc,.docx"
          />
          <Button onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" /> FAZER UPLOAD
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedDocuments.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg bg-muted/20 uppercase">
            NENHUM DOCUMENTO ARMAZENADO NO MOMENTO. FAÇA O UPLOAD DO SEU PRIMEIRO ARQUIVO.
          </div>
        ) : (
          <div className="grid gap-3">
            {sortedDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors gap-4 shadow-sm group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground uppercase">{doc.name}</p>
                    <p className="text-xs text-muted-foreground uppercase">
                      ADICIONADO EM {doc.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="hidden sm:flex uppercase">
                    <Download className="h-4 w-4 mr-2" /> BAIXAR
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDocument(doc.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
