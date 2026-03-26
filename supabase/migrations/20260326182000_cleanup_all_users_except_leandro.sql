DO $$ 
BEGIN
  -- 1. Limpar tabelas que possuem FK (RESTRICT) para employees para evitar falhas de restrição
  DELETE FROM public.cash_box_closings 
  WHERE closed_by_id NOT IN (SELECT id FROM public.employees WHERE email ILIKE '%leandro%')
     OR received_by_id NOT IN (SELECT id FROM public.employees WHERE email ILIKE '%leandro%');

  -- 2. Limpar dependências de user_roles e permissões associadas aos usuários
  DELETE FROM public.user_roles 
  WHERE user_id NOT IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%');

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_permissions') THEN
    EXECUTE 'DELETE FROM public.user_permissions WHERE user_id NOT IN (SELECT id FROM auth.users WHERE email ILIKE ''%leandro%'')';
  END IF;

  -- 3. Limpar relacionamentos dos colaboradores baseados nas instruções (ajustado para nomes reais das colunas)
  DELETE FROM public.daily_routine_executions 
  WHERE employee_id NOT IN (SELECT id FROM public.employees WHERE email ILIKE '%leandro%');

  DELETE FROM public.employee_documents 
  WHERE employee_id NOT IN (SELECT id FROM public.employees WHERE email ILIKE '%leandro%');

  -- NOTA: consultorio_weekly_schedules NÃO possui a coluna employee_id na estrutura atual, 
  -- portanto foi ignorado para evitar erro fatal de SQL "column does not exist".
  
  -- NOTA: Em daily_routines, a coluna de relacionamento chama-se employee_id (não created_by)
  DELETE FROM public.daily_routines 
  WHERE employee_id NOT IN (SELECT id FROM public.employees WHERE email ILIKE '%leandro%');

  DELETE FROM public.checklist_diario 
  WHERE employee_id NOT IN (SELECT id FROM public.employees WHERE email ILIKE '%leandro%');

  DELETE FROM public.performance_diaria 
  WHERE employee_id NOT IN (SELECT id FROM public.employees WHERE email ILIKE '%leandro%');

  -- 4. Deletar os colaboradores não desejados (Tratando também e-mails nulos)
  DELETE FROM public.employees 
  WHERE email NOT ILIKE '%leandro%' OR email IS NULL;

  -- 5. Limpar dependências de auth.users antes da exclusão final
  DELETE FROM public.chat_participants WHERE user_id NOT IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%');
  DELETE FROM public.chat_messages WHERE sender_id NOT IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%');
  DELETE FROM public.hub_announcement_reads WHERE user_id NOT IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%');
  DELETE FROM public.hub_feedbacks WHERE user_id NOT IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%');
  DELETE FROM public.innovation_records WHERE user_id NOT IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%');
  DELETE FROM public.monthly_readings WHERE user_id NOT IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%');
  DELETE FROM public.ser_5s_submissions WHERE user_id NOT IN (SELECT id FROM auth.users WHERE email ILIKE '%leandro%');

  -- 6. Deletar os usuários do sistema (auth.users)
  DELETE FROM auth.users 
  WHERE email NOT ILIKE '%leandro%';

END $$;
