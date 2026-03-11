import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ChevronRight, ArrowRight, BookOpen, Stethoscope } from 'lucide-react'
import logoUrl from '@/assets/nuvia_logo__horizontal_by_souza_filho_original-5cc4a.png'

export default function PublicHome() {
  return (
    <div className="min-h-screen bg-background flex flex-col uppercase font-sans">
      <header className="h-20 border-b flex items-center justify-between px-6 md:px-12 bg-card sticky top-0 z-50">
        <img src={logoUrl} alt="Nuvia" className="h-8" />
        <nav className="hidden md:flex gap-8 text-sm font-bold text-muted-foreground tracking-widest">
          <a href="#servicos" className="hover:text-primary transition-colors">
            SERVIÇOS
          </a>
          <a href="#equipe" className="hover:text-primary transition-colors">
            CORPO CLÍNICO
          </a>
          <a href="#blog" className="hover:text-primary transition-colors">
            BLOG CIENTÍFICO
          </a>
        </nav>
        <Link to="/login">
          <Button className="bg-[#D81B84] hover:bg-[#B71770] text-white font-bold tracking-wider">
            ÁREA RESTRITA <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </header>

      <main className="flex-1">
        <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-blue-50/50 to-background flex flex-col items-center text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-nuvia-navy max-w-4xl leading-tight">
            EXCELÊNCIA CLÍNICA E PRECISÃO CIENTÍFICA
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
            TRATAMENTOS ODONTOLÓGICOS AVANÇADOS FUNDAMENTADOS EM EVIDÊNCIAS PARA GARANTIR A MELHOR
            REABILITAÇÃO ORAL.
          </p>
          <div className="pt-4">
            <Button
              size="lg"
              className="text-lg px-8 h-14 bg-primary hover:bg-primary/90 text-white font-bold tracking-widest"
            >
              AGENDAR AVALIAÇÃO CLÍNICA
            </Button>
          </div>
        </section>

        <section id="blog" className="py-24 bg-muted/30 px-6 md:px-12 border-t">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4 flex flex-col items-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-extrabold text-nuvia-navy tracking-tight">
                ATUALIZAÇÕES CIENTÍFICAS
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                PUBLICAÇÕES RECENTES, PROTOCOLOS CLÍNICOS E INOVAÇÕES METODOLÓGICAS DO NOSSO CORPO
                CLÍNICO.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  tag: 'IMPLANTODONTIA',
                  title: 'PROTOCOLOS DE CARGA IMEDIATA EM REABILITAÇÃO',
                  img: 'https://img.usecurling.com/p/400/250?q=dental%20implant&color=blue',
                },
                {
                  tag: 'ENDODONTIA',
                  title: 'USO DE MICROSCOPIA OPERATÓRIA EM CANAIS COMPLEXOS',
                  img: 'https://img.usecurling.com/p/400/250?q=microscope&color=blue',
                },
                {
                  tag: 'ODONTOPEDIATRIA',
                  title: 'ABORDAGEM COMPORTAMENTAL E SEDAÇÃO CONSCIENTE',
                  img: 'https://img.usecurling.com/p/400/250?q=pediatric%20dentist&color=blue',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-background rounded-2xl border overflow-hidden hover:shadow-xl transition-all group"
                >
                  <div className="overflow-hidden h-52">
                    <img
                      src={item.img}
                      alt="Artigo"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 space-y-4">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-black tracking-widest rounded-full">
                      {item.tag}
                    </span>
                    <h3 className="text-xl font-extrabold text-foreground leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      ANÁLISE SISTEMÁTICA DAS ABORDAGENS CONTEMPORÂNEAS E SEUS RESPECTIVOS DESFECHOS
                      CLÍNICOS A LONGO PRAZO NA PRÁTICA ODONTOLÓGICA...
                    </p>
                    <Button
                      variant="ghost"
                      className="px-0 text-primary hover:text-primary hover:bg-transparent font-bold tracking-widest"
                    >
                      LER ARTIGO COMPLETO <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-nuvia-navy text-primary-foreground py-16 px-6 md:px-12 border-t border-primary/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-80">
            <Stethoscope className="w-6 h-6" />
            <span className="font-bold tracking-widest text-lg">NUVIA ODONTOLOGIA</span>
          </div>
          <p className="text-sm font-medium opacity-60 tracking-widest">
            &copy; 2026 NUVIA. TODOS OS DIREITOS RESERVADOS.
          </p>
        </div>
      </footer>
    </div>
  )
}
