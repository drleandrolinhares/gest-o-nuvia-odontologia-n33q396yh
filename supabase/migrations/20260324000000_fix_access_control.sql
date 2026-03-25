-- =============================================================================
-- CORREÇÃO DOS 9 PROBLEMAS DE NÍVEIS DE ACESSO
-- Data: 2026-03-24
-- =============================================================================

-- =============================================================================
-- FIX 4+8: Atualizar is_admin_user() para alinhar exatamente com o frontend
-- Frontend usa: role.toLowerCase().includes('admin') || .includes('diretor')
-- Adicionamos SET search_path para evitar injection via search_path hijacking
-- =============================================================================
CREATE OR REPLACE FUNCTION public.is_admin_user(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.employees
    WHERE user_id = user_uuid AND (
      LOWER(role) LIKE '%admin%' OR
      LOWER(role) LIKE '%diretor%' OR
      'ADMIN'     = ANY(team_category) OR
      'DIRETORIA' = ANY(team_category) OR
      'MASTER'    = ANY(team_category)
    )
  );
$$;

-- Garantir que is_master_user também use search_path seguro
CREATE OR REPLACE FUNCTION public.is_master_user(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.employees
    WHERE user_id = user_uuid AND 'MASTER' = ANY(team_category)
  );
$$;

-- =============================================================================
-- FIX 1+2: app_settings — leitura livre, escrita apenas admin/master
-- =============================================================================
DROP POLICY IF EXISTS "Allow all authenticated users on app_settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow all authenticated users" ON public.app_settings;

CREATE POLICY "app_settings_select" ON public.app_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "app_settings_write" ON public.app_settings
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()));

CREATE POLICY "app_settings_update" ON public.app_settings
  FOR UPDATE TO authenticated
  USING (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()));

CREATE POLICY "app_settings_delete" ON public.app_settings
  FOR DELETE TO authenticated
  USING (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()));

-- =============================================================================
-- FIX 1+2: price_list — leitura livre, escrita apenas admin/master
-- =============================================================================
DROP POLICY IF EXISTS "Allow all authenticated users on price_list" ON public.price_list;
DROP POLICY IF EXISTS "Allow all authenticated users" ON public.price_list;

CREATE POLICY "price_list_select" ON public.price_list
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "price_list_insert" ON public.price_list
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()));

CREATE POLICY "price_list_update" ON public.price_list
  FOR UPDATE TO authenticated
  USING (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()));

CREATE POLICY "price_list_delete" ON public.price_list
  FOR DELETE TO authenticated
  USING (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()));

-- =============================================================================
-- FIX 1+2: price_stages — leitura livre, escrita apenas admin/master
-- =============================================================================
DROP POLICY IF EXISTS "Allow all authenticated users on price_stages" ON public.price_stages;
DROP POLICY IF EXISTS "Allow all authenticated users" ON public.price_stages;

CREATE POLICY "price_stages_select" ON public.price_stages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "price_stages_insert" ON public.price_stages
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()));

CREATE POLICY "price_stages_update" ON public.price_stages
  FOR UPDATE TO authenticated
  USING (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()));

CREATE POLICY "price_stages_delete" ON public.price_stages
  FOR DELETE TO authenticated
  USING (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()));

-- =============================================================================
-- FIX 1+2: clinica_consultorios — leitura livre, escrita apenas admin/master
-- =============================================================================
DROP POLICY IF EXISTS "Allow all authenticated users on clinica_consultorios" ON public.clinica_consultorios;
DROP POLICY IF EXISTS "Allow all authenticated users" ON public.clinica_consultorios;

CREATE POLICY "clinica_consultorios_select" ON public.clinica_consultorios
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "clinica_consultorios_insert" ON public.clinica_consultorios
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()));

CREATE POLICY "clinica_consultorios_update" ON public.clinica_consultorios
  FOR UPDATE TO authenticated
  USING (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()));

CREATE POLICY "clinica_consultorios_delete" ON public.clinica_consultorios
  FOR DELETE TO authenticated
  USING (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()));

-- =============================================================================
-- FIX 1: acessos (cofre de senhas) — habilitar RLS + acesso exclusivo admin/master
-- Credenciais sensíveis: nenhum colaborador operacional deve ler ou escrever
-- =============================================================================
ALTER TABLE public.acessos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all authenticated users" ON public.acessos;

CREATE POLICY "acessos_admin_only" ON public.acessos
  FOR ALL TO authenticated
  USING    (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()));

-- =============================================================================
-- FIX 2: role_permissions — leitura livre, escrita apenas master
-- Impede que qualquer usuário altere suas próprias permissões
-- =============================================================================
DROP POLICY IF EXISTS "Allow all authenticated users" ON public.role_permissions;

CREATE POLICY "role_permissions_select" ON public.role_permissions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "role_permissions_insert" ON public.role_permissions
  FOR INSERT TO authenticated
  WITH CHECK (public.is_master_user(auth.uid()));

