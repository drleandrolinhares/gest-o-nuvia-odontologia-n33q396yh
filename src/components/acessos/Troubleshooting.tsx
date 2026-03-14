import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LifeBuoy, HelpCircle, AlertTriangle } from 'lucide-react'
import { AccessItem } from '@/stores/main'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function Troubleshooting({ item }: { item: AccessItem }) {
  const faqs = item.troubleshooting || []

  return (
    <Card className="shadow-sm border-muted h-fit">
      <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
        <CardTitle className="text-primary text-lg flex items-center gap-2">
          <LifeBuoy className="h-5 w-5" /> SOLUÇÃO DE PROBLEMAS (FAQ)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {faqs.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.id || index}
                value={`item-${index}`}
                className="border-b border-muted py-1"
              >
                <AccordionTrigger className="hover:no-underline py-3 text-left">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-amber-500 shrink-0" />
                    <span className="text-sm font-bold text-slate-800 leading-snug">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 pl-8">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-xl bg-slate-50/50">
            <AlertTriangle className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest">
              NENHUM PROBLEMA COMUM MAPEADO.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
