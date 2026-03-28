DO $$
BEGIN
  -- Garante que todos os KPIs criados anteriormente tenham permissões ativas para seus respectivos donos (cargo_id)
  INSERT INTO public.kpis_permissoes (cargo_id, kpi_id, pode_visualizar, pode_editar)
  SELECT cargo_id, id, true, true
  FROM public.kpis_config
  WHERE cargo_id IS NOT NULL
  ON CONFLICT (cargo_id, kpi_id) DO NOTHING;
END $$;
