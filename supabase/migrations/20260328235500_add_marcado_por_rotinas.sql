ALTER TABLE public.rotinas_execucao ADD COLUMN IF NOT EXISTS marcado_por_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

DROP FUNCTION IF EXISTS public.registrar_execucao_rotina(uuid, uuid, date, numeric, integer);

CREATE OR REPLACE FUNCTION public.registrar_execucao_rotina(
    p_rotina_id uuid,
    p_usuario_id uuid,
    p_data date,
    p_percentual numeric,
    p_pontos integer,
    p_marcado_por_id uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    v_hoje DATE;
    v_agora TIME;
    v_horario_tarefa TIME;
BEGIN
    -- Verify Time constraints
    v_hoje := (NOW() AT TIME ZONE 'America/Sao_Paulo')::DATE;
    v_agora := (NOW() AT TIME ZONE 'America/Sao_Paulo')::TIME;

    IF p_data != v_hoje THEN
        RAISE EXCEPTION 'Só é permitido marcar rotinas do dia atual.';
    END IF;

    SELECT (horario || ':00')::TIME INTO v_horario_tarefa FROM public.rotinas_config WHERE id = p_rotina_id;
    IF v_horario_tarefa IS NOT NULL AND v_horario_tarefa > v_agora THEN
        RAISE EXCEPTION 'Ainda não é o horário permitido para marcar esta tarefa.';
    END IF;

    -- 1. Insert or Update Execution
    INSERT INTO public.rotinas_execucao (rotina_id, usuario_id, data, concluido, timestamp_conclusao, marcado_por_id)
    VALUES (p_rotina_id, p_usuario_id, p_data, true, NOW(), p_marcado_por_id)
    ON CONFLICT (rotina_id, usuario_id, data)
    DO UPDATE SET concluido = true, timestamp_conclusao = NOW(), marcado_por_id = p_marcado_por_id;

    -- 2. Update Points directly from frontend calculation
    INSERT INTO public.rotinas_pontos (usuario_id, data, pontos, percentual)
    VALUES (p_usuario_id, p_data, p_pontos, p_percentual)
    ON CONFLICT (usuario_id, data)
    DO UPDATE SET pontos = p_pontos, percentual = p_percentual;
END;
$function$;
