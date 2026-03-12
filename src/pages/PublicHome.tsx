import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Calendar, ChevronDown, Star, CheckCircle, Menu } from 'lucide-react'
import logoUrl from '@/assets/nuvia_logo__horizontal_by_souza_filho_original-5cc4a.png'
import { cn } from '@/lib/utils'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

const TESTIMONIALS = [
  {
    name: 'li Ramos',
    time: '2 meses atrás',
    text: 'Profissionais incríveis, estrutura impecável. Minha experiência com as lentes foi transformadora. Recomendo de olhos fechados a Clínica Nuvia!',
  },
  {
    name: 'cleyton onofri',
    time: '6 meses atrás',
    text: 'Depois de cinco meses com minhas lentes de porcelana na Clínica Nuvia, posso dizer que estou absolutamente maravilhado com o resultado. Mudou minha vida.',
  },
  {
    name: 'monique carla',
    time: '7 meses atrás',
    text: 'Amei o atendimento dos profissionais e dos dentistas! Estou muito realizada com o resultado, me sinto tão bem com meu novo sorriso. Gratidão eterna.',
  },
  {
    name: 'Daniela Brancher',
    time: '10 meses atrás',
    text: 'Atendimento único, humanizado. Só agradecer. A equipe é super atenciosa e o resultado superou todas as minhas expectativas. Muito obrigada!',
  },
  {
    name: 'Diego',
    time: '1 ano atrás',
    text: 'Foi simplesmente fantástico. A realização de um sonho, o aumento da minha autoestima foi imediato. Recomendo muito o trabalho do Dr. e toda equipe.',
  },
]

const STEPS = [
  {
    t: 'Contato inicial',
    d: 'Entre em contato através do nosso WhatsApp (55 11 95268-7760) ou preencha o formulário exclusivo em nosso site. Nossa equipe de concierge responderá prontamente, em até 24 horas úteis, direcionando você para a unidade mais conveniente, de acordo com sua localização e preferência.',
  },
  {
    t: 'Consulta de Avaliação',
    d: 'Na sua primeira visita, realizaremos um diagnóstico abrangente, que inclui uma avaliação clínica detalhada, exames de imagem de alta precisão e uma escuta atenta às suas expectativas. Em seguida, apresentaremos as possibilidades de tratamento personalizadas, alinhadas aos seus objetivos estéticos e funcionais.',
  },
  {
    t: 'Planejamento Digital Exclusivo',
    d: 'Utilizamos tecnologia de ponta, como softwares de design de sorriso 3D e escaneamento intraoral, para simular os resultados do seu tratamento antes mesmo de iniciá-lo. Isso permite visualizar com clareza sua futura transformação, garantindo que o plano esteja perfeitamente alinhado com suas expectativas.',
  },
  {
    t: 'Transformação do Sorriso Nuvia',
    d: 'Com o plano aprovado, iniciamos o tratamento seguindo um cronograma meticulosamente planejado, adaptado à sua disponibilidade. Você terá um acompanhamento exclusivo da equipe Nuvia, com revisões periódicas e suporte dedicado, garantindo a excelência em cada etapa até alcançarmos o resultado perfeito e duradouro do seu novo sorriso.',
  },
]

