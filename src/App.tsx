import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import React, { Suspense } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import PermissionRoute from '@/components/PermissionRoute'
import { LoadingScreen } from '@/components/LoadingScreen'

const Index = React.lazy(() => import('@/pages/Index'))
const Inventory = React.lazy(() => import('@/pages/Inventory'))
const Pricing = React.lazy(() => import('@/pages/Pricing'))
const Negotiation = React.lazy(() => import('@/pages/Negotiation'))
const AgendaSegmentation = React.lazy(() => import('@/pages/AgendaSegmentation'))
const Settings = React.lazy(() => import('@/pages/Settings'))
const NotFound = React.lazy(() => import('@/pages/NotFound'))
const RotinaDiaria = React.lazy(() => import('@/pages/RotinaDiaria'))
const ConfigurarRotina = React.lazy(() => import('@/pages/ConfigurarRotina'))
const Acessos = React.lazy(() => import('@/pages/Acessos'))
const AcessoManual = React.lazy(() => import('@/pages/AcessoManual'))
const Login = React.lazy(() => import('@/pages/Login'))
const SAC = React.lazy(() => import('@/pages/SAC'))
const GestaoFiscal = React.lazy(() => import('@/pages/GestaoFiscal'))
const GestaoVendas = React.lazy(() => import('@/pages/GestaoVendas'))
const KPIs = React.lazy(() => import('@/pages/KPIs'))
const AuditLog = React.lazy(() => import('@/pages/AuditLog'))
const ForceChangePassword = React.lazy(() => import('@/pages/ForceChangePassword'))
const DebugAccess = React.lazy(() => import('@/pages/DebugAccess'))
const AccessDenied = React.lazy(() => import('@/pages/AccessDenied'))
const UsuariosPermissoes = React.lazy(() => import('@/pages/UsuariosPermissoes'))
const Permissoes = React.lazy(() => import('@/pages/Permissoes'))
const KpiPermissions = React.lazy(() => import('@/pages/KpiPermissions'))
const KpiBonificacoes = React.lazy(() => import('@/pages/KpiBonificacoes'))
const KpiConfiguracoes = React.lazy(() => import('@/pages/KpiConfiguracoes'))

// Novos Módulos
const Comunicados = React.lazy(() => import('@/pages/Comunicados'))
const Performance = React.lazy(() => import('@/pages/Performance'))
const PerformancePPPdm = React.lazy(() => import('@/pages/PerformancePPPdm'))
const PerformanceSer5s = React.lazy(() => import('@/pages/PerformanceSer5s'))
const PerformanceInovacao = React.lazy(() => import('@/pages/PerformanceInovacao'))
const PerformanceLeitura = React.lazy(() => import('@/pages/PerformanceLeitura'))
const AvisosRecados = React.lazy(() => import('@/pages/AvisosRecados'))
const EscalaTrabalho = React.lazy(() => import('@/pages/EscalaTrabalho'))
const RotinaRelatorio = React.lazy(() => import('@/pages/RotinaRelatorio'))

