DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.app_settings) THEN
    INSERT INTO public.app_settings (hourly_cost_fixed_items, hourly_cost_monthly_hours)
    VALUES ('[{"id": "seed-1", "name": "CUSTOS FIXOS GERAIS DA CLÍNICA", "value": 70841.98}]'::jsonb, 160);
  ELSE
    UPDATE public.app_settings
    SET hourly_cost_fixed_items = '[{"id": "seed-1", "name": "CUSTOS FIXOS GERAIS DA CLÍNICA", "value": 70841.98}]'::jsonb
    WHERE id = (SELECT id FROM public.app_settings LIMIT 1);
  END IF;
END $$;
