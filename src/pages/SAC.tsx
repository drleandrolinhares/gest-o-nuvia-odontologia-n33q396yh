import { useState } from 'react'
import { HeadphonesIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SacDashboard } from '@/components/sac/SacDashboard'
import { SacList } from '@/components/sac/SacList'
import { SacFormModal } from '@/components/sac/SacFormModal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SAC() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0A192F] flex items-center gap-3">
            <HeadphonesIcon className="h-8 w-8 text-[#D4AF37]" /> OPORTUNIDADES DE SOLUÇÕES (SAC)
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-semibold">
            REGISTRO, DELEGAÇÃO E ACOMPANHAMENTO DE RECLAMAÇÕES E SUGESTÕES.
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-bold tracking-widest shadow-md whitespace-nowrap"
        >
          <Plus className="h-4 w-4 mr-2" /> NOVO REGISTRO
        </Button>
      </div>

      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-slate-200">
          <TabsTrigger
            value="lista"
            className="font-bold data-[state=active]:bg-[#0A192F] data-[state=active]:text-[#D4AF37]"
          >
            LISTA DE REGISTROS
          </TabsTrigger>
          <TabsTrigger
            value="dashboard"
            className="font-bold data-[state=active]:bg-[#0A192F] data-[state=active]:text-[#D4AF37]"
          >
            DASHBOARD MENSAL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6 space-y-6">
          <SacDashboard />
        </TabsContent>

        <TabsContent value="lista" className="mt-6 space-y-6">
          <SacList onEdit={() => {}} />
        </TabsContent>
      </Tabs>

      <SacFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  )
}
