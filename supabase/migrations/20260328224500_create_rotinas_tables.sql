DO $$
BEGIN
    -- Config table
    CREATE TABLE IF NOT EXISTS public.rotinas_config (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cargo_id UUID NOT NULL REFERENCES public.cargos(id) ON DELETE CASCADE,
        acao TEXT NOT NULL,
        horario TEXT NOT NULL,
        dias_semana JSONB NOT NULL DEFAULT '[]'::jsonb,
        frequencia TEXT NOT NULL DEFAULT 'diario',
        data_inicio DATE,
        data_fim DATE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Execucao table
    CREATE TABLE IF NOT EXISTS public.rotinas_execucao (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rotina_id UUID NOT NULL REFERENCES public.rotinas_config(id) ON DELETE CASCADE,
        usuario_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
        data DATE NOT NULL,
        concluido BOOLEAN NOT NULL DEFAULT FALSE,
        timestamp_conclusao TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    
    -- Ensure unique execution per task per user per day
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rotinas_execucao_unique') THEN
        ALTER TABLE public.rotinas_execucao ADD CONSTRAINT rotinas_execucao_unique UNIQUE (rotina_id, usuario_id, data);
    END IF;

    -- Pontos table
    CREATE TABLE IF NOT EXISTS public.rotinas_pontos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
        data DATE NOT NULL,
        pontos INTEGER NOT NULL DEFAULT 0,
        percentual NUMERIC NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Ensure unique points per user per day
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rotinas_pontos_unique') THEN
        ALTER TABLE public.rotinas_pontos ADD CONSTRAINT rotinas_pontos_unique UNIQUE (usuario_id, data);
    END IF;

END $$;

-- Policies for rotinas_config
ALTER TABLE public.rotinas_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "rotinas_config_select" ON public.rotinas_config;
CREATE POLICY "rotinas_config_select" ON public.rotinas_config FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "rotinas_config_admin_all" ON public.rotinas_config;
CREATE POLICY "rotinas_config_admin_all" ON public.rotinas_config FOR ALL TO authenticated USING (is_admin_user(auth.uid()) OR is_master_user(auth.uid()));

-- Policies for rotinas_execucao
ALTER TABLE public.rotinas_execucao ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "rotinas_execucao_select" ON public.rotinas_execucao;
CREATE POLICY "rotinas_execucao_select" ON public.rotinas_execucao FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "rotinas_execucao_insert" ON public.rotinas_execucao;
CREATE POLICY "rotinas_execucao_insert" ON public.rotinas_execucao FOR INSERT TO authenticated WITH CHECK (usuario_id = auth.uid());

DROP POLICY IF EXISTS "rotinas_execucao_update" ON public.rotinas_execucao;
CREATE POLICY "rotinas_execucao_update" ON public.rotinas_execucao FOR UPDATE TO authenticated USING (usuario_id = auth.uid());

-- Policies for rotinas_pontos
ALTER TABLE public.rotinas_pontos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "rotinas_pontos_select" ON public.rotinas_pontos;
CREATE POLICY "rotinas_pontos_select" ON public.rotinas_pontos FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "rotinas_pontos_insert" ON public.rotinas_pontos;
CREATE POLICY "rotinas_pontos_insert" ON public.rotinas_pontos FOR INSERT TO authenticated WITH CHECK (usuario_id = auth.uid());

DROP POLICY IF EXISTS "rotinas_pontos_update" ON public.rotinas_pontos;
CREATE POLICY "rotinas_pontos_update" ON public.rotinas_pontos FOR UPDATE TO authenticated USING (usuario_id = auth.uid());


-- Function to mark routine complete and update points
CREATE OR REPLACE FUNCTION public.marcar_rotina_concluida(
    p_rotina_id UUID,
    p_usuario_id UUID,
    p_data DATE
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_cargo_id UUID;
    v_total_tarefas INT;
    v_concluidas INT;
    v_percentual NUMERIC;
    v_pontos INT;
    v_dia_semana TEXT;
    v_dias_map TEXT[] := ARRAY['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
BEGIN
    -- 1. Insert or Update Execution
    INSERT INTO public.rotinas_execucao (rotina_id, usuario_id, data, concluido, timestamp_conclusao)
    VALUES (p_rotina_id, p_usuario_id, p_data, true, NOW())
    ON CONFLICT (rotina_id, usuario_id, data)
    DO UPDATE SET concluido = true, timestamp_conclusao = NOW() WHERE public.rotinas_execucao.concluido = false;

    -- 2. Recalculate Points
    SELECT cargo_id INTO v_cargo_id FROM public.profiles WHERE id = p_usuario_id;
    v_dia_semana := v_dias_map[EXTRACT(DOW FROM p_data) + 1];

    -- Total Tasks for this Cargo today
    SELECT COUNT(*) INTO v_total_tarefas
    FROM public.rotinas_config
    WHERE cargo_id = v_cargo_id
      AND (dias_semana ? v_dia_semana);

    IF v_total_tarefas = 0 THEN
        v_total_tarefas := 1;
    END IF;

    -- Completed Tasks
    SELECT COUNT(*) INTO v_concluidas
    FROM public.rotinas_execucao re
    JOIN public.rotinas_config rc ON re.rotina_id = rc.id
    WHERE re.usuario_id = p_usuario_id
      AND re.data = p_data
      AND re.concluido = true
      AND rc.cargo_id = v_cargo_id;

    v_percentual := (v_concluidas::NUMERIC / v_total_tarefas::NUMERIC) * 100;
    v_pontos := ROUND(v_percentual / 10);

    INSERT INTO public.rotinas_pontos (usuario_id, data, pontos, percentual)
    VALUES (p_usuario_id, p_data, v_pontos, v_percentual)
    ON CONFLICT (usuario_id, data)
    DO UPDATE SET pontos = EXCLUDED.pontos, percentual = EXCLUDED.percentual;
END;
$$;
