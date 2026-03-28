DO $$
BEGIN
    -- Update RLS for rotinas_config to enforce row level security strictly
    DROP POLICY IF EXISTS "rotinas_config_select" ON public.rotinas_config;
    CREATE POLICY "rotinas_config_select" ON public.rotinas_config 
    FOR SELECT TO authenticated 
    USING (
        is_admin_user(auth.uid()) 
        OR is_master_user(auth.uid())
        OR cargo_id IN (SELECT cargo_id FROM public.profiles WHERE id = auth.uid())
    );

END $$;

-- Update Function to mark routine complete and update points
-- Validates that the action is for the current day.
CREATE OR REPLACE FUNCTION public.marcar_rotina_concluida(
    p_rotina_id UUID,
    p_usuario_id UUID,
    p_data DATE
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $func$
DECLARE
    v_cargo_id UUID;
    v_total_tarefas INT;
    v_concluidas INT;
    v_percentual NUMERIC;
    v_pontos INT;
    v_dia_semana TEXT;
    v_dias_map TEXT[] := ARRAY['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    v_hoje DATE;
BEGIN
    -- Verify Date (only allow current date in America/Sao_Paulo)
    v_hoje := (NOW() AT TIME ZONE 'America/Sao_Paulo')::DATE;
    
    IF p_data != v_hoje THEN
        RAISE EXCEPTION 'Só é permitido marcar rotinas do dia atual.';
    END IF;

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
$func$;
