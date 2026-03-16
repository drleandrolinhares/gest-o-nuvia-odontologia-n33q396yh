UPDATE public.app_settings 
SET negotiation_settings = CASE 
  WHEN negotiation_settings IS NULL THEN 
    '{"ranges": [{"min": 1000, "max": 2999.99, "maxInstallments": 4}, {"min": 3000, "max": 4999.99, "maxInstallments": 8}, {"min": 5000, "max": 7999.99, "maxInstallments": 12}, {"min": 8000, "max": 11999.99, "maxInstallments": 18}, {"min": 12000, "max": 9999999, "maxInstallments": 24}], "defaultEntryPercentage": 30, "discounts": {"level1": 15, "level2": 5, "level3": 3, "level4": 0}}'::jsonb
  ELSE 
    jsonb_set(negotiation_settings, '{discounts}', '{"level1": 15, "level2": 5, "level3": 3, "level4": 0}'::jsonb)
  END
WHERE negotiation_settings->'discounts' IS NULL;

