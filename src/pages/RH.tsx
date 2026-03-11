import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TeamTab } from '@/components/rh/TeamTab'
import { DocumentsTab } from '@/components/rh/DocumentsTab'
import { OnboardingCard } from '@/components/rh/OnboardingCard'
import useAppStore from '@/stores/main'

export default function RH() {
  const { onboarding } = useAppStore()

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">Recursos Humanos</h1>
        <p className="text-muted-foreground mt-1">
          Gestão consolidada de equipe, integrações de onboarding e rotinas operacionais.
        </p>
      </div>

      <Tabs defaultValue="equipe" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="equipe">Equipe Nuvia</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="rotinas">Rotinas / POPs</TabsTrigger>
        </TabsList>

        <TabsContent value="equipe">
          <TeamTab />
        </TabsContent>

        <TabsContent value="onboarding">
          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            {onboarding.map((candidate) => (
              <OnboardingCard key={candidate.id} candidate={candidate} />
            ))}
            {onboarding.length === 0 && (
              <div className="col-span-full py-16 text-center text-muted-foreground border border-dashed rounded-lg bg-card/50">
                Nenhum processo de onboarding em andamento no momento.
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
