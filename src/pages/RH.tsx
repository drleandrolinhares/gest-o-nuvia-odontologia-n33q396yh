import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TeamTab } from '@/components/rh/TeamTab'
import { DocumentsTab } from '@/components/rh/DocumentsTab'
import { OnboardingCard } from '@/components/rh/OnboardingCard'
import useAppStore from '@/stores/main'

export default function RH() {
  const { onboarding } = useAppStore()

  const sortedOnboarding = [...onboarding].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">RH</h1>
        <p className="text-muted-foreground mt-1">
          GESTÃO CONSOLIDADA DE EQUIPE, INTEGRAÇÕES DE ONBOARDING E ROTINAS OPERACIONAIS.
        </p>
      </div>

      <Tabs defaultValue="equipe" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="equipe">EQUIPE NUVIA</TabsTrigger>
          <TabsTrigger value="onboarding">ONBOARDING</TabsTrigger>
          <TabsTrigger value="rotinas">ROTINAS / POPS</TabsTrigger>
        </TabsList>

        <TabsContent value="equipe">
          <TeamTab />
        </TabsContent>

        <TabsContent value="onboarding">
          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            {sortedOnboarding.map((candidate) => (
              <OnboardingCard key={candidate.id} candidate={candidate} />
            ))}
            {sortedOnboarding.length === 0 && (
              <div className="col-span-full py-16 text-center text-muted-foreground border border-dashed rounded-lg bg-card/50 uppercase">
                NENHUM PROCESSO DE ONBOARDING EM ANDAMENTO NO MOMENTO.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rotinas">
          <DocumentsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
