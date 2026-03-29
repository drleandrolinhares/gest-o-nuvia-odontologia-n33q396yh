-- 1. Create table
CREATE TABLE IF NOT EXISTS public.user_cargos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cargo VARCHAR(100),
  cargo_id UUID REFERENCES public.cargos(id) ON DELETE CASCADE,
  is_principal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Migrate data
INSERT INTO public.user_cargos (user_id, cargo, cargo_id, is_principal)
SELECT p.id, c.nome, p.cargo_id, true
FROM public.profiles p
JOIN public.cargos c ON p.cargo_id = c.id
WHERE p.cargo_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- 3. Replace Function that uses profiles.cargo_id
CREATE OR REPLACE FUNCTION public.marcar_rotina_concluida(p_rotina_id uuid, p_usuario_id uuid, p_data date)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
    v_cargo_id UUID;
    v_total_tarefas INT;
    v_concluidas INT;
    v_percentual NUMERIC;
    v_pontos INT;
    v_dia_semana TEXT;
    v_dias_map TEXT[] := ARRAY['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    v_hoje DATE;
    v_agora TIME;
    v_horario_tarefa TIME;
BEGIN
    v_hoje := (NOW() AT TIME ZONE 'America/Sao_Paulo')::DATE;
    v_agora := (NOW() AT TIME ZONE 'America/Sao_Paulo')::TIME;
    
    IF p_data != v_hoje THEN
        RAISE EXCEPTION 'Só é permitido marcar rotinas do dia atual.';
    END IF;

    SELECT (horario || ':00')::TIME INTO v_horario_tarefa FROM public.rotinas_config WHERE id = p_rotina_id;
    IF v_horario_tarefa IS NOT NULL AND v_horario_tarefa > v_agora THEN
        RAISE EXCEPTION 'Ainda não é o horário permitido para marcar esta tarefa.';
    END IF;

    INSERT INTO public.rotinas_execucao (rotina_id, usuario_id, data, concluido, timestamp_conclusao)
    VALUES (p_rotina_id, p_usuario_id, p_data, true, NOW())
    ON CONFLICT (rotina_id, usuario_id, data)
    DO UPDATE SET concluido = true, timestamp_conclusao = NOW() WHERE public.rotinas_execucao.concluido = false;

    SELECT cargo_id INTO v_cargo_id FROM public.user_cargos WHERE user_id = p_usuario_id AND is_principal = true LIMIT 1;
    v_dia_semana := v_dias_map[EXTRACT(DOW FROM p_data) + 1];

    SELECT COUNT(*) INTO v_total_tarefas
    FROM public.rotinas_config
    WHERE (colaborador_id = p_usuario_id OR (cargo_id = v_cargo_id AND colaborador_id IS NULL))
      AND (dias_semana ? v_dia_semana);

    IF v_total_tarefas = 0 THEN
        v_total_tarefas := 1;
    END IF;

    SELECT COUNT(*) INTO v_concluidas
    FROM public.rotinas_execucao re
    JOIN public.rotinas_config rc ON re.rotina_id = rc.id
    WHERE re.usuario_id = p_usuario_id
      AND re.data = p_data
      AND re.concluido = true
      AND (rc.colaborador_id = p_usuario_id OR (rc.cargo_id = v_cargo_id AND rc.colaborador_id IS NULL));

    v_percentual := (v_concluidas::NUMERIC / v_total_tarefas::NUMERIC) * 100;
    v_pontos := ROUND(v_percentual / 10);

    INSERT INTO public.rotinas_pontos (usuario_id, data, pontos, percentual)
    VALUES (p_usuario_id, p_data, v_pontos, v_percentual)
    ON CONFLICT (usuario_id, data)
    DO UPDATE SET pontos = EXCLUDED.pontos, percentual = EXCLUDED.percentual;
END;
$$;

-- 4. Replace Policies
DROP POLICY IF EXISTS "rotinas_config_select" ON public.rotinas_config;
CREATE POLICY "rotinas_config_select" ON public.rotinas_config
  FOR SELECT TO authenticated
  USING (
    public.is_admin_user(auth.uid()) 
    OR public.is_master_user(auth.uid()) 
    OR (colaborador_id = auth.uid()) 
    OR ((colaborador_id IS NULL) AND (cargo_id IN (SELECT uc.cargo_id FROM public.user_cargos uc WHERE uc.user_id = auth.uid())))
  );

DROP POLICY IF EXISTS "rotinas_execucao_delete" ON public.rotinas_execucao;
CREATE POLICY "rotinas_execucao_delete" ON public.rotinas_execucao
  FOR DELETE TO authenticated
  USING ((usuario_id = auth.uid()) OR public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()) OR (EXISTS (SELECT 1 FROM public.user_cargos uc WHERE uc.user_id = auth.uid() AND uc.cargo = 'CEO')));

DROP POLICY IF EXISTS "rotinas_execucao_insert" ON public.rotinas_execucao;
CREATE POLICY "rotinas_execucao_insert" ON public.rotinas_execucao
  FOR INSERT TO authenticated
  WITH CHECK ((usuario_id = auth.uid()) OR public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()) OR (EXISTS (SELECT 1 FROM public.user_cargos uc WHERE uc.user_id = auth.uid() AND uc.cargo = 'CEO')));

DROP POLICY IF EXISTS "rotinas_execucao_update" ON public.rotinas_execucao;
CREATE POLICY "rotinas_execucao_update" ON public.rotinas_execucao
  FOR UPDATE TO authenticated
  USING ((usuario_id = auth.uid()) OR public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()) OR (EXISTS (SELECT 1 FROM public.user_cargos uc WHERE uc.user_id = auth.uid() AND uc.cargo = 'CEO')));

DROP POLICY IF EXISTS "rotinas_pontos_delete" ON public.rotinas_pontos;
CREATE POLICY "rotinas_pontos_delete" ON public.rotinas_pontos
  FOR DELETE TO authenticated
  USING ((usuario_id = auth.uid()) OR public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()) OR (EXISTS (SELECT 1 FROM public.user_cargos uc WHERE uc.user_id = auth.uid() AND uc.cargo = 'CEO')));

DROP POLICY IF EXISTS "rotinas_pontos_insert" ON public.rotinas_pontos;
CREATE POLICY "rotinas_pontos_insert" ON public.rotinas_pontos
  FOR INSERT TO authenticated
  WITH CHECK ((usuario_id = auth.uid()) OR public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()) OR (EXISTS (SELECT 1 FROM public.user_cargos uc WHERE uc.user_id = auth.uid() AND uc.cargo = 'CEO')));

DROP POLICY IF EXISTS "rotinas_pontos_update" ON public.rotinas_pontos;
CREATE POLICY "rotinas_pontos_update" ON public.rotinas_pontos
  FOR UPDATE TO authenticated
  USING ((usuario_id = auth.uid()) OR public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()) OR (EXISTS (SELECT 1 FROM public.user_cargos uc WHERE uc.user_id = auth.uid() AND uc.cargo = 'CEO')));

-- 5. Drop the column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS cargo_id;

-- 6. Setup RLS for user_cargos
ALTER TABLE public.user_cargos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin CRUD user_cargos" ON public.user_cargos;
CREATE POLICY "Admin CRUD user_cargos" ON public.user_cargos
  FOR ALL TO authenticated
  USING (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()) OR public.is_master_user(auth.uid()));

DROP POLICY IF EXISTS "Users view own user_cargos" ON public.user_cargos;
CREATE POLICY "Users view own user_cargos" ON public.user_cargos
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());