CREATE POLICY "role_permissions_update" ON public.role_permissions
  FOR UPDATE TO authenticated
  USING (public.is_master_user(auth.uid()));

CREATE POLICY "role_permissions_delete" ON public.role_permissions
  FOR DELETE TO authenticated
  USING (public.is_master_user(auth.uid()));

-- =============================================================================
-- FIX 3: Agenda — INSERT/UPDATE/DELETE com restrições adequadas
-- =============================================================================
DROP POLICY IF EXISTS "Agenda insert" ON public.agenda;
DROP POLICY IF EXISTS "Agenda update" ON public.agenda;
DROP POLICY IF EXISTS "Agenda delete" ON public.agenda;

-- INSERT: Colaborador cria para si mesmo (requester ou assigned) OU admin/master
CREATE POLICY "Agenda insert" ON public.agenda
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_master_user(auth.uid()) OR
    public.is_admin_user(auth.uid()) OR
    requester_id = (SELECT id FROM public.employees WHERE user_id = auth.uid() LIMIT 1) OR
    assigned_to  = (SELECT id::text FROM public.employees WHERE user_id = auth.uid() LIMIT 1)
  );

-- UPDATE: Quem criou, quem foi designado, ou admin/master
CREATE POLICY "Agenda update" ON public.agenda
  FOR UPDATE TO authenticated
  USING (
    public.is_master_user(auth.uid()) OR
    public.is_admin_user(auth.uid()) OR
    requester_id = (SELECT id FROM public.employees WHERE user_id = auth.uid() LIMIT 1) OR
    assigned_to  = (SELECT id::text FROM public.employees WHERE user_id = auth.uid() LIMIT 1)
  );

-- DELETE: Apenas quem criou ou admin/master
CREATE POLICY "Agenda delete" ON public.agenda
  FOR DELETE TO authenticated
  USING (
    public.is_master_user(auth.uid()) OR
    public.is_admin_user(auth.uid()) OR
    requester_id = (SELECT id FROM public.employees WHERE user_id = auth.uid() LIMIT 1)
  );

-- =============================================================================
-- FIX 3: SAC records — INSERT/UPDATE/DELETE com restrições adequadas
-- =============================================================================
DROP POLICY IF EXISTS "Sac insert" ON public.sac_records;
DROP POLICY IF EXISTS "Sac update" ON public.sac_records;
DROP POLICY IF EXISTS "Sac delete" ON public.sac_records;

-- INSERT: Qualquer autenticado pode registrar reclamação/sugestão
CREATE POLICY "Sac insert" ON public.sac_records
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- UPDATE: Responsável, recepcionista, ou admin/master
CREATE POLICY "Sac update" ON public.sac_records
  FOR UPDATE TO authenticated
  USING (
    public.is_master_user(auth.uid()) OR
    public.is_admin_user(auth.uid()) OR
    responsible_employee_id = (SELECT id FROM public.employees WHERE user_id = auth.uid() LIMIT 1) OR
    receiving_employee_id   = (SELECT id FROM public.employees WHERE user_id = auth.uid() LIMIT 1)
  );

-- DELETE: Apenas admin/master
CREATE POLICY "Sac delete" ON public.sac_records
  FOR DELETE TO authenticated
  USING (
    public.is_master_user(auth.uid()) OR
    public.is_admin_user(auth.uid())
  );

-- =============================================================================
-- FIX 7: hub_announcement_reads — Usuário vê apenas suas próprias leituras
-- =============================================================================
DROP POLICY IF EXISTS "Users can read all hub_announcement_reads" ON public.hub_announcement_reads;

CREATE POLICY "hub_announcement_reads_select" ON public.hub_announcement_reads
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    public.is_admin_user(auth.uid()) OR
    public.is_master_user(auth.uid())
  );

-- =============================================================================
-- FIX 9: inventory_movements — Substituir política aberta por granular
-- =============================================================================
DROP POLICY IF EXISTS "Allow all authenticated users" ON public.inventory_movements;

-- SELECT: Todos autenticados veem histórico (necessário para rastreabilidade)
CREATE POLICY "inventory_movements_select" ON public.inventory_movements
  FOR SELECT TO authenticated USING (true);

-- INSERT: Colaborador registra seus próprios movimentos OU admin/master registra qualquer
CREATE POLICY "inventory_movements_insert" ON public.inventory_movements
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR
    public.is_admin_user(auth.uid()) OR
    public.is_master_user(auth.uid())
  );

-- UPDATE: Apenas admin/master pode corrigir movimentos registrados
CREATE POLICY "inventory_movements_update" ON public.inventory_movements
  FOR UPDATE TO authenticated
  USING (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()));

-- DELETE: Apenas admin/master pode remover movimentos
CREATE POLICY "inventory_movements_delete" ON public.inventory_movements
  FOR DELETE TO authenticated
  USING (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()));
