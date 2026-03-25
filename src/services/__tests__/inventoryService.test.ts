import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Supabase mock ────────────────────────────────────────────────────────────
const makeQueryBuilder = (resolvedValue = { data: [], error: null }) => {
  const builder: Record<string, unknown> = {}
  const chainFns = ['select', 'insert', 'update', 'delete', 'eq', 'in', 'order', 'limit', 'lt']
  chainFns.forEach((fn) => {
    builder[fn] = vi.fn(() => builder)
  })
  builder['single'] = vi.fn().mockResolvedValue(resolvedValue)
  builder['then'] = (resolve: (v: unknown) => void) => Promise.resolve(resolvedValue).then(resolve)
  return builder
}

let qb = makeQueryBuilder()

vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => qb),
    auth: { signOut: vi.fn() },
  },
}))

import { inventoryService } from '../inventoryService'
import { supabase } from '@/lib/supabase/client'

const fromMock = supabase.from as ReturnType<typeof vi.fn>

beforeEach(() => {
  qb = makeQueryBuilder()
  fromMock.mockReturnValue(qb)
  vi.clearAllMocks()
  fromMock.mockReturnValue(qb)
})

// ── fetchAll ─────────────────────────────────────────────────────────────────

describe('inventoryService.fetchAll', () => {
  it('consulta a tabela inventory', () => {
    inventoryService.fetchAll()
    expect(fromMock).toHaveBeenCalledWith('inventory')
  })

  it('faz select de todas as colunas', () => {
    inventoryService.fetchAll()
    expect(qb.select).toHaveBeenCalledWith('*')
  })
})

// ── fetchOptions ─────────────────────────────────────────────────────────────

describe('inventoryService.fetchOptions', () => {
  it('consulta a tabela inventory_settings', () => {
    inventoryService.fetchOptions()
    expect(fromMock).toHaveBeenCalledWith('inventory_settings')
  })
})

// ── create ───────────────────────────────────────────────────────────────────

describe('inventoryService.create', () => {
  it('insere na tabela inventory', () => {
    const item = {
      name: 'Mini Pilar',
      packageCost: 100,
      storageLocation: 'Sala 1',
      packageType: 'CAIXA',
      itemsPerBox: 10,
      minStock: 5,
      quantity: 50,
      specialty: 'IMPLANTODONTIA',
    } as Parameters<typeof inventoryService.create>[0]

    inventoryService.create(item)
    expect(fromMock).toHaveBeenCalledWith('inventory')
    expect(qb.insert).toHaveBeenCalled()
  })

  it('encadeia .select().single() para retornar o registro criado', () => {
    const item = { name: 'Test', packageType: 'CAIXA', quantity: 1 } as any
    inventoryService.create(item)
    expect(qb.select).toHaveBeenCalled()
    expect(qb.single).toHaveBeenCalled()
  })

  it('cria purchase_history quando há pacotes iniciais', () => {
    const item = {
      name: 'Item com histórico',
      packageCost: 50,
      packageType: 'CAIXA',
      itemsPerBox: 5,
      quantity: 25,
      initialPackages: 5,
    } as any
    inventoryService.create(item)
    const insertCall = (qb.insert as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(insertCall[0].purchase_history).toHaveLength(1)
    expect(insertCall[0].purchase_history[0]).toHaveProperty('price', 50)
    expect(insertCall[0].purchase_history[0]).toHaveProperty('quantity', 5)
  })
})

// ── updateQuantity ───────────────────────────────────────────────────────────

describe('inventoryService.updateQuantity', () => {
  it('atualiza apenas a quantidade pelo id', () => {
    inventoryService.updateQuantity('inv-1', 42)
    expect(fromMock).toHaveBeenCalledWith('inventory')
    expect(qb.update).toHaveBeenCalledWith({ quantity: 42 })
    expect(qb.eq).toHaveBeenCalledWith('id', 'inv-1')
  })
})

// ── update ───────────────────────────────────────────────────────────────────

describe('inventoryService.update', () => {
  it('atualiza o registro correto pelo id', () => {
    const payload = { name: 'Novo Nome' }
    inventoryService.update('inv-2', payload as any)
    expect(fromMock).toHaveBeenCalledWith('inventory')
    expect(qb.update).toHaveBeenCalledWith(payload)
    expect(qb.eq).toHaveBeenCalledWith('id', 'inv-2')
  })
})

// ── delete ───────────────────────────────────────────────────────────────────

describe('inventoryService.delete', () => {
  it('deleta pelo id correto', () => {
    inventoryService.delete('del-789')
    expect(fromMock).toHaveBeenCalledWith('inventory')
    expect(qb.delete).toHaveBeenCalled()
    expect(qb.eq).toHaveBeenCalledWith('id', 'del-789')
  })
})

// ── addOption ────────────────────────────────────────────────────────────────

describe('inventoryService.addOption', () => {
  it('insere na tabela inventory_settings', () => {
    inventoryService.addOption('MARCA_IMPLANTE', 'Straumann', 'Straumann')
    expect(fromMock).toHaveBeenCalledWith('inventory_settings')
    expect(qb.insert).toHaveBeenCalledWith([{ category: 'MARCA_IMPLANTE', label: 'Straumann', value: 'Straumann' }])
  })

  it('usa value como label quando label não é fornecido', () => {
    inventoryService.addOption('specialty', 'PRÓTESE')
    expect(qb.insert).toHaveBeenCalledWith([{ category: 'specialty', label: 'PRÓTESE', value: 'PRÓTESE' }])
  })
})

// ── removeOption ─────────────────────────────────────────────────────────────

describe('inventoryService.removeOption', () => {
  it('deleta pelo id correto na tabela inventory_settings', () => {
    inventoryService.removeOption('opt-123')
    expect(fromMock).toHaveBeenCalledWith('inventory_settings')
    expect(qb.delete).toHaveBeenCalled()
    expect(qb.eq).toHaveBeenCalledWith('id', 'opt-123')
  })
})

// ── fetchMovements ──────────────────────────────────────────────────────────

describe('inventoryService.fetchMovements', () => {
  it('consulta inventory_movements com o id correto', () => {
    inventoryService.fetchMovements('inv-999')
    expect(fromMock).toHaveBeenCalledWith('inventory_movements')
    expect(qb.eq).toHaveBeenCalledWith('inventory_id', 'inv-999')
  })

  it('ordena por created_at descendente', () => {
    inventoryService.fetchMovements('inv-999')
    expect(qb.order).toHaveBeenCalledWith('created_at', { ascending: false })
  })
})
