import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShieldKeyhole } from 'lucide-react'
import { PermissoesPorCargo } from '@/components/permissoes/PermissoesPorCargo'
import { PermissoesIndividuais } from '@/components/permissoes/PermissoesIndividuais'

export default function Permissoes() {
  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
          <ShieldKeyhole className="h-8 w-8 text-primary" /> PERMISSÕES DE ACESSO
        </h1>
        <p className="text-muted-foreground mt-1 font-semibold">
          GERENCIE OS NÍVEIS DE ACESSO POR CARGO OU INDIVIDUALMENTE.
        </p>
      </div>

      <Tabs defaultValue="cargo" className="w-full">
        <TabsList className="mb-6 flex flex-wrap w-full max-w-md h-auto bg-slate-200">
          <TabsTrigger
            value="cargo"
            className="py-2 px-4 flex-1 font-bold tracking-widest data-[state=active]:bg-[#0A192F] data-[state=active]:text-[#D4AF37]"
          >
            POR CARGO
          </TabsTrigger>
          <TabsTrigger
            value="individual"
            className="py-2 px-4 flex-1 font-bold tracking-widest data-[state=active]:bg-[#0A192F] data-[state=active]:text-[#D4AF37]"
          >
            INDIVIDUAIS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cargo" className="mt-4">
          <PermissoesPorCargo />
        </TabsContent>

        <TabsContent value="individual" className="mt-4">
          <PermissoesIndividuais />
        </TabsContent>
      </Tabs>
    </div>
  )
}
