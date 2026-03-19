import { useState } from 'react'
import { Ser5sForm } from './Ser5sForm'
import { Ser5sList } from './Ser5sList'

export function Ser5sSection() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-lg font-black tracking-widest text-slate-800 uppercase">
          O que é o método 5S?
        </h3>
        <p className="text-sm text-slate-600 font-medium normal-case">
          SER 5S é um método de organização e disciplina no trabalho. Ele ajuda a manter o ambiente
          limpo, funcional, padronizado e mais produtivo.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div>
            <h4 className="font-bold text-slate-700 text-sm mb-2 uppercase">Pilares:</h4>
            <ul className="text-sm text-slate-600 space-y-1.5 list-disc pl-4 normal-case">
              <li>
                <strong>Senso de Utilização:</strong> manter apenas o que realmente é necessário
              </li>
              <li>
                <strong>Senso de Organização:</strong> deixar cada item no lugar certo
              </li>
              <li>
                <strong>Senso de Limpeza:</strong> manter o ambiente limpo e agradável
              </li>
              <li>
                <strong>Senso de Padronização:</strong> seguir um padrão visual e funcional
              </li>
              <li>
                <strong>Senso de Disciplina:</strong> transformar essa prática em hábito
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-700 text-sm mb-2 uppercase">Exemplos Práticos:</h4>
            <ul className="text-sm text-slate-600 space-y-1.5 list-disc pl-4 normal-case">
              <li>Bancada organizada</li>
              <li>Gavetas em ordem</li>
              <li>Materiais bem posicionados</li>
              <li>Ambiente limpo</li>
              <li>Itens desnecessários removidos</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 p-6 rounded-xl border-2 border-dashed border-slate-200">
        <h3 className="text-base font-bold mb-4 uppercase tracking-wider text-slate-700">
          Envie sua foto semanal do SER 5S e registre sua organização.
        </h3>
        <Ser5sForm onSubmitted={() => setRefreshKey((k) => k + 1)} />
      </div>

      <Ser5sList refreshKey={refreshKey} />
    </div>
  )
}
