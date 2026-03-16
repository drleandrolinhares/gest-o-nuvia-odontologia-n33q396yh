DO $$ 
BEGIN 
  UPDATE public.app_settings 
  SET negotiation_settings = jsonb_set(
      negotiation_settings,
      '{ranges}',
      '[{"max": 2999.99, "min": 1000, "maxInstallments": 4}, {"max": 4999.99, "min": 3000, "maxInstallments": 8}, {"max": 7999.99, "min": 5000, "maxInstallments": 12}, {"max": 11999.99, "min": 8000, "maxInstallments": 20}, {"max": 9999999, "min": 12000, "maxInstallments": 24}]'::jsonb
  )
  WHERE negotiation_settings IS NOT NULL AND negotiation_settings ? 'ranges';
END $$;
