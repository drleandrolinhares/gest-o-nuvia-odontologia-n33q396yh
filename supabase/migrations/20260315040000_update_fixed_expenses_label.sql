DO $$
DECLARE
  rec RECORD;
  new_items JSONB;
BEGIN
  FOR rec IN SELECT id, hourly_cost_fixed_items FROM public.app_settings
  LOOP
    IF rec.hourly_cost_fixed_items IS NOT NULL AND jsonb_typeof(rec.hourly_cost_fixed_items) = 'array' THEN
      SELECT jsonb_agg(
               jsonb_build_object(
                 'id', COALESCE(item->>'id', gen_random_uuid()::text),
                 'label', COALESCE(item->>'label', item->>'name', ''),
                 'value', COALESCE((item->>'value')::numeric, 0)
               )
             )
      INTO new_items
      FROM jsonb_array_elements(rec.hourly_cost_fixed_items) AS item;

      UPDATE public.app_settings
      SET hourly_cost_fixed_items = new_items
      WHERE id = rec.id;
    END IF;
  END LOOP;
END $$;
