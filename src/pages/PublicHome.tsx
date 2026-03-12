import { useRef } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Clock, Shield } from 'lucide-react'

import refImg2 from '../assets/img_3236-d713c.jpg'

export default function PublicHome() {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }))

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative w-full h-[80vh] bg-nuvia-blue overflow-hidden">
        <Carousel plugins={[plugin.current]} className="w-full h-full" opts={{ loop: true }}>
          <CarouselContent className="h-full ml-0">
            <CarouselItem className="pl-0 h-[80vh] relative">
              <img
                src="https://img.usecurling.com/p/1600/900?q=dentist%20working%20clinic&color=blue"
                alt="Clínica Nuvia"
                className="w-full h-full object-cover opacity-60"
              />
            </CarouselItem>
            <CarouselItem className="pl-0 h-[80vh] relative">
              <img
                src="https://img.usecurling.com/p/1600/900?q=happy%20brazilian%20woman%20smiling"
                alt="Sorriso Nuvia"
                className="w-full h-full object-cover opacity-60"
              />
            </CarouselItem>
            <CarouselItem className="pl-0 h-[80vh] relative">
              <img
                src={refImg2}
                alt="Manifesto Nuvia"
                className="w-full h-full object-cover opacity-50 object-top"
              />
            </CarouselItem>
          </CarouselContent>
          <div className="absolute inset-0 bg-gradient-to-t from-nuvia-blue via-transparent to-transparent pointer-events-none" />

          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 text-center pointer-events-none">
            <div className="mb-8 animate-fade-in-up">
              <svg
                viewBox="0 0 100 60"
                className="h-32 md:h-48 w-auto text-nuvia-gold fill-none stroke-current stroke-[1.5] mx-auto drop-shadow-2xl"
              >
                <path d="M30 40 C 10 40, 10 10, 30 10 C 45 10, 50 25, 50 25 C 50 25, 55 10, 70 10 C 90 10, 90 40, 70 40 C 55 40, 50 25, 50 25 C 50 25, 45 40, 30 40 Z" />
              </svg>
              <h1 className="text-4xl md:text-7xl font-serif font-bold tracking-[0.2em] text-nuvia-gold mt-4 drop-shadow-xl">
                NUVIA
              </h1>
              <p className="text-sm md:text-xl tracking-[0.3em] text-white mt-2 font-light">
                ODONTOLOGIA
              </p>
            </div>

            <p
              className="max-w-2xl text-lg md:text-2xl text-white font-serif italic mb-8 drop-shadow-md animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              "Porque sorrir para Nuvia, é mais que mostrar dentes, é revelar quem se é, com verdade
              e elegância."
            </p>

            <Button
              className="bg-nuvia-gold hover:bg-[#b8853b] text-nuvia-blue font-bold px-8 py-6 text-lg rounded-sm pointer-events-auto animate-fade-in-up"
              style={{ animationDelay: '400ms' }}
            >
              Agendar Avaliação
            </Button>
          </div>

          <div className="hidden md:block">
            <CarouselPrevious className="left-8 border-nuvia-gold text-nuvia-gold hover:bg-nuvia-gold hover:text-nuvia-blue bg-transparent" />
            <CarouselNext className="right-8 border-nuvia-gold text-nuvia-gold hover:bg-nuvia-gold hover:text-nuvia-blue bg-transparent" />
          </div>
        </Carousel>
      </section>

      <section id="sobre" className="py-24 bg-nuvia-blue text-white border-t border-nuvia-gold/20">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-nuvia-gold text-3xl md:text-5xl font-serif">
                A Arte de Transformar
              </h2>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                Nuvia nasce como um sopro leve, desenhando no ar a promessa de um novo sorriso. Não
                é apenas odontologia, é a arte de transformar ciência em confiança e cuidado em
                beleza.
              </p>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                Sua essência é sofisticação acessível: um espaço onde leveza e inovação caminham
                juntas para revelar a sua melhor versão.
              </p>
              <Button
                variant="outline"
                className="border-nuvia-gold text-nuvia-gold hover:bg-nuvia-gold hover:text-nuvia-blue rounded-sm mt-4"
              >
                Conheça Nossa História
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://img.usecurling.com/p/600/800?q=dentistry%20tools&color=yellow"
                alt="Instrumentos"
                className="rounded-t-full h-64 w-full object-cover border border-nuvia-gold/30"
              />
              <img
                src="https://img.usecurling.com/p/600/800?q=beautiful%20brazilian%20smile"
                alt="Sorriso Brasileiro"
                className="rounded-b-full h-64 w-full object-cover mt-12 border border-nuvia-gold/30"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="py-24 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-nuvia-blue text-3xl md:text-5xl font-serif mb-4">
              Nossos Tratamentos
            </h2>
            <div className="h-1 w-24 bg-nuvia-gold mx-auto rounded-full"></div>
            <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-lg">
              Oferecemos uma gama completa de serviços odontológicos, aliando tecnologia de ponta ao
              toque humano e especializado.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Estética Dental',
                desc: 'Facetas, lentes de contato e clareamento para um sorriso radiante.',
                icon: <Star className="h-8 w-8 text-nuvia-gold" />,
              },
              {
                title: 'Implantes',
                desc: 'Reabilitação oral segura e definitiva, devolvendo sua confiança.',
                icon: <Shield className="h-8 w-8 text-nuvia-gold" />,
              },
              {
                title: 'Ortodontia',
                desc: 'Alinhadores invisíveis e aparelhos modernos para um sorriso perfeito.',
                icon: <Clock className="h-8 w-8 text-nuvia-gold" />,
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-sm shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
              >
                <div className="mb-6 bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-nuvia-gold/10 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-serif text-nuvia-blue mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-6">{service.desc}</p>
                <a
                  href="#"
                  className="text-nuvia-gold font-medium flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Saiba mais <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="py-24 bg-nuvia-gold">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-nuvia-blue text-3xl md:text-5xl font-serif mb-6">
            Explore Nosso Blog
          </h2>
          <p className="text-nuvia-blue/80 max-w-2xl mx-auto text-lg mb-10">
            Dicas, novidades e artigos sobre saúde bucal, estética e bem-estar, escritos por nossos
            especialistas.
          </p>
          <Button className="bg-nuvia-blue hover:bg-nuvia-dark text-nuvia-gold rounded-sm px-8 py-6 text-lg">
            Acessar Blog
          </Button>
        </div>
      </section>
    </div>
  )
}
