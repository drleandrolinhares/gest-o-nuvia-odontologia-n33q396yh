import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Supabase mock ────────────────────────────────────────────────────────────
// We build a chainable query builder that resolves with { data, error }
const makeQueryBuilder = (resolvedValue = { data: [], error: null }) => {
  const builder: Record<string, unknown> = {}
  const chainFns = ['select', 'insert', 'update', 'delete', 'eq', 'gte', 'lte']
  chainFns.forEach((fn) => {
    builder[fn] = vi.fn(() => builder)
  })
  builder['single'] = vi.fn().mockResolvedValue(resolvedValue)
  // Make the builder itself a promise (for .from().select() direct await)
  builder['then'] = (resolve: (v: unknown) => void) => Promise.resolve(resolvedValue).then(resolve)
  return builder
}

let qb = makeQueryBuilder()

vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => qb),
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: { success: true }, error: null }),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
        remove: vi.fn().mockResolvedValue({ data: {}, error: null }),
      })),
    },
    auth: { signOut: vi.fn() },
  },
}))

import { employeeService } from '../employeeService'
import { supabase } from '@/lib/supabase/client'

const fromMock = supabase.from as ReturnType<typeof vi.fn>
const functionsMock = supabase.functions.invoke as ReturnType<typeof vi.fn>

beforeEach(() => {
  qb = makeQueryBuilder()
  fromMock.mockReturnValue(qb)
  vi.clearAllMocks()
  fromMock.mockReturnValue(qb)
})

// ── fetchAll ─────────────────────────────────────────────────────────────────

describe('employeeService.fetchAll', () => {
  it('consulta a tabela employees', () => {
    employeeService.fetchAll()
    expect(fromMock).toHaveBeenCalledWith('employees')
  })

  it('faz select de todas as colunas', () => {
    employeeService.fetchAll()
    expect(qb.select).toHaveBeenCalledWith('*')
  })
})

// ── create ───────────────────────────────────────────────────────────────────

describe('employeeService.create', () => {
  it('insere na tabela employees com os dados fornecidos', () => {
    const data = {
      name: 'Fulano',
      email: 'fulano@test.com',
      role: 'Dentista',
      department: 'Clínica',
    }
    employeeService.create(data as Parameters<typeof employeeService.create>[0])
    expect(fromMock).toHaveBeenCalledWith('employees')
    expect(qb.insert).toHaveBeenCalledWith([data])
  })

  it('encadeia .select().single() para retornar o registro criado', () => {
    const data = {
      name: 'Fulano',
      email: 'fulano@test.com',
      role: 'Dentista',
      department: 'Clínica',
    }
    employeeService.create(data as Parameters<typeof employeeService.create>[0])
    expect(qb.select).toHaveBeenCalled()
    expect(qb.single).toHaveBeenCalled()
  })
})

// ── update ───────────────────────────────────────────────────────────────────

describe('employeeService.update', () => {
  it('atualiza o registro correto pelo id', () => {
    const id = 'abc-123'
    const data = { name: 'Novo Nome' }
    employeeService.update(id, data)
    expect(fromMock).toHaveBeenCalledWith('employees')
    expect(qb.update).toHaveBeenCalledWith(data)
    expect(qb.eq).toHaveBeenCalledWith('id', id)
  })
})

// ── updateStatus ─────────────────────────────────────────────────────────────

describe('employeeService.updateStatus', () => {
  it('envia apenas o campo status na atualização', () => {
    employeeService.updateStatus('emp-1', 'INATIVO')
    expect(qb.update).toHaveBeenCalledWith({ status: 'INATIVO' })
    expect(qb.eq).toHaveBeenCalledWith('id', 'emp-1')
  })
})

// ── delete ───────────────────────────────────────────────────────────────────

describe('employeeService.delete', () => {
  it('deleta pelo id correto', () => {
    employeeService.delete('del-456')
    expect(fromMock).toHaveBeenCalledWith('employees')
    expect(qb.delete).toHaveBeenCalled()
    expect(qb.eq).toHaveBeenCalledWith('id', 'del-456')
  })
})

// ── updatePassword ───────────────────────────────────────────────────────────

describe('employeeService.updatePassword', () => {
  it('invoca a edge function update-user-password com userId e newPassword', async () => {
    await employeeService.updatePassword('user-1', 'nova-senha-123')
    expect(functionsMock).toHaveBeenCalledWith('update-user-password', {
      body: { userId: 'user-1', newPassword: 'nova-senha-123' },
    })
  })
})

// ── createAuthUser ────────────────────────────────────────────────────────────

describe('employeeService.createAuthUser', () => {
  it('invoca a edge function admin-create-user', async () => {
    await employeeService.createAuthUser('test@test.com', 'pass123', 'Test User')
    expect(functionsMock).toHaveBeenCalledWith('admin-create-user', {
      body: { email: 'test@test.com', password: 'pass123', name: 'Test User' },
    })
  })
})

// ── fetchDocuments ────────────────────────────────────────────────────────────

describe('employeeService.fetchDocuments', () => {
  it('consulta a tabela employee_documents', () => {
    employeeService.fetchDocuments()
    expect(fromMock).toHaveBeenCalledWith('employee_documents')
    expect(qb.select).toHaveBeenCalledWith('*')
  })
})
