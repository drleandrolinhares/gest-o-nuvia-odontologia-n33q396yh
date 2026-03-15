DO $$
BEGIN
  -- Insert a default app_settings row if it doesn't exist, otherwise update it
  IF NOT EXISTS (SELECT 1 FROM public.app_settings LIMIT 1) THEN
    INSERT INTO public.app_settings (
      global_card_fee, 
      global_commission, 
      global_inadimplency, 
      global_taxes, 
      hourly_cost_fixed_items, 
      hourly_cost_monthly_hours
    ) VALUES (
      0, 0, 0, 0,
      '[
        {"id": "e1", "description": "ALUGUEL", "gross_base_value": 15000, "periodicity_type": "Mensal", "calculated_monthly_cost": 15000},
        {"id": "e2", "description": "FOLHA DE PAGAMENTO E ENCARGOS", "gross_base_value": 45000, "periodicity_type": "Mensal", "calculated_monthly_cost": 45000},
        {"id": "e3", "description": "CUSTOS OPERACIONAIS (ÁGUA, LUZ, INTERNET)", "gross_base_value": 4500, "periodicity_type": "Mensal", "calculated_monthly_cost": 4500},
        {"id": "e4", "description": "MARKETING E SOFTWARES", "gross_base_value": 3000, "periodicity_type": "Mensal", "calculated_monthly_cost": 3000},
        {"id": "e5", "description": "IPTU E TAXAS", "gross_base_value": 12000, "periodicity_type": "Anual", "calculated_monthly_cost": 1000},
        {"id": "e6", "description": "MANUTENÇÃO E DIVERSOS", "gross_base_value": 2341.98, "periodicity_type": "Mensal", "calculated_monthly_cost": 2341.98}
      ]'::jsonb,
      160
    );
  ELSE
    UPDATE public.app_settings
    SET hourly_cost_fixed_items = '[
      {"id": "e1", "description": "ALUGUEL", "gross_base_value": 15000, "periodicity_type": "Mensal", "calculated_monthly_cost": 15000},
      {"id": "e2", "description": "FOLHA DE PAGAMENTO E ENCARGOS", "gross_base_value": 45000, "periodicity_type": "Mensal", "calculated_monthly_cost": 45000},
      {"id": "e3", "description": "CUSTOS OPERACIONAIS (ÁGUA, LUZ, INTERNET)", "gross_base_value": 4500, "periodicity_type": "Mensal", "calculated_monthly_cost": 4500},
      {"id": "e4", "description": "MARKETING E SOFTWARES", "gross_base_value": 3000, "periodicity_type": "Mensal", "calculated_monthly_cost": 3000},
      {"id": "e5", "description": "IPTU E TAXAS", "gross_base_value": 12000, "periodicity_type": "Anual", "calculated_monthly_cost": 1000},
      {"id": "e6", "description": "MANUTENÇÃO E DIVERSOS", "gross_base_value": 2341.98, "periodicity_type": "Mensal", "calculated_monthly_cost": 2341.98}
    ]'::jsonb;
  END IF;
END $$;
