export const PERMISSIONS_CONFIG = {
  precificacao: {
    visualizar: true,
    pode_ver: true,
    criar: true,
    editar: true,
    deletar: true,
  },
  estoque: {
    visualizar: true,
    pode_ver: true,
    criar: true,
    editar: true,
    deletar: true,
  },
  usuarios: {
    visualizar: true,
    pode_ver: true,
    criar: true,
    editar: true,
    deletar: true,
  },
  escala_trabalho: {
    visualizar: true,
    pode_ver: true,
    criar: true,
    editar: true,
    deletar: true,
  },
  dashboard: {
    visualizar: true,
    pode_ver: true,
    criar: false,
    editar: false,
    deletar: false,
  },
  kpis: {
    visualizar: true,
    pode_ver: true,
    criar: false,
    editar: false,
    deletar: false,
  },
  bonificacoes: {
    visualizar: true,
    pode_ver: true,
    criar: true,
    editar: true,
    deletar: true,
  },
  configuracoes: {
    visualizar: true,
    pode_ver: true,
    criar: true,
    editar: true,
    deletar: true,
  },
  permissoes: {
    visualizar: true,
    pode_ver: true,
    criar: true,
    editar: true,
    deletar: true,
  },
  logs: {
    visualizar: true,
    pode_ver: true,
    criar: false,
    editar: false,
    deletar: false,
  },
  debug: {
    visualizar: true,
    pode_ver: true,
    criar: false,
    editar: false,
    deletar: false,
  },
} as const

export type PermissionKey = keyof typeof PERMISSIONS_CONFIG
export type PermissionAction = 'visualizar' | 'pode_ver' | 'criar' | 'editar' | 'deletar'

export function checkPermission(module: PermissionKey, action: PermissionAction): boolean {
  return PERMISSIONS_CONFIG[module]?.[action] === true
}