export default function PublicHome() {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }))
  const processSec = useIntersectionObserver({ threshold: 0.1 })
  const gallerySec = useIntersectionObserver({ threshold: 0.1 })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-nuvia-gold selection:text-black">
      <header className="h-24 border-b border-white/5 flex items-center justify-between px-6 md:px-12 bg-[#0a0a0a] sticky top-0 z-50 shadow-xl">
        <Link to="/" className="shrink-0">
          <img
            src={logoUrl}
            alt="Nuvia Odontologia"
            className="h-14 md:h-16 object-contain brightness-0 invert"
          />
        </Link>
        <nav className="hidden xl:flex items-center gap-8 text-sm font-medium tracking-wide">
          <a href="#" className="text-nuvia-gold">
            Home
          </a>
          <a href="#" className="hover:text-nuvia-gold transition-colors">
            Clínica Nuvia
          </a>
          <a href="#" className="hover:text-nuvia-gold transition-colors">
            Dr. Nuvia
          </a>
          <a href="#" className="hover:text-nuvia-gold transition-colors">
            Instituto Nuvia
          </a>
          <div className="relative group cursor-pointer flex items-center gap-1 hover:text-nuvia-gold transition-colors py-4">
            Soluções <ChevronDown className="w-3 h-3" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 bg-[#1A1A1A] border border-white/10 rounded-md py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-2xl">
              <a
                href="#"
                className="block px-4 py-2 hover:bg-white/5 text-zinc-300 hover:text-nuvia-gold"
              >
                Lentes em Resina
              </a>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-white/5 text-zinc-300 hover:text-nuvia-gold"
              >
                Implantodontia
              </a>
            </div>
          </div>
          <a href="#" className="hover:text-nuvia-gold transition-colors">
            Portfólio
          </a>
          <a href="#blog" className="hover:text-nuvia-gold transition-colors">
            Blog
          </a>
        </nav>
        <div className="hidden lg:flex items-center gap-4">
          <Button className="bg-nuvia-gold hover:bg-nuvia-gold/90 text-black font-bold tracking-wide border-2 border-transparent hover:border-white/20 transition-all rounded-sm h-11 px-6">
            Agende sua consulta <Calendar className="w-4 h-4 ml-2" />
          </Button>
          <Link
            to="/login"
            className="text-xs font-bold uppercase tracking-widest hover:text-nuvia-gold transition-colors ml-4"
          >
            Área Restrita
          </Link>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="xl:hidden text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#0a0a0a] border-white/10 p-6 flex flex-col">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <img
              src={logoUrl}
              alt="Nuvia"
              className="h-10 object-contain brightness-0 invert mb-8 mr-auto"
            />
            <div className="flex flex-col gap-4 text-lg font-medium">
              <a href="#" className="text-nuvia-gold">
                Home
              </a>
              <a href="#" className="hover:text-nuvia-gold">
                Clínica Nuvia
              </a>
              <a href="#" className="hover:text-nuvia-gold">
                Dr. Nuvia
              </a>
              <a href="#" className="hover:text-nuvia-gold">
                Instituto Nuvia
              </a>
              <a href="#" className="hover:text-nuvia-gold">
                Soluções
              </a>
              <a href="#" className="hover:text-nuvia-gold">
                Portfólio
              </a>
              <a href="#blog" className="hover:text-nuvia-gold">
                Blog
              </a>
            </div>
            <div className="mt-auto space-y-4">
              <Button className="w-full bg-nuvia-gold hover:bg-nuvia-gold/90 text-black font-bold h-12">
                Agende sua consulta <Calendar className="w-4 h-4 ml-2" />
              </Button>
              <Link
                to="/login"
                className="block text-center text-sm font-bold uppercase hover:text-nuvia-gold py-2 border border-white/10 rounded-md"
              >
                Login
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <section className="relative w-full overflow-hidden">
        <Carousel
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ loop: true }}
        >
          <CarouselContent>
            {[
              'https://img.usecurling.com/p/1600/600?q=luxury%20dental%20clinic',
              'https://img.usecurling.com/p/1600/600?q=smiling%20woman%20teeth',
              'https://img.usecurling.com/p/1600/600?q=dentist%20working',
            ].map((img, i) => (
              <CarouselItem key={i} className="w-full">
                <div className="relative h-[60vh] md:h-[75vh] w-full bg-black">
                  <img
                    src={img}
                    alt={`Banner ${i}`}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 gap-4 z-10 hidden md:flex">
            <CarouselPrevious className="relative inset-0 h-12 w-12 bg-black/50 border-white/20 text-white hover:bg-nuvia-gold hover:text-black" />
            <CarouselNext className="relative inset-0 h-12 w-12 bg-black/50 border-white/20 text-white hover:bg-nuvia-gold hover:text-black" />
          </div>
        </Carousel>
      </section>

      <section className="flex flex-col md:flex-row min-h-[500px] border-y border-white/5">
        <div className="w-full md:w-1/2 relative min-h-[400px]">
          <img
            src="https://img.usecurling.com/p/800/800?q=elegant%20woman%20laughing"
            className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] contrast-125"
            alt="Sorriso"
          />
        </div>
        <div className="w-full md:w-1/2 bg-nuvia-navy flex items-center p-12 md:p-24 relative">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-nuvia-gold leading-tight max-w-xl relative z-10">
            Porque sorrir, para Nuvia, é mais que mostrar dentes, é revelar quem se é, com verdade e
            elegância.
          </h2>
        </div>
      </section>

      <section ref={processSec.ref} className="py-24 px-6 md:px-12 bg-[#0a0a0a]">
        <div
          className={cn(
            'max-w-7xl mx-auto opacity-0',
            processSec.isIntersecting && 'animate-fade-in-up',
          )}
        >
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-24 items-start">
            <div className="sticky top-32 space-y-6">
              <p className="text-zinc-400 uppercase tracking-widest text-sm font-semibold">
                Entenda
              </p>
              <h2 className="text-4xl md:text-5xl font-serif text-nuvia-gold leading-tight">
                COMO É REALIZADO
                <br />
                SEU TRATAMENTO:
              </h2>
              <div className="w-16 h-px bg-nuvia-gold my-8"></div>
              <p className="text-xl text-nuvia-gold italic font-serif">
                Cuidamos de cada detalhe da sua jornada.
              </p>
              <p className="text-zinc-400 leading-relaxed text-lg font-light">
                Do primeiro contato até a sua recuperação completa, oferecemos acompanhamento
                contínuo, personalizado e humanizado, garantindo segurança, conforto e resultados
                duradouros.
              </p>
              <Button className="mt-8 bg-nuvia-gold hover:bg-nuvia-gold/90 text-black font-bold h-14 px-8 text-lg rounded-sm w-full md:w-auto">
                Agende sua consulta <Calendar className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="relative pl-8 md:pl-16 py-4">
              <div className="absolute left-[19px] top-4 bottom-4 w-px bg-nuvia-gold/30"></div>
              <div className="space-y-16">
                {STEPS.map((step, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[45px] top-0 w-10 h-10 rounded-full bg-nuvia-gold text-black font-bold text-xl flex items-center justify-center ring-8 ring-[#0a0a0a]">
                      {i + 1}
                    </div>
                    <div className="pl-4">
                      <h3 className="text-2xl font-bold text-white mb-4">{step.t}</h3>
                      <p className="text-zinc-400 leading-relaxed font-light">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={gallerySec.ref}
        className={cn(
          'py-24 bg-[#111] px-6 md:px-12 border-t border-white/5 opacity-0',
          gallerySec.isIntersecting && 'animate-fade-in-up',
        )}
      >
        <div className="max-w-[1400px] mx-auto space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-serif text-nuvia-gold uppercase tracking-wider max-w-4xl mx-auto leading-tight">
              Confira os nossos resultados reais de alguns famosos
            </h2>
            <div className="w-24 h-px bg-nuvia-gold/50 mx-auto"></div>
          </div>
          <div className="relative">
            <Carousel opts={{ align: 'start', loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {[15, 22, 33, 44, 55].map((seed, i) => (
                  <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/4">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden border-t-4 border-nuvia-gold relative group bg-[#0a0a0a]">
                      <img
                        src={`https://img.usecurling.com/ppl/large?gender=${i % 2 === 0 ? 'female' : 'male'}&seed=${seed}`}
                        alt="Resultado"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="absolute -left-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-[#1A1A1A] border-white/10 text-white hover:bg-nuvia-gold hover:text-black" />
                <CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-[#1A1A1A] border-white/10 text-white hover:bg-nuvia-gold hover:text-black" />
              </div>
            </Carousel>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-8 pt-8 snap-x snap-mandatory hide-scrollbar">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="snap-center shrink-0 w-[300px] md:w-[380px]">
                <div className="bg-[#1A1A1A] p-8 rounded-xl flex flex-col gap-6 h-full border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-full bg-nuvia-gold flex items-center justify-center text-black font-bold uppercase text-lg shrink-0">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-white font-bold text-sm capitalize">{t.name}</span>
                          <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
                        </div>
                        <span className="text-zinc-500 text-xs">{t.time}</span>
                      </div>
                    </div>
                    <div className="w-6 h-6 flex items-center justify-center bg-white rounded-full shrink-0">
                      <span className="font-extrabold text-sm text-blue-600">G</span>
                    </div>
                  </div>
                  <div className="flex gap-1 text-nuvia-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed flex-1">{t.text}</p>
                  <button className="text-zinc-500 text-xs text-left hover:text-white transition-colors font-medium mt-auto">
                    Consulte Mais informação
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-nuvia-navy text-zinc-400 py-16 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex items-center gap-4">
            <img
              src={logoUrl}
              alt="Nuvia"
              className="h-8 object-contain brightness-0 invert opacity-50"
            />
            <span className="w-px h-8 bg-white/10 hidden md:block"></span>
            <span className="font-serif tracking-widest text-sm text-nuvia-gold">
              EXCELÊNCIA EM ODONTOLOGIA
            </span>
          </div>
          <p className="text-sm tracking-widest opacity-60">
            &copy; {new Date().getFullYear()} NUVIA. TODOS OS DIREITOS RESERVADOS.
          </p>
        </div>
      </footer>
    </div>
  )
}