import { AppProvider } from '@/stores/main'
import { AuthProvider } from '@/hooks/use-auth'
import { HubProvider } from '@/stores/hub'
import { ChatProvider } from '@/stores/chat'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ChatProvider>
          <HubProvider>
            <AppProvider>
              <Router>
                <Suspense fallback={<LoadingScreen />}>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/force-change-password" element={<ForceChangePassword />} />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Layout />
                        </ProtectedRoute>
                      }
                    >
                      <Route
                        index
                        element={
                          <PermissionRoute module="DASHBOARD">
                            <Index />
                          </PermissionRoute>
                        }
                      />

                      {/* REDIRECTS DE ROTAS ANTIGAS */}
                      <Route path="agenda" element={<Navigate to="/avisos-e-recados" replace />} />
                      <Route
                        path="mural-de-avisos"
                        element={<Navigate to="/comunicados" replace />}
                      />
                      <Route
                        path="desenvolvimento-e-performance"
                        element={<Navigate to="/performance" replace />}
                      />
                      <Route
                        path="ranking-performan"
                        element={<Navigate to="/performance" replace />}
                      />
                      <Route path="auditoria-de-rotas" element={<Navigate to="/logs" replace />} />
                      <Route path="pp-pdm" element={<Navigate to="/performance" replace />} />

                      {/* OPERACIONAL */}
                      <Route
                        path="sac"
                        element={
                          <PermissionRoute module="SAC">
                            <SAC />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="rotina-diaria"
                        element={
                          <PermissionRoute module="ROTINA DIÁRIA">
                            <RotinaDiaria />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="rotina-diaria/configurar-rotina"
                        element={
                          <PermissionRoute module="ROTINA DIÁRIA" adminOnly>
                            <ConfigurarRotina />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="rotina-relatorio"
                        element={
                          <PermissionRoute module="ROTINA DIÁRIA" adminOnly>
                            <RotinaRelatorio />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="performance"
                        element={
                          <PermissionRoute module="PERFORMANCE">
                            <Performance />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="performance/pp-pdm"
                        element={
                          <PermissionRoute module="PERFORMANCE">
                            <PerformancePPPdm />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="performance/ser-5s"
                        element={
                          <PermissionRoute module="PERFORMANCE">
                            <PerformanceSer5s />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="performance/inovacao-implementada"
                        element={
                          <PermissionRoute module="PERFORMANCE">
                            <PerformanceInovacao />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="performance/leitura-do-mes"
                        element={
                          <PermissionRoute module="PERFORMANCE">
                            <PerformanceLeitura />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="comunicados"
                        element={
                          <PermissionRoute module="COMUNICADOS">
                            <Comunicados />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="avisos-e-recados"
                        element={
                          <PermissionRoute module="AVISOS E RECADOS">
                            <AvisosRecados />
                          </PermissionRoute>
                        }
                      />

                      {/* COMERCIAL */}
                      <Route
                        path="gestao-de-vendas"
                        element={
                          <PermissionRoute module="GESTÃO DE VENDAS">
                            <GestaoVendas />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="negociacao"
                        element={
                          <PermissionRoute module="NEGOCIAÇÃO">
                            <Negotiation />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="gestao-fiscal"
                        element={
                          <PermissionRoute module="GESTÃO FISCAL">
                            <GestaoFiscal />
                          </PermissionRoute>
                        }
                      />

                      {/* FINANCEIRO */}
                      <Route
                        path="central-de-acessos"
                        element={
                          <PermissionRoute module="CENTRAL DE ACESSOS">
                            <Acessos />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="central-de-acessos/:id"
                        element={
                          <PermissionRoute module="CENTRAL DE ACESSOS">
                            <AcessoManual />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="estoque"
                        element={
                          <PermissionRoute module="ESTOQUE">
                            <Inventory />
                          </PermissionRoute>
                        }
                      />

                      {/* ADMINISTRATIVO */}
                      <Route
                        path="dashboard"
                        element={
                          <PermissionRoute module="DASHBOARD">
                            <Index />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="kpis"
                        element={
                          <PermissionRoute module="KPIS">
                            <KPIs />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="kpis/permissoes"
                        element={
                          <PermissionRoute module="KPIS" adminOnly>
                            <KpiPermissions />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="kpis/bonificacoes"
                        element={
                          <PermissionRoute module="KPIS" adminOnly>
                            <KpiBonificacoes />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="kpis/configuracoes"
                        element={
                          <PermissionRoute module="KPIS" adminOnly>
                            <KpiConfiguracoes />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="usuarios"
                        element={
                          <PermissionRoute module="USUÁRIOS">
                            <UsuariosPermissoes />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="escala-de-trabalho"
                        element={
                          <PermissionRoute module="ESCALA DE TRABALHO">
                            <EscalaTrabalho />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="precificacao"
                        element={
                          <PermissionRoute module="PRECIFICAÇÃO">
                            <Pricing />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="segmentacao-agenda"
                        element={
                          <PermissionRoute module="SEGMENTAÇÃO DA AGENDA">
                            <AgendaSegmentation />
                          </PermissionRoute>
                        }
                      />

                      {/* SISTEMA */}
                      <Route
                        path="configuracoes"
                        element={
                          <PermissionRoute module="CONFIGURAÇÕES">
                            <Settings />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="permissoes"
                        element={
                          <PermissionRoute module="PERMISSÕES">
                            <Permissoes />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="logs"
                        element={
                          <PermissionRoute module="LOGS">
                            <AuditLog />
                          </PermissionRoute>
                        }
                      />
                      <Route
                        path="debug"
                        element={
                          <PermissionRoute module="DEBUG" adminOnly>
                            <DebugAccess />
                          </PermissionRoute>
                        }
                      />

                      <Route path="acesso-negado" element={<AccessDenied />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </Suspense>
              </Router>
              <Toaster />
            </AppProvider>
          </HubProvider>
        </ChatProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
