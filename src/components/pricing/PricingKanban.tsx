import { useMemo } from 'react'
import useAppStore from '@/stores/main'

export function PricingKanban() {
  const store = useAppStore() as any

  // Dados seguros com fallback para array vazio
  const pricingData = useMemo(() => {
    const data = store?.pricingData ?? []
    return Array.isArray(data) ? data : []
  }, [store?.pricingData])

  if (!pricingData || pricingData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">Nenhum dado de precificação disponível</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pricingData.map((item: any, index: number) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">{item.name || 'Sem nome'}</h3>
            <p className="text-sm text-gray-600 mt-1">{item.description || ''}</p>
            <p className="text-lg font-bold text-nuvia-navy mt-2">
              {item.price ? `R$ ${item.price.toFixed(2)}` : 'Preço não definido'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
